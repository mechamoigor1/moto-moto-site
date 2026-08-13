import { describe, expect, it } from "vitest";
import { safeAdminRedirect } from "./safe-redirect";

describe("safeAdminRedirect", () => {
  it("allows only internal admin paths", () => {
    expect(safeAdminRedirect("/admin/motos")).toBe("/admin/motos");
    expect(safeAdminRedirect("https://evil.example")).toBe("/admin");
    expect(safeAdminRedirect("//evil.example")).toBe("/admin");
  });
});
