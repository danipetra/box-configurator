/**
 * React hook responsible for generating face textures for the 3D box preview.
 *
 * It reacts to configurator state changes (template, uploaded graphic, surface mode)
 * and rebuilds textures only when needed.
 */
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

  /**
   * Decide which source image should feed the texture pipeline.
   * In graphic mode we prefer the uploaded asset, otherwise we fall back
   * to the default dieline image.
   */
  const sourceUrl = useMemo(() => {
    // No graphic mode => no per-face textures needed.
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

      // Load the full source image, then crop each face using the dieline.
      const img = await loadImage(sourceUrl);
      const map = buildFaceTexturesFromDieline(img, template.faces, { faceSizePx: 1024 });

      if (cancelled) {
        // Dispose textures immediately if the effect has already been invalidated.
        Object.values(map).forEach((t) => t.dispose());
        return;
      }

      // Dispose previous textures before storing the new set.
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