-- Server-side setup only. Replace with the locally generated bcrypt hash,
-- never the plaintext passcode. No email is sent or required from the owner.
do $$
declare owner_hash text := 'REPLACE_WITH_BCRYPT_HASH'; owner_id uuid;
begin
  if owner_hash !~ '^\$2[aby]\$12\$.{53}$' then raise exception 'Supply the locally prepared bcrypt hash'; end if;
  select id into owner_id from auth.users where email='owner@united-super-store.invalid';
  if owner_id is not null then raise exception 'Owner already provisioned; rotate access through the project administrator'; end if;
  owner_id := gen_random_uuid();
  insert into auth.users(instance_id,id,aud,role,email,encrypted_password,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at,confirmation_token,recovery_token,email_change,email_change_token_new,email_change_token_current,reauthentication_token)
  values('00000000-0000-0000-0000-000000000000',owner_id,'authenticated','authenticated','owner@united-super-store.invalid',owner_hash,now(),'{"provider":"email","providers":["email"]}','{"full_name":"Ahmad"}',now(),now(),'','','','','','');
  insert into auth.identities(provider_id,user_id,identity_data,provider,created_at,updated_at)
  values(owner_id::text,owner_id,jsonb_build_object('sub',owner_id,'email','owner@united-super-store.invalid'),'email',now(),now());
  insert into private.admin_users(user_id) values(owner_id);
end;
$$;
