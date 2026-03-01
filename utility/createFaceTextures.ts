import { CanvasTexture, SRGBColorSpace } from 'three';
import { FaceId, RectN } from '@/domain/types';

export type FaceTextureMap = Record<FaceId, CanvasTexture>;

type Options = {
  /** output resolution per face (square-ish). Keep moderate to avoid memory bloat. */
  faceSizePx?: number;
};

export function createFaceTextures(
  sourceImg: HTMLImageElement,
  regions: Record<FaceId, RectN>,
  options: Options = {}
): FaceTextureMap {
  const faceSizePx = options.faceSizePx ?? 1024;

  const out: Partial<FaceTextureMap> = {};

  const srcW = sourceImg.naturalWidth || sourceImg.width;
  const srcH = sourceImg.naturalHeight || sourceImg.height;

  (Object.keys(regions) as FaceId[]).forEach((face) => {
    const r = regions[face];

    // convert normalized rect → pixel rect
    const sx = Math.round(r.x * srcW);
    const sy = Math.round(r.y * srcH);
    const sw = Math.round(r.w * srcW);
    const sh = Math.round(r.h * srcH);

    const canvas = document.createElement('canvas');
    canvas.width = faceSizePx;
    canvas.height = faceSizePx;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context not available');

    // draw cropped region into output canvas (stretch to faceSizePx)
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(sourceImg, sx, sy, sw, sh, 0, 0, faceSizePx, faceSizePx);

    const tex = new CanvasTexture(canvas);
    tex.colorSpace = SRGBColorSpace; // correct-ish color in three
    tex.needsUpdate = true;

    out[face] = tex;
  });

  return out as FaceTextureMap;
}