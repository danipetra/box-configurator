import { CanvasTexture, SRGBColorSpace } from 'three';
import { FaceId, NormalizedRect } from '@/domain/types';

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
  faceRegions: Record<FaceId, NormalizedRect>,
  options: Options = {}
): FaceTextureMap {
  const outputSizePx = options.faceSizePx ?? 1024;

  // Prepare the output obj
  const faceTextures: Partial<FaceTextureMap> = {};

  const srcW = sourceImg.naturalWidth || sourceImg.width;
  const srcH = sourceImg.naturalHeight || sourceImg.height;

  (Object.keys(faceRegions) as FaceId[]).forEach((face) => {
    const region = faceRegions[face];

    // Convert normalized template coordinates into pixel crop coordinates.
    const cropX = Math.round(region.x * srcW);
    const cropY = Math.round(region.y * srcH);
    const cropWidth = Math.round(region.w * srcW);
    const cropHeight = Math.round(region.h * srcH);

    const canvas = document.createElement('canvas');
    canvas.width = outputSizePx;
    canvas.height = outputSizePx;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context not available');

    // Draw the cropped region into an output canvas.
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(sourceImg, cropX, cropY, cropWidth, cropHeight, 0, 0, outputSizePx, outputSizePx);

    // This becomes the final texture for one specific 3D face.
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace; // Use sRGB so colors match the expected appearance in the Three.js scene.
    texture.needsUpdate = true;

    faceTextures[face] = texture;
  });

  return faceTextures as FaceTextureMap;
}