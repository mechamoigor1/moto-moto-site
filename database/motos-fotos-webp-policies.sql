insert into storage.buckets (id, name, public)
values ('motos-fotos-webp', 'motos-fotos-webp', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "motos_fotos_webp_select_publica" on storage.objects;
create policy "motos_fotos_webp_select_publica" on storage.objects for select using (bucket_id = 'motos-fotos-webp');
drop policy if exists "motos_fotos_webp_insert_admin" on storage.objects;
create policy "motos_fotos_webp_insert_admin" on storage.objects for insert with check (bucket_id = 'motos-fotos-webp' and is_admin_ou_editor());
drop policy if exists "motos_fotos_webp_update_admin" on storage.objects;
create policy "motos_fotos_webp_update_admin" on storage.objects for update using (bucket_id = 'motos-fotos-webp' and is_admin_ou_editor());
drop policy if exists "motos_fotos_webp_delete_admin" on storage.objects;
create policy "motos_fotos_webp_delete_admin" on storage.objects for delete using (bucket_id = 'motos-fotos-webp' and is_admin_ou_editor());
