import { SuperellipseState, GradientStop } from '@/types/layers';
import { validateHexColor, validateGradientPosition, validateNumber } from '@/utils/validation';
import { GRADIENT_DEFAULTS } from '@/constants/index';
import { Plus, Trash2 } from 'lucide-react';

interface ColorTabProps {
  state: SuperellipseState;
  onUpdate: (updates: Partial<SuperellipseState>) => void;
  onUpdateGradientStop: (id: string, updates: Partial<GradientStop>) => void;
  onAddGradientStop: (color: string, position: number) => void;
  onRemoveGradientStop: (id: string) => void;
}

export function ColorTab({
  state,
  onUpdate,
  onUpdateGradientStop,
  onAddGradientStop,
  onRemoveGradientStop,
}: ColorTabProps) {
  return (
    <div className="space-y-6">
      {/* Fill Type */}
      <div>
        <label className="text-xs text-neutral-400 mb-2 block">Fill Type</label>
        <div className="grid grid-cols-2 gap-2">
          {(['solid', 'linear', 'radial', 'conic'] as const).map((type) => (
            <button
              key={type}
              onClick={() => onUpdate({ fillType: type })}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                state.fillType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Solid Color */}
      {state.fillType === 'solid' && (
        <div>
          <label className="text-xs text-neutral-400 mb-2 block">Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={state.solidColor}
              onChange={(e) => onUpdate({ solidColor: validateHexColor(e.target.value) })}
              className="w-12 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              value={state.solidColor}
              onChange={(e) => onUpdate({ solidColor: validateHexColor(e.target.value) })}
              className="flex-1 bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white font-mono text-sm"
            />
          </div>
        </div>
      )}

      {/* Gradient */}
      {state.fillType !== 'solid' && (
        <>
          {/* Gradient Angle */}
          {(state.fillType === 'linear' || state.fillType === 'conic') && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-neutral-400">Angle</label>
                <span className="text-xs text-white font-mono">{state.gradientAngle}°</span>
              </div>
              <input
                type="range"
                value={state.gradientAngle}
                onChange={(e) => onUpdate({ gradientAngle: Number(e.target.value) })}
                min={0}
                max={360}
                className="w-full"
              />
            </div>
          )}

          {/* Gradient Stops */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs text-neutral-400">Gradient Stops</label>
              <button
                onClick={() => onAddGradientStop('#ffffff', 50)}
                className="p-1 hover:bg-neutral-700 rounded transition-colors text-white"
                title="Add gradient stop"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {state.gradientStops.map((stop, index) => (
                <div key={stop.id} className="flex items-center gap-2">
                  <input
                    type="color"
                    value={stop.color}
                    onChange={(e) => onUpdateGradientStop(stop.id, { color: e.target.value })}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={stop.color}
                    onChange={(e) => onUpdateGradientStop(stop.id, { color: e.target.value })}
                    className="flex-1 bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-white font-mono text-xs"
                  />
                  <input
                    type="number"
                    value={stop.position}
                    onChange={(e) =>
                      onUpdateGradientStop(stop.id, { position: Number(e.target.value) })
                    }
                    min={0}
                    max={100}
                    className="w-16 bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-white text-xs"
                  />
                  <span className="text-xs text-neutral-500">%</span>
                  {state.gradientStops.length > 2 && (
                    <button
                      onClick={() => onRemoveGradientStop(stop.id)}
                      className="p-2 hover:bg-neutral-700 rounded transition-colors text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Gradient Preview */}
            <div
              className="w-full h-12 rounded mt-3 border border-neutral-700"
              style={{
                background:
                  state.fillType === 'linear'
                    ? `linear-gradient(${state.gradientAngle}deg, ${state.gradientStops
                        .map((s) => `${s.color} ${s.position}%`)
                        .join(', ')})`
                    : state.fillType === 'radial'
                    ? `radial-gradient(circle, ${state.gradientStops
                        .map((s) => `${s.color} ${s.position}%`)
                        .join(', ')})`
                    : `conic-gradient(from ${state.gradientAngle}deg, ${state.gradientStops
                        .map((s) => `${s.color} ${s.position}%`)
                        .join(', ')})`,
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
