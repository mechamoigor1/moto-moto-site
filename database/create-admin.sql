-- Depois de criar o usuário em Authentication > Users no dashboard do Supabase
-- (ou via convite por e-mail), rode este SQL para dar a ele acesso ao painel /admin.
--
-- Troque o e-mail abaixo pelo e-mail do usuário que você acabou de criar.

insert into public.profiles (user_id, nome, role)
select id, email, 'admin'
from auth.users
where email = 'SEU-EMAIL-AQUI@exemplo.com'
on conflict (user_id) do update set role = 'admin';
