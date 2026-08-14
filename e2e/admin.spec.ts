import { test, expect } from "@playwright/test";

test.describe("Admin - navegação e autenticação", () => {
  test("dashboard carrega após login e mostra o e-mail do usuário", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.locator("aside")).toContainText(process.env.E2E_ADMIN_EMAIL ?? "@");
  });

  test("acessar /admin sem sessão redireciona para login", async ({ browser }) => {
    const context = await browser.newContext({ storageState: undefined });
    const page = await context.newPage();
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
    await context.close();
  });

  for (const [href, heading] of [
    ["/admin/motos", "Motos"],
    ["/admin/marcas", "Marcas"],
    ["/admin/categorias", "Categorias"],
    ["/admin/contatos", "Contatos"],
    ["/admin/configuracoes", "Configurações"],
  ] as const) {
    test(`seção ${href} carrega sem erro`, async ({ page }) => {
      await page.goto(href);
      await expect(page).toHaveURL(new RegExp(href.replace(/\//g, "\\/") + "$"));
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    });
  }
});

test.describe("Admin - CRUD de moto", () => {
  const modeloTeste = `E2E Teste ${Date.now()}`;

  test("criar, editar e excluir uma moto", async ({ page }) => {
    await page.goto("/admin/motos/novo");

    await page.locator('select[name="marca_id"]').selectOption({ index: 1 });
    await page.locator('input[name="modelo"]').fill(modeloTeste);
    await page.locator('input[name="ano"]').fill("2024");
    await page.locator('input[name="km"]').fill("1000");
    await page.locator('input[name="preco"]').fill("15000");

    await page.getByRole("button", { name: "Cadastrar moto" }).click();

    await expect(page).toHaveURL(/\/admin\/motos\/[^/]+\/editar\?criada=1/, { timeout: 15_000 });
    await expect(page.locator('input[name="modelo"]')).toHaveValue(modeloTeste);

    await page.goto("/admin/motos");
    const linha = page.locator("tr", { hasText: modeloTeste });
    await expect(linha).toBeVisible();

    await linha.getByText("Editar").click();
    await expect(page.locator('input[name="modelo"]')).toHaveValue(modeloTeste);

    const novoModelo = `${modeloTeste} editada`;
    await page.locator('input[name="modelo"]').fill(novoModelo);
    await page.getByRole("button", { name: "Salvar alterações" }).click();
    await expect(page.getByText(/salv/i)).toBeVisible({ timeout: 10_000 });

    // Pequena tolerância a latência de replicação do Supabase entre a escrita
    // e a leitura seguinte: recarrega até a listagem refletir a edição.
    await expect(async () => {
      await page.reload();
      await expect(page.locator("tr", { hasText: novoModelo })).toBeVisible();
    }).toPass({ timeout: 15_000 });

    const linhaEditada = page.locator("tr", { hasText: novoModelo });
    page.once("dialog", (dialog) => dialog.accept());
    await linhaEditada.getByRole("button", { name: /excluir/i }).click();

    await expect(page.locator("tr", { hasText: novoModelo })).not.toBeVisible({ timeout: 10_000 });
  });
});
