# Supabase

- `migrations/` — schema: `products`, `orders`, `profiles`, RLS policies,
  `is_admin()`, and the `place_order` RPC (prices orders server-side from
  `products`). Every table uses a `bigint generated always as identity` id.
- `seed.sql` — the initial product catalog.

Apply with the Supabase CLI (`supabase db push` then `psql -f seed.sql`), or
paste into the SQL editor.

## Sign up (email OTP)

Sign up collects full name, email and password, then the user enters a
6-digit code from their email to activate the account. A trigger on
`auth.users` creates their `profiles` row with role `customer`.

Required Auth settings (Dashboard → Authentication):

- **Sign In / Providers → Email:** "Confirm email" enabled; "Email OTP
  Length" = 6 (matches `OTP_LENGTH` in `src/services/validation.ts`).
- **Emails → Templates → Confirm signup:** include the code, e.g.
  `<p>Your code: <strong>{{ .Token }}</strong></p>`. The default template
  only sends a link.

## Admin users

`profiles.role` is the source of truth. A trigger mirrors it into
`app_metadata.role` (only writable by the service role), which `is_admin()`
and the proxy read from the JWT. Users cannot change their own role. To
promote someone:

```sql
update public.profiles set role = 'admin' where email = 'admin@example.com';
```

The user must sign in again for the new role to appear in their token.
