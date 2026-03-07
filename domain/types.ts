/**
 * Identifiers for the six visible faces of the assembled 3D box.
 * These keys are used both by the template and by the 3D material assignment.
 */
export type FaceId = 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom';

/**
 * Rectangle expressed in normalized coordinates (0..1)
 * relative to the full 2D dieline image.
 *
 * This allows the template to stay resolution-independent:
 * the same mapping works for PNGs, rendered PDFs and resized images.
 */
export type NormalizedRect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

/**
 * Physical box dimensions in millimetres.
 * These dimensions describe the assembled box, not the flat dieline.
 */
export type BoxSizeMm = {
  width: number;
  depth: number;
  height: number;
};

/**
 * Template describing how a known dieline maps to the 3D box.
 *
 * Each face of the assembled box is linked to a rectangular area
 * of the source 2D dieline. This is the core of the template-driven approach.
 */
export type BoxTemplate = {
  id: string;
  label: string;
  sizeMm: BoxSizeMm;
  faces: Record<FaceId, NormalizedRect>;
};