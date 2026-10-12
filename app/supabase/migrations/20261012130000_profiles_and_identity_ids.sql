-- Profiles for every auth user, and auto-increment (bigint identity) ids on
-- every application table.

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------

create type public.user_role as enum ('customer', 'admin');

create table public.profiles (
  id bigint generated always as identity primary key,
  user_id uuid not null unique references auth.users (id) on delete cascade,
  full_name text not null default '' check (char_length(full_name) <= 120),
  email text,
  role public.user_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users read own profile, admins read all"
  on public.profiles for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));

create policy "Users update own profile"
  on public.profiles for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- Users may only edit their name; role/email are managed by triggers and the
-- service role. Rows are only created by handle_new_user.
revoke insert, update, delete on public.profiles from anon, authenticated;
grant update (full_name) on public.profiles to authenticated;

-- Provisions a profile when Supabase Auth creates a user. The role is never
-- read from user_metadata (user-editable), so sign ups are always customers.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (user_id, full_name, email)
  values (
    new.id,
    left(trim(coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      ''
    )), 120),
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.handle_user_email_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles set email = new.email, updated_at = now()
  where user_id = new.id;
  return new;
end;
$$;

create trigger on_auth_user_email_changed
  after update of email on auth.users
  for each row when (old.email is distinct from new.email)
  execute function public.handle_user_email_change();

-- profiles.role is the source of truth. It is mirrored into
-- app_metadata.role so is_admin() and the proxy can read it from the JWT.
create or replace function public.sync_profile_role()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update auth.users
  set raw_app_meta_data =
    coalesce(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', new.role)
  where id = new.user_id;
  return new;
end;
$$;

create trigger on_profile_role_changed
  after insert or update of role on public.profiles
  for each row execute function public.sync_profile_role();

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.handle_user_email_change() from public, anon, authenticated;
revoke execute on function public.sync_profile_role() from public, anon, authenticated;

-- Backfill users created before this migration, keeping existing admins.
insert into public.profiles (user_id, full_name, email, role)
select
  u.id,
  left(trim(coalesce(u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name', '')), 120),
  u.email,
  case when u.raw_app_meta_data ->> 'role' = 'admin'
    then 'admin'::public.user_role else 'customer'::public.user_role end
from auth.users u
on conflict (user_id) do nothing;

-- ---------------------------------------------------------------------------
-- products.id: text ('p1') -> bigint identity, keeping the numeric part
-- ---------------------------------------------------------------------------

alter table public.products alter column id drop default;
alter table public.products
  alter column id type bigint using (substring(id from '\d+'))::bigint;
alter table public.products alter column id add generated always as identity;
select setval(
  pg_get_serial_sequence('public.products', 'id'),
  coalesce((select max(id) from public.products), 0) + 1,
  false
);

-- ---------------------------------------------------------------------------
-- orders.id: text ('ORD-…') -> bigint identity
-- ---------------------------------------------------------------------------

alter table public.orders alter column id drop default;
alter table public.orders add column new_id bigint generated always as identity;
alter table public.orders drop constraint orders_pkey;
alter table public.orders drop column id;
alter table public.orders rename column new_id to id;
alter table public.orders add primary key (id);

-- ---------------------------------------------------------------------------
-- place_order: product ids are now bigint
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
  v_product_id text;
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

    v_product_id := v_line ->> 'productId';
    if v_product_id is null or v_product_id !~ '^[1-9][0-9]{0,14}$' then
      raise exception 'product_unavailable' using errcode = '22023';
    end if;

    select * into v_product from public.products
      where id = v_product_id::bigint
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
