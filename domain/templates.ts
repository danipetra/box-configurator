import { BoxTemplate } from './types';

/**
 * Canonical template for the S001 dieline.
 *
 * Face regions are expressed as normalized coordinates relative to
 * the full source dieline image. Since the dieline layout is known
 * and stable, these values can be consolidated directly in the template
 * instead of being computed dynamically at runtime.
 */
export const S001_TEMPLATE: BoxTemplate = {
  id: 'S001',
  label: 'S001 80x80x150',
  sizeMm: { width: 80, depth: 80, height: 150 },
  faces: {
    front:  { x: 0.288, y: 0.285, w: 0.23, h: 0.43 },
    back:   { x: 0.752, y: 0.285, w: 0.23, h: 0.43 },
    left:   { x: 0.056, y: 0.285, w: 0.23, h: 0.43 },
    right:  { x: 0.52, y: 0.285, w: 0.23, h: 0.43 },
    top:    { x: 0.055, y: 0.055, w: 0.23, h: 0.23 },
    bottom: { x: 0.52, y: 0.715, w: 0.23, h: 0.23 },
  },
};

export const TEMPLATES = {
  S001: S001_TEMPLATE,
} as const;