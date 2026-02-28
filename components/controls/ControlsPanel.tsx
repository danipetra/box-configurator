'use client';

import { useConfigurator } from '@/context/configuratorContext';
import { pdfFirstPageToDataUrl } from '@/utility/pdf';

function ToggleButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'rounded-xl px-3 py-2 text-sm font-medium transition',
        active ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700',
      ].join(' ')}
    >
      {label}
    </button>
  );
}

export default function ControlsPanel() {
  const { state, actions } = useConfigurator();

  // FIXME
  const onUpload = async (file: File) => {
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

    if (isPdf) {
      const dataUrl = await pdfFirstPageToDataUrl(file, 2);
      actions.setGraphicSource({ type: 'pdf', url: dataUrl, name: file.name });
    } else {
      const url = URL.createObjectURL(file);
      actions.setGraphicSource({ type: 'image', url, name: file.name });
    }

    actions.setAppearance('GRAPHIC');
  };  

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-zinc-800 px-4 py-3">
        <h2 className="text-sm font-semibold">Controls</h2>
        <p className="text-xs text-zinc-400">Basic state wiring (Step 1)</p>
      </div>

      <div className="flex flex-1 flex-col gap-5 p-4">
        <div className="space-y-2">
          <div className="text-xs font-semibold text-zinc-300">View mode</div>
          <div className="flex gap-2">
            <ToggleButton active={state.viewMode === '2D'} label="2D" onClick={() => actions.setViewMode('2D')} />
            <ToggleButton active={state.viewMode === '3D'} label="3D" onClick={() => actions.setViewMode('3D')} />
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-semibold text-zinc-300">Appearance</div>
          <div className="flex gap-2">
            <ToggleButton
              active={state.appearance === 'WHITE'}
              label="White"
              onClick={() => actions.setAppearance('WHITE')}
            />
            <ToggleButton
              active={state.appearance === 'GRAPHIC'}
              label="Graphic"
              onClick={() => actions.setAppearance('GRAPHIC')}
            />
          </div>
          <p className="text-xs text-zinc-500">
            {state.appearance === 'WHITE' ? 'No texture applied' : 'Will apply uploaded graphic (later: template mapping)'}
          </p>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-semibold text-zinc-300">Upload graphic</div>
          <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-950/40 px-3 py-6 text-sm text-zinc-300 hover:bg-zinc-950/60">
            <input
              type="file"
              className="hidden"
              accept="image/*,application/pdf"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) await onUpload(file);
              }}
            />
            <span>Click to upload (image or PDF)</span>
          </label>

          {state.graphicSource ? (
            <div className="rounded-xl bg-zinc-950/40 px-3 py-2 text-xs text-zinc-300">
              <div className="font-semibold">{state.graphicSource.name ?? 'Uploaded file'}</div>
              <div className="text-zinc-500">{state.graphicSource.type}</div>
            </div>
          ) : (
            <div className="text-xs text-zinc-500">No file uploaded yet.</div>
          )}
        </div>

        <div className="mt-auto flex gap-2">
          <button
            type="button"
            onClick={() => actions.reset()}
            className="w-full rounded-xl bg-zinc-800 px-3 py-2 text-sm font-medium text-zinc-100 hover:bg-zinc-700"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}