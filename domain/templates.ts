import { BoxTemplate } from './types';

export const S001_TEMPLATE: BoxTemplate = {
  id: 'S001',
  label: 'S001 80x80x150',
  sizeMm: { width: 80, depth: 80, height: 150 },
  faces: {
    front:  { x: 0.35, y: 0.35, w: 0.15, h: 0.30 },
    back:   { x: 0.50, y: 0.35, w: 0.15, h: 0.30 },
    left:   { x: 0.20, y: 0.35, w: 0.15, h: 0.30 },
    right:  { x: 0.65, y: 0.35, w: 0.15, h: 0.30 },
    top:    { x: 0.35, y: 0.20, w: 0.15, h: 0.15 },
    bottom: { x: 0.35, y: 0.65, w: 0.15, h: 0.15 },
  },
};

export const TEMPLATES = {
  S001: S001_TEMPLATE,
} as const;