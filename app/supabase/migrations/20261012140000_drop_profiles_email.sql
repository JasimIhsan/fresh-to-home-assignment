-- profiles.email duplicated auth.users.email; read it from auth.users instead.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (user_id, full_name)
  values (
    new.id,
    left(trim(coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      ''
    )), 120)
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_email_changed on auth.users;
drop function if exists public.handle_user_email_change();

alter table public.profiles drop column email;
