# Upload WebP administrativo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Converter fotos no navegador e gravá-las somente no bucket WebP, sem quebrar a remoção de imagens legadas.

**Architecture:** Uma biblioteca client-side converte um `File` de imagem em `File` WebP, corrigindo orientação e limitando o maior lado a 1600 px. O uploader consome essa biblioteca e sempre usa `motos-fotos-webp`; a action de exclusão descobre o bucket e o caminho com base na URL persistida.

**Tech Stack:** Next.js 15, React 19, TypeScript, Supabase Storage, Vitest + jsdom.

## Global Constraints

- Converter no navegador antes do upload; não enviar originais ao Supabase.
- WebP deve usar qualidade `0.8`, maior lado máximo de `1600` px e não ampliar imagens menores.
- Novos objetos usam bucket `motos-fotos-webp`, extensão `.webp`, `contentType: image/webp` e `cacheControl: 31536000`.
- Não incluir Service Role Key no site nem no deploy.
- As URLs e objetos existentes em `motos-fotos` devem continuar removíveis.

---

### Task 1: Criar conversor WebP testável no cliente

**Files:**
- Create: `src/lib/image-webp.ts`
- Create: `src/lib/image-webp.test.ts`
- Modify: `package.json`
- Modify: `vitest.config.ts`

**Interfaces:**
- Produces: `export const IMAGE_MAX_SIDE = 1600`, `export const WEBP_QUALITY = 0.8`, `export async function convertImageToWebp(file: File): Promise<File>`.
- Consumes: APIs do navegador `createImageBitmap`, `OffscreenCanvas` quando disponível e `HTMLCanvasElement` como fallback.

- [ ] **Step 1: Instalar a infraestrutura de teste**

  Execute `npm install -D vitest jsdom` e acrescente ao `package.json`:

  ```json
  "test": "vitest run"
  ```

  Crie `vitest.config.ts`:

  ```ts
  import { defineConfig } from "vitest/config";

  export default defineConfig({
    test: { environment: "jsdom", include: ["src/**/*.test.ts"] },
  });
  ```

- [ ] **Step 2: Escrever testes que falham para a conversão e limites**

  Em `src/lib/image-webp.test.ts`, mocke `createImageBitmap` e `canvas.toBlob`; cubra: imagem 3200×1200 vira 1600×600, imagem 800×600 mantém tamanho, saída possui `type === "image/webp"`, nome termina em `.webp`, e arquivo não-imagem rejeita com `"Selecione apenas arquivos de imagem."`.

  Exemplo da primeira asserção:

  ```ts
  await expect(convertImageToWebp(new File(["x"], "moto.jpg", { type: "image/jpeg" }))).resolves.toMatchObject({
    name: "moto.webp",
    type: "image/webp",
  });
  expect(drawImage).toHaveBeenCalledWith(expect.anything(), 0, 0, 1600, 600);
  ```

- [ ] **Step 3: Rodar os testes para confirmar a falha inicial**

  Run: `npm test -- image-webp.test.ts`

  Expected: FAIL porque `src/lib/image-webp.ts` ainda não exporta `convertImageToWebp`.

- [ ] **Step 4: Implementar o conversor mínimo**

  Em `src/lib/image-webp.ts`, valide `file.type.startsWith("image/")`; carregue a imagem com `createImageBitmap(file, { imageOrientation: "from-image" })`; calcule `scale = Math.min(1, IMAGE_MAX_SIDE / Math.max(width, height))`; renderize num canvas de `Math.round(width * scale)` por `Math.round(height * scale)`; exporte via `canvas.toBlob(..., "image/webp", WEBP_QUALITY)` e retorne `new File([blob], file.name.replace(/\.[^.]+$/, "") + ".webp", { type: "image/webp" })`. Sempre execute `bitmap.close()` no `finally`.

- [ ] **Step 5: Rodar os testes e lint**

  Run: `npm test -- image-webp.test.ts && npm run lint`

  Expected: PASS e nenhuma falha do ESLint.

- [ ] **Step 6: Commit**

  Quando a cópia local estiver conectada ao repositório, execute:

  ```bash
  git add package.json package-lock.json vitest.config.ts src/lib/image-webp.ts src/lib/image-webp.test.ts
  git commit -m "feat: convert admin uploads to webp"
  ```

### Task 2: Usar o bucket WebP para upload e corrigir exclusão multi-bucket

**Files:**
- Modify: `src/components/admin/ImagensUploader.tsx`
- Modify: `src/lib/actions/imagens.ts`
- Create: `src/lib/storage-url.ts`
- Create: `src/lib/storage-url.test.ts`

**Interfaces:**
- Consumes: `convertImageToWebp(file): Promise<File>` de `src/lib/image-webp.ts`.
- Produces: `export function publicStorageObject(url: string): { bucket: string; path: string } | null`.

- [ ] **Step 1: Escrever testes que falham para análise de URLs**

  Em `src/lib/storage-url.test.ts`, cubra uma URL pública de `motos-fotos/uuid/foto.jpg`, outra de `motos-fotos-webp/uuid/foto.webp`, URL com espaços codificados e URL fora de `/storage/v1/object/public/` retornando `null`.

  ```ts
  expect(publicStorageObject("https://abc.supabase.co/storage/v1/object/public/motos-fotos-webp/a%20b/foto.webp"))
    .toEqual({ bucket: "motos-fotos-webp", path: "a b/foto.webp" });
  ```

- [ ] **Step 2: Rodar os testes para confirmar a falha inicial**

  Run: `npm test -- storage-url.test.ts`

  Expected: FAIL porque o módulo ainda não existe.

- [ ] **Step 3: Implementar o parser de URL**

  Em `src/lib/storage-url.ts`, use `new URL(url)`, divida o trecho posterior a `/storage/v1/object/public/` na primeira barra, aplique `decodeURIComponent` somente ao caminho e retorne `null` para URLs inválidas ou sem bucket/caminho.

- [ ] **Step 4: Integrar o upload**

  Em `ImagensUploader.tsx`, importe `convertImageToWebp`; para cada arquivo chame a conversão antes do upload. Gere o caminho sempre como `${motoId}/${crypto.randomUUID()}.webp`, use `.from("motos-fotos-webp")`, e envie o arquivo convertido com:

  ```ts
  { cacheControl: "31536000", contentType: "image/webp" }
  ```

  Só chame `adicionarImagem` depois que upload e `getPublicUrl` do mesmo bucket tiverem sucesso. Atualize o estado visual para `"Convertendo e enviando..."`.

- [ ] **Step 5: Integrar a remoção**

  Em `removerImagem`, importe `publicStorageObject`, obtenha `{ bucket, path }` de `imagem.url`, e use `supabase.storage.from(bucket).remove([path])`. Ignore somente erro de objeto inexistente; para outro erro, lance uma mensagem de remoção de storage antes de registrar sucesso.

- [ ] **Step 6: Rodar os testes e validação estática**

  Run: `npm test && npm run lint && npm run build`

  Expected: todos os testes PASS, lint limpo e build concluído.

- [ ] **Step 7: Commit**

  Quando o repositório estiver conectado, execute:

  ```bash
  git add src/components/admin/ImagensUploader.tsx src/lib/actions/imagens.ts src/lib/storage-url.ts src/lib/storage-url.test.ts
  git commit -m "fix: store and remove WebP moto images"
  ```

### Task 3: Aplicar permissões do bucket WebP no Supabase e validar manualmente

**Files:**
- Modify: `database/schema.sql`
- Create: `database/motos-fotos-webp-policies.sql`

**Interfaces:**
- Consumes: função SQL existente `is_admin_ou_editor()`.
- Produces: bucket público `motos-fotos-webp` e políticas de leitura, inserção, atualização e exclusão para administradores e editores.

- [ ] **Step 1: Criar SQL idempotente do bucket e políticas**

  Adicione ao schema e ao arquivo independente:

  ```sql
  insert into storage.buckets (id, name, public)
  values ('motos-fotos-webp', 'motos-fotos-webp', true)
  on conflict (id) do update set public = excluded.public;
  ```

  Crie as quatro políticas, todas restritas por `bucket_id = 'motos-fotos-webp'`; leitura usa `using (true)` e escrita usa `is_admin_ou_editor()` com `using` e/ou `with check` conforme a operação. Use `drop policy if exists` antes de cada `create policy` para que o script seja reexecutável.

- [ ] **Step 2: Executar o SQL no Supabase SQL Editor**

  Cole o conteúdo de `database/motos-fotos-webp-policies.sql` no SQL Editor do projeto Supabase e execute. Confirme que o bucket está marcado como público e que as quatro políticas aparecem em Storage > Policies.

- [ ] **Step 3: Validar manualmente com usuário editor/admin**

  No painel, crie ou edite uma moto, envie uma foto JPEG grande, confirme no navegador que a URL termina em `.webp`, abra a URL pública, exclua a foto e confirme que o objeto correspondente desapareceu de `motos-fotos-webp`. Em seguida, remova uma foto legada e confirme a remoção em `motos-fotos`.

- [ ] **Step 4: Commit**

  Quando o repositório estiver conectado, execute:

  ```bash
  git add database/schema.sql database/motos-fotos-webp-policies.sql
  git commit -m "chore: add WebP storage policies"
  ```

## Self-review

- Cobertura: conversão, dimensão, qualidade, bucket, cache, persistência, compatibilidade legada, permissões e validação manual estão distribuídas nas Tasks 1–3.
- Sem lacunas: todos os nomes de funções e caminhos usados nas integrações são definidos nas tarefas anteriores.
- Limite de escopo: não altera o modelo de dados nem tenta excluir os originais migrados.
