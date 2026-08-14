import { describe, expect, it } from "vitest";
import { publicStorageObject } from "./storage-url";

describe("publicStorageObject", () => {
  it("extracts the WebP bucket and decoded object path", () => {
    expect(
      publicStorageObject(
        "https://abc.supabase.co/storage/v1/object/public/motos-fotos-webp/a%20b/foto.webp"
      )
    ).toEqual({ bucket: "motos-fotos-webp", path: "a b/foto.webp" });
  });

  it("supports a legacy image URL", () => {
    expect(
      publicStorageObject("https://abc.supabase.co/storage/v1/object/public/motos-fotos/moto-1/foto.jpg")
    ).toEqual({ bucket: "motos-fotos", path: "moto-1/foto.jpg" });
  });

  it("returns null for URLs outside public Supabase storage", () => {
    expect(publicStorageObject("https://example.com/foto.webp")).toBeNull();
  });
});
