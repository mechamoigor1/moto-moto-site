# Integridade de Storage e retorno seguro Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Preservar registros quando o Storage falha, evitar objetos órfãos e impedir redirecionamento externo após login.

**Architecture:** Um helper comum determina objetos públicos do Supabase. As ações administrativas removem primeiro o objeto de Storage e só então o registro do banco; o upload remove seu objeto se o insert falhar. A normalização de `next` é uma função pura, coberta por teste.

**Tech Stack:** Next.js 15, TypeScript, Supabase Storage, Vitest.

## Global Constraints

- Nunca excluir linha de `imagens` quando a remoção do objeto correspondente falhar.
- Nunca excluir a moto quando algum objeto de imagem falhar ao remover.
- Em falha de insert após upload, remover o WebP recém-enviado.
- Aceitar retorno de login apenas para caminhos internos `/admin`.
- Preservar compatibilidade com URLs dos buckets `motos-fotos` e `motos-fotos-webp`.

---

### Task 1: Retorno seguro após autenticação

**Files:**
- Create: `src/lib/safe-redirect.ts`
- Create: `src/lib/safe-redirect.test.ts`
- Modify: `src/lib/actions/auth.ts`

**Interfaces:**
- Produces: `safeAdminRedirect(value: string): string`.

- [ ] **Step 1: Escrever teste de destino seguro**

```ts
expect(safeAdminRedirect("/admin/motos")).toBe("/admin/motos");
expect(safeAdminRedirect("https://evil.example")).toBe("/admin");
expect(safeAdminRedirect("//evil.example")).toBe("/admin");
expect(safeAdminRedirect("/motos")).toBe("/admin");
```

- [ ] **Step 2: Confirmar falha**

Run: `npm.cmd test -- safe-redirect.test.ts`

Expected: FAIL por módulo inexistente.

- [ ] **Step 3: Implementar e integrar**

```ts
export function safeAdminRedirect(value: string) {
  return value.startsWith("/admin") && !value.startsWith("//") ? value : "/admin";
}
```

Use `redirect(safeAdminRedirect(next))` em `entrar`.

- [ ] **Step 4: Confirmar teste**

Run: `npm.cmd test -- safe-redirect.test.ts`

Expected: PASS.

### Task 2: Exclusão consistente de imagens e motos

**Files:**
- Modify: `src/lib/actions/imagens.ts`
- Modify: `src/lib/actions/motos.ts`

**Interfaces:**
- Consumes: `publicStorageObject(url): { bucket: string; path: string } | null`.

- [ ] **Step 1: Alterar exclusão de foto para Storage antes do banco**

Busque a URL, obtenha objeto, execute `storage.from(bucket).remove([path])`, lance erro se retornar erro, e somente então execute `imagens.delete()`.

- [ ] **Step 2: Alterar exclusão de moto**

Busque `imagens(url)` da moto antes de apagar. Para cada URL pública, remova o objeto e lance erro em qualquer falha. Só depois execute `motos.delete()`.

- [ ] **Step 3: Confirmar validação estática**

Run: `npx.cmd tsc --noEmit && npm.cmd run lint`

Expected: sem erros.

### Task 3: Rollback de objeto se o banco falhar

**Files:**
- Modify: `src/components/admin/ImagensUploader.tsx`

- [ ] **Step 1: Ajustar cada upload**

Após `upload` bem-sucedido, envolva `adicionarImagem` em `try/catch`; se a action falhar, execute `storage.from("motos-fotos-webp").remove([path])` e propague o erro original.

- [ ] **Step 2: Executar verificação completa**

Run: `npm.cmd test && npx.cmd tsc --noEmit && npm.cmd run lint && npm.cmd run build`

Expected: testes e tipos passam; lint pode manter apenas o aviso existente de `<img>`.

## Self-review

- A ordem Storage → banco protege todas as exclusões.
- O rollback cobre upload sem registro.
- `next` externo nunca chega a `redirect`.
