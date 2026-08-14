# Integridade entre banco e Storage

## Objetivo

Evitar a perda de referências e o acúmulo de arquivos órfãos ao enviar ou excluir fotos de motos, além de restringir o destino após login a rotas internas do painel.

## Exclusão de foto

O sistema identifica bucket e caminho pela URL armazenada. Primeiro remove o objeto no Supabase Storage; apenas quando essa operação for bem-sucedida remove a linha correspondente de `imagens`.

Se o Storage recusar ou falhar a remoção, a linha do banco permanece intacta e a interface mostra o erro. Assim o administrador pode tentar novamente sem perder a referência à foto.

## Exclusão de moto

Antes de apagar a moto, o sistema lê todas as URLs das imagens relacionadas. Remove cada objeto de Storage e só depois exclui a moto; o cascade do banco remove as linhas de `imagens`.

Caso qualquer objeto falhe, a moto e todos os registros do banco permanecem. Os objetos que já tiverem sido removidos serão informados pelo erro como estado parcial e a operação poderá ser tentada novamente; URLs de objetos já inexistentes serão tratadas como remoção concluída.

## Upload

Depois do upload do WebP, o painel tenta criar a linha em `imagens`. Se a operação do banco falhar, o painel remove imediatamente o objeto recém-enviado e reporta a falha original. Isso impede novos arquivos sem referência.

## Retorno após login

O campo `next` só será usado se representar um caminho interno que comece com uma barra simples (`/`) e não com duas barras (`//`). Valores externos, inválidos ou vazios direcionam para `/admin`.

## Verificação

- Testes de parsing de URL continuam cobrindo buckets legado e WebP.
- Testes de unidade verificam a normalização de destino pós-login.
- Testes das ações usam um cliente Supabase fake para confirmar a ordem Storage → banco e o rollback de upload.
- Executar testes, TypeScript, lint e build antes da entrega.
