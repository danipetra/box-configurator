'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useConfigurator } from '@/context/configuratorContext';
import { TEMPLATES } from '@/domain/templates';
import { computeContainRect, type RectPx } from '@/utility/contain';

const FACES = ['front', 'back', 'left', 'right', 'top', 'bottom'] as const;

export default function Viewer2D() {
  const { state } = useConfigurator();

  const src = state.graphicSource?.url ?? state.defaultDielineUrl;
  const template = TEMPLATES[state.templateId as keyof typeof TEMPLATES];

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [contain, setContain] = useState<RectPx | null>(null);
  const [showRegions, setShowRegions] = useState(true);

  const recomputeContain = () => {
    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!wrap || !img) return;

    const cw = wrap.clientWidth;
    const ch = wrap.clientHeight;

    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;

    if (!cw || !ch || !iw || !ih) return;

    setContain(computeContainRect(cw, ch, iw, ih));
  };

  // Recompute when image source changes
  useEffect(() => {
    // reset contain while loading new image (avoids showing stale overlay)
    setContain(null);
  }, [src]);

  // Use ResizeObserver for accurate updates when layout changes
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const ro = new ResizeObserver(() => {
      recomputeContain();
    });
    ro.observe(wrap);

    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Toolbar label
  const fileLabel = useMemo(() => {
    if (!state.graphicSource) return 'Default dieline';
    return state.graphicSource.name ?? 'Uploaded';
  }, [state.graphicSource]);

  return (
    <div className="relative h-full w-full p-4">
      {/* Toolbar */}
      <div className="absolute left-6 top-6 z-10 flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/70 px-3 py-2 text-xs text-zinc-200">
        <span className="text-zinc-400">{fileLabel}</span>

        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={showRegions}
            onChange={(e) => setShowRegions(e.target.checked)}
          />
          Show regions
        </label>
      </div>

      <div ref={wrapRef} className="relative h-full w-full">
        <img
          ref={imgRef}
          src={src}
          alt="Dieline preview"
          className="h-full w-full select-none object-contain"
          draggable={false}
          onLoad={() => {
            // naturalWidth/Height available after load
            recomputeContain();
          }}
        />

        {/* Overlay anchored to the actual contain-rect */}
        {showRegions && contain && template ? (
          <div
            className="pointer-events-none absolute"
            style={{
              left: contain.left,
              top: contain.top,
              width: contain.width,
              height: contain.height,
            }}
          >
            {FACES.map((face) => {
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
  );
}