import { describe, expect, it } from "vitest";
import { getMobileHeaderState } from "./header-state";

describe("getMobileHeaderState", () => {
  it("keeps the mobile header expanded before the compact threshold", () => {
    expect(getMobileHeaderState(47)).toBe("expanded");
  });

  it("makes the mobile header compact at the compact threshold", () => {
    expect(getMobileHeaderState(48)).toBe("compact");
  });
});
