import { CanvasTexture, SRGBColorSpace } from 'three';
import { FaceId, RectN } from '@/domain/types';

/**
 * Face-to-texture map consumed by the 3D preview.
 */
export type FaceTextureMap = Record<FaceId, CanvasTexture>;

type Options = {
  /** output resolution per face (square-ish). Keep moderate to avoid memory bloat. */
  faceSizePx?: number;
};

/**
 * Crops each box face from the source dieline image and converts it
 * into a Three.js CanvasTexture.
 *
 * Why this approach:
 * - keeps the mapping template-driven
 * - avoids custom UV unwrapping for the exercise scope
 * - makes it easy to support additional box templates in the future
 */
export function buildFaceTexturesFromDieline(
  sourceImg: HTMLImageElement,
  faceRegions: Record<FaceId, RectN>,
  options: Options = {}
): FaceTextureMap {
  const outputSizePx = options.faceSizePx ?? 1024;

  const faceTextures: Partial<FaceTextureMap> = {};

  const srcW = sourceImg.naturalWidth || sourceImg.width;
  const srcH = sourceImg.naturalHeight || sourceImg.height;

  (Object.keys(faceRegions) as FaceId[]).forEach((face) => {
    const r = faceRegions[face];

    // Convert normalized template coordinates into pixel crop coordinates.
    const sx = Math.round(r.x * srcW);
    const sy = Math.round(r.y * srcH);
    const sw = Math.round(r.w * srcW);
    const sh = Math.round(r.h * srcH);

    const canvas = document.createElement('canvas');
    canvas.width = outputSizePx;
    canvas.height = outputSizePx;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context not available');

    // Draw the cropped region into an output canvas.
    // This becomes the final texture for one specific 3D face.
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(sourceImg, sx, sy, sw, sh, 0, 0, outputSizePx, outputSizePx);

    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace; // Use sRGB so colors match the expected appearance in the Three.js scene.
    texture.needsUpdate = true;

    faceTextures[face] = texture;
  });

  return faceTextures as FaceTextureMap;
}