/**
 * Profile picture helpers.
 *
 * Images are validated, centre-cropped to a square and downscaled before they
 * are stored as a compact data URI. Cropping means the picture always fits the
 * circular avatar without distortion, and downscaling keeps localStorage small.
 */

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

const MAX_FILE_BYTES = 10 * 1024 * 1024;

export class ImageError extends Error {}

export function isSupportedImageFile(file: File): boolean {
  return (ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type);
}

export function validateImageFile(file: File): void {
  if (!isSupportedImageFile(file)) {
    throw new ImageError("That file isn't a JPG, PNG or WebP image.");
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new ImageError("That image is over 10 MB — please choose a smaller one.");
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new ImageError("We couldn't read that image."));
    img.src = src;
  });
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new ImageError("We couldn't read that file."));
    reader.readAsDataURL(file);
  });
}

/**
 * Turn a user-selected file into a square avatar data URI.
 * @param file  The selected image.
 * @param size  Output edge length in pixels (square).
 */
export async function fileToAvatarDataUrl(file: File, size = 256): Promise<string> {
  validateImageFile(file);
  const raw = await readAsDataUrl(file);
  const img = await loadImage(raw);

  const source = Math.min(img.naturalWidth || img.width, img.naturalHeight || img.height);
  if (!source) throw new ImageError("That image appears to be empty.");

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new ImageError("Your browser couldn't process that image.");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(
    img,
    (img.width - source) / 2,
    (img.height - source) / 2,
    source,
    source,
    0,
    0,
    size,
    size
  );

  let out = canvas.toDataURL("image/webp", 0.9);
  if (!out.startsWith("data:image/webp")) out = canvas.toDataURL("image/png");
  return out;
}
