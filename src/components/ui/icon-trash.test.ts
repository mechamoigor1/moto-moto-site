import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const iconSourcePath = join(process.cwd(), "src", "components", "ui", "Icon.tsx");
const motoFormSourcePath = join(process.cwd(), "src", "components", "admin", "MotoForm.tsx");

describe("Icon", () => {
  it("provides a typed trash icon with an SVG path", async () => {
    const source = await readFile(iconSourcePath, "utf8");

    expect(source).toMatch(/\| "trash"/);
    expect(source).toMatch(/trash:\s*<path d="[^"]+"/);
  });

  it("uses readable removal labels in the MotoForm control", async () => {
    const source = await readFile(motoFormSourcePath, "utf8");

    expect(source).toMatch(/aria-label=\{"Remover especificação"\}/);
    expect(source).toMatch(/title=\{"Remover especificação"\}/);
    expect(source).not.toMatch(/\\u00e[37]/);
  });
});
