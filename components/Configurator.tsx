'use client';

import { BoxConfiguratorProvider, useBoxConfigurator } from '@/context/configuratorContext';
import ControlsPanel from '@/components/controls/ControlsPanel';
import Viewer2D from '@/components/viewer/Viewer2D';
import Viewer3D from '@/components/viewer/Viewer3D';

/**
 * Main composition root for the configurator.
 * It connects shared state, controls and the active preview panel.
 */
function ConfiguratorInner() {
  const { state } = useBoxConfigurator();

  return (
    <div className="h-[calc(100vh-0px)] w-full bg-zinc-950 text-zinc-100">
      <div className="mx-auto grid h-full max-w-[1400px] grid-cols-1 gap-4 p-4 md:grid-cols-[1fr_360px]">
        <section className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
          <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
            <div>
              <h1 className="text-sm font-semibold tracking-wide">Box Configurator</h1>
              <p className="text-xs text-zinc-400">Template: {state.templateId}</p>
            </div>
            <div className="text-xs text-zinc-400">View: {state.viewMode}</div>
          </div>

          <div className="h-[calc(100%-52px)]">
            {state.viewMode === '2D' ? <Viewer2D /> : <Viewer3D />}
          </div>
        </section>

        <aside className="rounded-2xl border border-zinc-800 bg-zinc-900">
          <ControlsPanel />
        </aside>
      </div>
    </div>
  );
}

export default function Configurator() {
  return (
    <BoxConfiguratorProvider>
      <ConfiguratorInner />
    </BoxConfiguratorProvider>
  );
}