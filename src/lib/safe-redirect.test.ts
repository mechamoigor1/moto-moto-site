import { describe, expect, it } from "vitest";
import { safeAdminRedirect } from "./safe-redirect";

describe("safeAdminRedirect", () => {
  it("keeps an internal admin route", () => {
    expect(safeAdminRedirect("/admin/motos")).toBe("/admin/motos");
  });

  it.each(["", "/motos", "//evil.example", "https://evil.example"]) (
    "falls back to admin for %s",
    (value) => {
      expect(safeAdminRedirect(value)).toBe("/admin");
    }
  );
});
