'use client';

import { useState } from 'react';
import { useConfigurator } from '@/context/configuratorContext';
import { TEMPLATES } from '@/domain/templates';

const FACE_LABELS = ['front', 'back', 'left', 'right', 'top', 'bottom'] as const;

export default function Viewer2D() {
  const { state } = useConfigurator();
  const [showOverlay, setShowOverlay] = useState(true);

  const src = state.graphicSource?.url ?? state.defaultDielineUrl;
  const template = TEMPLATES[state.templateId as keyof typeof TEMPLATES];

  return (
    <div className="relative h-full w-full">
      <div className="absolute left-3 top-3 z-10 flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-xs text-zinc-200">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={showOverlay}
            onChange={(e) => setShowOverlay(e.target.checked)}
          />
          Show template regions
        </label>
      </div>

      <div className="h-full w-full p-4">
        <div className="relative h-full w-full">
          <img src={src} alt="Dieline preview" className="h-full w-full object-contain" />

          {/* Overlay: uses normalized coords, anchored to the same container */}
          {showOverlay && template ? (
            <div className="pointer-events-none absolute inset-0">
              {FACE_LABELS.map((face) => {
                const r = template.faces[face];
                return (
                  <div
                    key={face}
                    className="absolute rounded-md border border-zinc-100/70 bg-zinc-100/10"
                    style={{
                      left: `${r.x * 100}%`,
                      top: `${r.y * 100}%`,
                      width: `${r.w * 100}%`,
                      height: `${r.h * 100}%`,
                    }}
                  >
                    <div className="absolute -top-5 left-0 rounded bg-zinc-950/80 px-2 py-0.5 text-[10px] text-zinc-100">
                      {face}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}