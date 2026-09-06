create policy "Users can upload own avatar"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'covers'
  and (storage.foldername(name))[1] = 'avatars'
  and (storage.foldername(name))[2] = auth.uid()::text
);

create policy "Users can update own avatar"
on storage.objects for update to authenticated
using (
  bucket_id = 'covers'
  and (storage.foldername(name))[1] = 'avatars'
  and (storage.foldername(name))[2] = auth.uid()::text
);