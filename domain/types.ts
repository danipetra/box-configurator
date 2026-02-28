export type FaceId = 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom';

export type RectN = {
  /** normalized 0..1 coords relative to the source dieline image */
  x: number;
  y: number;
  w: number;
  h: number;
};

export type BoxSizeMm = {
  width: number;
  depth: number;
  height: number;
};

export type BoxTemplate = {
  id: string;
  label: string;
  sizeMm: BoxSizeMm;
  /** maps each 3D face to a rectangle region in the 2D dieline */
  faces: Record<FaceId, RectN>;
};