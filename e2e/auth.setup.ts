import { test as setup, expect } from "@playwright/test";
import path from "node:path";

const authFile = path.join(__dirname, ".auth", "admin.json");

setup("autenticar como admin", async ({ page }) => {
  const email = process.env.E2E_ADMIN_EMAIL;
  const password = process.env.E2E_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "Defina E2E_ADMIN_EMAIL e E2E_ADMIN_PASSWORD em .env.local para rodar os testes E2E do admin."
    );
  }

  await page.goto("/admin/login");
  await page.getByLabel("E-mail").fill(email);
  await page.getByLabel("Senha").fill(password);
  await page.getByRole("button", { name: "Entrar" }).click();

  await expect(page).toHaveURL(/\/admin$/, { timeout: 15_000 });
  await page.context().storageState({ path: authFile });
});
