-- Crie a tabela para armazenar as campanhas
create table campaigns (
  user_id uuid references auth.users not null primary key,
  data jsonb not null
);

-- Habilite o RLS (Segurança a nível de linha)
alter table campaigns enable row level security;

-- Crie a política para permitir que o usuário veja e edite apenas a sua própria campanha
create policy "Users can manage their own campaign"
on campaigns
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
