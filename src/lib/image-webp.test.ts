import { afterEach, describe, expect, it, vi } from "vitest";
import { convertImageToWebp, imageWebpName, resizedImageDimensions } from "./image-webp";

describe("resizedImageDimensions", () => {
  it("limits the largest side to 1600px while preserving the aspect ratio", () => {
    expect(resizedImageDimensions(3200, 1200)).toEqual({ width: 1600, height: 600 });
  });

  it("does not enlarge an image that is already within the limit", () => {
    expect(resizedImageDimensions(800, 600)).toEqual({ width: 800, height: 600 });
  });
});

describe("imageWebpName", () => {
  it("replaces the original extension with webp", () => {
    expect(imageWebpName("foto.original.JPEG")).toBe("foto.original.webp");
  });
});

describe("convertImageToWebp", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("rejects a non-image file before attempting conversion", async () => {
    const file = new File(["not an image"], "catalogo.pdf", { type: "application/pdf" });

    await expect(convertImageToWebp(file)).rejects.toThrow("Selecione apenas arquivos de imagem.");
  });

  it("creates a resized WebP file", async () => {
    const close = vi.fn();
    const drawImage = vi.fn();
    const canvas = document.createElement("canvas");
    vi.spyOn(document, "createElement").mockReturnValue(canvas);
    vi.spyOn(canvas, "getContext").mockReturnValue({ drawImage } as never);
    vi.spyOn(canvas, "toBlob").mockImplementation((callback) => callback(new Blob(["webp"], { type: "image/webp" })));
    vi.stubGlobal("createImageBitmap", vi.fn().mockResolvedValue({ width: 3200, height: 1200, close }));

    const converted = await convertImageToWebp(new File(["jpeg"], "moto.jpg", { type: "image/jpeg" }));

    expect(converted).toMatchObject({ name: "moto.webp", type: "image/webp" });
    expect(canvas.width).toBe(1600);
    expect(canvas.height).toBe(600);
    expect(drawImage).toHaveBeenCalledWith(expect.anything(), 0, 0, 1600, 600);
    expect(close).toHaveBeenCalledOnce();
  });
});
