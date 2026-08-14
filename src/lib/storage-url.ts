const PUBLIC_STORAGE_PATH = "/storage/v1/object/public/";

export function publicStorageObject(url: string): { bucket: string; path: string } | null {
  try {
    const storagePath = new URL(url).pathname;
    if (!storagePath.startsWith(PUBLIC_STORAGE_PATH)) return null;

    const objectPath = storagePath.slice(PUBLIC_STORAGE_PATH.length);
    const separator = objectPath.indexOf("/");
    if (separator <= 0 || separator === objectPath.length - 1) return null;

    return {
      bucket: objectPath.slice(0, separator),
      path: decodeURIComponent(objectPath.slice(separator + 1)),
    };
  } catch {
    return null;
  }
}
