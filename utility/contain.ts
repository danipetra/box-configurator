export type RectPx = { left: number; top: number; width: number; height: number };

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
    // image is "wider": fit width
    width = containerW;
    height = width / imageRatio;
    left = 0;
    top = (containerH - height) / 2;
  } else {
    // image is "taller": fit height
    height = containerH;
    width = height * imageRatio;
    top = 0;
    left = (containerW - width) / 2;
  }

  return { left, top, width, height };
}