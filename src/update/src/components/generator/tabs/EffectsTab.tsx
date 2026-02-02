import { SuperellipseState } from '@/types/layers';

interface EffectsTabProps {
  state: SuperellipseState;
  onUpdate: (updates: Partial<SuperellipseState>) => void;
}

export function EffectsTab({ state, onUpdate }: EffectsTabProps) {
  return (
    <div className="space-y-6">
      {/* Gaussian Blur */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-white">Gaussian Blur</label>
          <span className="text-xs text-white font-mono">{state.blur}px</span>
        </div>
        <input
          type="range"
          value={state.blur}
          onChange={(e) => onUpdate({ blur: Number(e.target.value) })}
          min={0}
          max={50}
          className="w-full"
        />
        <p className="text-xs text-neutral-500 mt-1">Apply blur to entire shape</p>
      </div>

      {/* Backdrop Blur */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-white">Backdrop Blur</label>
          <span className="text-xs text-white font-mono">{state.backdropBlur}px</span>
        </div>
        <input
          type="range"
          value={state.backdropBlur}
          onChange={(e) => onUpdate({ backdropBlur: Number(e.target.value) })}
          min={0}
          max={30}
          className="w-full"
        />
        <p className="text-xs text-neutral-500 mt-1">Glassmorphism effect</p>
      </div>

      {/* Stroke */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Stroke</h3>
        
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-neutral-400">Width</label>
              <span className="text-xs text-white font-mono">{state.strokeWidth}px</span>
            </div>
            <input
              type="range"
              value={state.strokeWidth}
              onChange={(e) => onUpdate({ strokeWidth: Number(e.target.value) })}
              min={0}
              max={20}
              className="w-full"
            />
          </div>

          {state.strokeWidth > 0 && (
            <div>
              <label className="text-xs text-neutral-400 mb-2 block">Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={state.strokeColor}
                  onChange={(e) => onUpdate({ strokeColor: e.target.value })}
                  className="w-12 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={state.strokeColor}
                  onChange={(e) => onUpdate({ strokeColor: e.target.value })}
                  className="flex-1 bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white font-mono text-sm"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Noise Texture */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-white">Noise Texture</label>
          <span className="text-xs text-white font-mono">{state.noiseOpacity}%</span>
        </div>
        <input
          type="range"
          value={state.noiseOpacity}
          onChange={(e) => onUpdate({ noiseOpacity: Number(e.target.value) })}
          min={0}
          max={50}
          className="w-full"
        />
        <p className="text-xs text-neutral-500 mt-1">Add grain texture overlay</p>
      </div>
    </div>
  );
}
