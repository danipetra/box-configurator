'use client';

import { useEffect, useMemo, useState } from 'react';
import { CanvasTexture } from 'three';
import { loadImage } from '@/utility/image';
import { buildFaceTexturesFromDieline, FaceTextureMap } from '@/utility/buildFaceTexturesFromDieline';
import { TEMPLATES } from '@/domain/templates';
import { useBoxConfigurator } from '@/context/configuratorContext';

export function useBoxTextures() {
  const { state } = useBoxConfigurator();
  const template = TEMPLATES[state.templateId as keyof typeof TEMPLATES];
  
  const [textures, setTextures] = useState<FaceTextureMap | null>(null);

  const sourceUrl = useMemo(() => {
    // if GRAPHIC, use graphicSource url if available, otherwise fallback to default dieline url; if not GRAPHIC, no texture
    if (state.surfaceMode === 'GRAPHIC') return state.graphicSource?.url ?? state.defaultDielineUrl;
    return null;
  }, [state.surfaceMode, state.graphicSource?.url, state.defaultDielineUrl]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      // if no source, reset textures (dispose in useEffect cleanup)
      if (!sourceUrl) {
        setTextures(null);
        return;
      }

      // load image, create textures, set state (if not cancelled)
      const img = await loadImage(sourceUrl);
      const map = buildFaceTexturesFromDieline(img, template.faces, { faceSizePx: 1024 });

      if (cancelled) {
        //dispose textures if we created them but got cancelled before setting state
        Object.values(map).forEach((t) => t.dispose());
        return;
      }

      // dispose previous textures if any, then set new ones
      setTextures((prev) => {
        if (prev) Object.values(prev).forEach((t: CanvasTexture) => t.dispose());
        return map;
      });
    }

    run().catch((e) => {
      console.error(e);
      setTextures(null);
    });

    return () => {
      cancelled = true;
    };
  }, [sourceUrl, template.faces]);

  return textures;
}