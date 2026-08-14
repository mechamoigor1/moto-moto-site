export const IMAGE_MAX_SIDE = 1600;
export const WEBP_QUALITY = 0.8;

export function resizedImageDimensions(width: number, height: number) {
  const scale = Math.min(1, IMAGE_MAX_SIDE / Math.max(width, height));
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
}

export function imageWebpName(fileName: string) {
  return `${fileName.replace(/\.[^.]+$/, "")}.webp`;
}

function canvasToWebpBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Não foi possível converter a imagem para WebP."));
    }, "image/webp", WEBP_QUALITY);
  });
}

export async function convertImageToWebp(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Selecione apenas arquivos de imagem.");
  }

  const image = await createImageBitmap(file, { imageOrientation: "from-image" });
  try {
    const { width, height } = resizedImageDimensions(image.width, image.height);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) throw new Error("Não foi possível preparar a conversão da imagem.");

    context.drawImage(image, 0, 0, width, height);
    const webp = await canvasToWebpBlob(canvas);
    return new File([webp], imageWebpName(file.name), { type: "image/webp" });
  } finally {
    image.close();
  }
}
