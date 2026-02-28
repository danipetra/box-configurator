'use client';

import Image from 'next/image';
import { useConfigurator } from '@/context/configuratorContext';

export default function Viewer2D() {
  const { state } = useConfigurator();
  const src = state.graphicSource?.url;

  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      {src ? (
        <div className="relative h-full w-full">
          {/* next/image con objectURL: meglio usare un normale <img> per evitare config domains */}
          <img
            src={src}
            alt="Dieline preview"
            className="h-full w-full object-contain"
          />
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6 text-center">
          <div className="text-sm font-semibold">2D Preview</div>
          <div className="mt-1 text-xs text-zinc-400">Upload an image/PDF to preview the dieline.</div>
        </div>
      )}
    </div>
  );
}