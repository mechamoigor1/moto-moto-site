# Upload de fotos WebP no painel administrativo

## Objetivo

Depois da migração das fotos existentes para o bucket `motos-fotos-webp`, todo novo upload feito no painel administrativo deve ser convertido para WebP antes de chegar ao Supabase. O sistema deve armazenar e servir apenas a URL WebP, preservando o funcionamento das fotos já migradas.

## Abordagem escolhida

A conversão será feita no navegador, antes do upload. Esta abordagem evita enviar o arquivo original, não requer chave de serviço nem processamento de imagem no servidor, e aproveita as políticas atuais do Supabase para usuários administrativos.

## Fluxo de upload

1. O administrador escolhe uma ou mais imagens pelo componente `ImagensUploader`.
2. Para cada arquivo, o navegador o decodifica, aplica a orientação EXIF e o reduz proporcionalmente para que o maior lado não ultrapasse 1600 px. Imagens menores não são ampliadas.
3. A imagem é serializada em WebP, com qualidade 80.
4. O painel envia o resultado para `motos-fotos-webp`, no caminho `<motoId>/<uuid>.webp`, com `contentType` `image/webp` e `cacheControl` de um ano.
5. Após o upload bem-sucedido, a URL pública do mesmo bucket é inserida em `imagens.url`.
6. Se uma foto falhar ao converter ou enviar, ela não cria registro no banco; o painel mostra uma mensagem de erro e processa as demais fotos selecionadas de forma previsível.

## Compatibilidade e remoção

As imagens existentes continuam sendo exibidas pela URL salva em `imagens.url`. Ao excluir uma imagem, o painel extrai com segurança o bucket e o caminho a partir da URL pública, permitindo remover tanto arquivos antigos em `motos-fotos` quanto arquivos WebP em `motos-fotos-webp`.

## Infraestrutura Supabase

O bucket `motos-fotos-webp` deve ser público e permitir leitura pública, além de inserção, atualização e exclusão para usuários com perfil `admin` ou `editor`, equivalentes às políticas existentes para `motos-fotos`.

## Tratamento de erros

- Arquivos que não forem imagens são rejeitados antes da conversão.
- Falhas de decodificação/conversão não geram upload nem registro na tabela.
- Falhas de upload não geram registro na tabela.
- A remoção de um registro permanece concluída mesmo se o objeto de storage já não existir; outros erros de storage são reportados para evitar divergência silenciosa.

## Verificação

- Testar a função de conversão com imagem maior que 1600 px, imagem menor e arquivo inválido.
- Confirmar que o upload usa extensão, tipo MIME, cache e bucket WebP corretos.
- Confirmar que a exclusão determina corretamente o bucket para URLs legadas e WebP.
- Executar lint e build do projeto.
