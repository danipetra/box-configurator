export type RectPx = { left: number; top: number; width: number; height: number };

/**
 * Computes the actual rectangle occupied by an image rendered with object-contain
 * inside a container of arbitrary size.
 *
 * This is needed because the image does not necessarily fill the whole container:
 * letterboxing may appear horizontally or vertically.
 * The returned rect lets us anchor overlays exactly on top of the visible image.
 */
export function computeContainRect(
  containerW: number,
  containerH: number,
  imageW: number,
  imageH: number
): RectPx {
  const containerRatio = containerW / containerH;
  const imageRatio = imageW / imageH;

  let width: number, height: number, left: number, top: number;

  if (imageRatio > containerRatio) {
     // Image is wider than the container ratio: fit by width.
    width = containerW;
    height = width / imageRatio;
    left = 0;
    top = (containerH - height) / 2;
  } else {
    // Image is taller/narrower than the container ratio: fit by height.
    height = containerH;
    width = height * imageRatio;
    top = 0;
    left = (containerW - width) / 2;
  }

  return { left, top, width, height };
}