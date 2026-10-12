# Supabase

- `migrations/` — schema: `products`, `orders`, RLS policies, `is_admin()`, and
  the `place_order` RPC (prices orders server-side from `products`).
- `seed.sql` — the initial product catalog.

Apply with the Supabase CLI (`supabase db push` then `psql -f seed.sql`), or
paste into the SQL editor.

## Admin users

Admins are regular Supabase Auth users whose `app_metadata.role` is `"admin"`.
`app_metadata` can only be written with the service role, so users cannot
promote themselves. Create the user (sign up or Dashboard → Auth → Add user),
then run:

```sql
update auth.users
set raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'
where email = 'admin@example.com';
```

The user must sign in again for the new role to appear in their token.
