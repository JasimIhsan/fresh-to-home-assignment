-- Reverts 20261012140000_drop_profiles_email: keep a copy of the user's email
-- on profiles (auth.users is not exposed through the Data API).

alter table public.profiles add column email text;

update public.profiles p
set email = u.email
from auth.users u
where u.id = p.user_id;

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

revoke execute on function public.handle_user_email_change() from public, anon, authenticated;
