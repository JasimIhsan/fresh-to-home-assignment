-- Catalog and orders schema. Admin privileges come from app_metadata.role,
-- which only the service role can write (user_metadata is user-editable).

create or replace function public.is_admin()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

create table public.products (
  id text primary key default ('p-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12)),
  name text not null check (char_length(name) between 1 and 120),
  description text not null default '' check (char_length(description) <= 2000),
  price_per_kg numeric(10, 2) not null check (price_per_kg >= 0),
  image_url text not null default '' check (char_length(image_url) <= 500),
  category text not null check (char_length(category) between 1 and 60),
  stock_kg numeric(10, 2) not null default 0 check (stock_kg >= 0),
  origin text check (char_length(origin) <= 120),
  unit text not null default 'kg',
  sku text unique,
  barcode text,
  tags text[] not null default '{}',
  reserved_stock_kg numeric(10, 2) not null default 0 check (reserved_stock_kg >= 0),
  reorder_point_kg numeric(10, 2) not null default 15 check (reorder_point_kg >= 0),
  wholesale_cost_per_kg numeric(10, 2) check (wholesale_cost_per_kg >= 0),
  status text not null default 'draft' check (status in ('draft', 'active', 'archived')),
  visibility text not null default 'public' check (visibility in ('public', 'hidden')),
  gallery_images text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by text,
  updated_by text
);

create index products_storefront_idx on public.products (category, name)
  where status = 'active' and visibility = 'public';

create table public.orders (
  id text primary key default ('ORD-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  user_id uuid not null references auth.users (id) on delete cascade,
  user_email text,
  customer_name text not null,
  phone text not null,
  -- Snapshot of the purchased lines: [{ product: {...}, weightKg }]
  items jsonb not null check (jsonb_typeof(items) = 'array'),
  total_amount numeric(10, 2) not null check (total_amount >= 0),
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  address text not null,
  delivery_slot text,
  payment_method text,
  notes text check (char_length(notes) <= 500),
  created_at timestamptz not null default now()
);

create index orders_user_created_idx on public.orders (user_id, created_at desc);
create index orders_created_idx on public.orders (created_at desc);

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------

alter table public.products enable row level security;
alter table public.orders enable row level security;

create policy "Storefront products are public"
  on public.products for select
  to anon, authenticated
  using ((status = 'active' and visibility = 'public') or (select public.is_admin()));

create policy "Admins insert products"
  on public.products for insert to authenticated
  with check ((select public.is_admin()));

create policy "Admins update products"
  on public.products for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Admins delete products"
  on public.products for delete to authenticated
  using ((select public.is_admin()));

create policy "Customers read own orders, admins read all"
  on public.orders for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));

create policy "Admins update orders"
  on public.orders for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- Customers never insert orders directly; place_order prices them server-side.

-- ---------------------------------------------------------------------------
-- place_order: prices the cart from the products table so clients cannot
-- tamper with totals. Mirrors FREE_SHIPPING_THRESHOLD / DELIVERY_FEE in
-- src/services/cart.service.ts.
-- ---------------------------------------------------------------------------

create or replace function public.place_order(
  p_items jsonb,
  p_customer_name text,
  p_phone text,
  p_address text,
  p_delivery_slot text,
  p_payment_method text,
  p_notes text
)
returns public.orders
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_email text := auth.jwt() ->> 'email';
  v_lines jsonb := '[]'::jsonb;
  v_subtotal numeric := 0;
  v_fee numeric;
  v_line jsonb;
  v_weight numeric;
  v_product public.products;
  v_order public.orders;
begin
  if v_user_id is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0
     or jsonb_array_length(p_items) > 50 then
    raise exception 'invalid_items' using errcode = '22023';
  end if;

  for v_line in select * from jsonb_array_elements(p_items) loop
    v_weight := round((v_line ->> 'weightKg')::numeric, 1);
    if v_weight is null or v_weight <= 0 or v_weight > 50 then
      raise exception 'invalid_weight' using errcode = '22023';
    end if;

    select * into v_product from public.products
      where id = v_line ->> 'productId'
        and status = 'active' and visibility = 'public';
    if not found then
      raise exception 'product_unavailable' using errcode = '22023';
    end if;

    v_subtotal := v_subtotal + v_product.price_per_kg * v_weight;
    v_lines := v_lines || jsonb_build_array(jsonb_build_object(
      'weightKg', v_weight,
      'product', jsonb_build_object(
        'id', v_product.id,
        'name', v_product.name,
        'description', v_product.description,
        'pricePerKg', v_product.price_per_kg,
        'imageUrl', v_product.image_url,
        'category', v_product.category,
        'origin', v_product.origin,
        'isAvailable', true
      )
    ));
  end loop;

  v_fee := case when v_subtotal >= 50 then 0 else 4.90 end;

  insert into public.orders (
    user_id, user_email, customer_name, phone, items, total_amount,
    address, delivery_slot, payment_method, notes
  ) values (
    v_user_id, v_email,
    left(coalesce(nullif(trim(p_customer_name), ''), split_part(v_email, '@', 1), 'Kunde'), 120),
    left(trim(p_phone), 40), v_lines, round(v_subtotal + v_fee, 2),
    left(trim(p_address), 300), left(p_delivery_slot, 120),
    left(p_payment_method, 60), left(p_notes, 500)
  ) returning * into v_order;

  return v_order;
end;
$$;

revoke execute on function public.place_order(jsonb, text, text, text, text, text, text) from public, anon;
grant execute on function public.place_order(jsonb, text, text, text, text, text, text) to authenticated;
