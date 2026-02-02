import { SuperellipseState } from '@/types/layers';
import { validateWidth, validateHeight, validateExponent } from '@/utils/validation';
import { SHAPE_BOUNDS } from '@/constants/index';
import { Lock, Unlock } from 'lucide-react';

interface ShapeTabProps {
  state: SuperellipseState;
  onUpdate: (updates: Partial<SuperellipseState>) => void;
}

export function ShapeTab({ state, onUpdate }: ShapeTabProps) {
  return (
    <div className="space-y-6">
      {/* Dimensions */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Dimensions</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="text-xs text-neutral-400 mb-1 block">Width</label>
              <input
                type="number"
                value={state.width}
                onChange={(e) => onUpdate({ width: validateWidth(Number(e.target.value)) })}
                min={SHAPE_BOUNDS.WIDTH.MIN}
                max={SHAPE_BOUNDS.WIDTH.MAX}
                className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white"
              />
            </div>

            <button
              onClick={() => onUpdate({ lockAspectRatio: !state.lockAspectRatio })}
              className="mt-5 p-2 hover:bg-neutral-700 rounded transition-colors text-white"
              title={state.lockAspectRatio ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
            >
              {state.lockAspectRatio ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            </button>

            <div className="flex-1">
              <label className="text-xs text-neutral-400 mb-1 block">Height</label>
              <input
                type="number"
                value={state.height}
                onChange={(e) => onUpdate({ height: validateHeight(Number(e.target.value)) })}
                min={SHAPE_BOUNDS.HEIGHT.MIN}
                max={SHAPE_BOUNDS.HEIGHT.MAX}
                className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Exponent */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">Corner Curvature</h3>
          <label className="flex items-center gap-2 text-xs text-neutral-400">
            <input
              type="checkbox"
              checked={state.useIndividualCorners}
              onChange={(e) => onUpdate({ useIndividualCorners: e.target.checked })}
              className="rounded"
            />
            Individual corners
          </label>
        </div>

        {!state.useIndividualCorners ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-neutral-400">Exponent (n)</label>
              <span className="text-xs text-white font-mono">{state.exponent.toFixed(1)}</span>
            </div>
            <input
              type="range"
              value={state.exponent}
              onChange={(e) => onUpdate({ exponent: validateExponent(Number(e.target.value)) })}
              min={SHAPE_BOUNDS.EXPONENT.MIN}
              max={SHAPE_BOUNDS.EXPONENT.MAX}
              step={SHAPE_BOUNDS.EXPONENT.STEP}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-neutral-500 mt-1">
              <span>Star</span>
              <span>Circle</span>
              <span>Squircle</span>
              <span>Square</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-neutral-400 mb-1 block">Top Left</label>
              <input
                type="number"
                value={state.cornerExponents.topLeft}
                onChange={(e) =>
                  onUpdate({
                    cornerExponents: {
                      ...state.cornerExponents,
                      topLeft: validateExponent(Number(e.target.value)),
                    },
                  })
                }
                min={SHAPE_BOUNDS.EXPONENT.MIN}
                max={SHAPE_BOUNDS.EXPONENT.MAX}
                step={SHAPE_BOUNDS.EXPONENT.STEP}
                className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="text-xs text-neutral-400 mb-1 block">Top Right</label>
              <input
                type="number"
                value={state.cornerExponents.topRight}
                onChange={(e) =>
                  onUpdate({
                    cornerExponents: {
                      ...state.cornerExponents,
                      topRight: validateExponent(Number(e.target.value)),
                    },
                  })
                }
                min={SHAPE_BOUNDS.EXPONENT.MIN}
                max={SHAPE_BOUNDS.EXPONENT.MAX}
                step={SHAPE_BOUNDS.EXPONENT.STEP}
                className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="text-xs text-neutral-400 mb-1 block">Bottom Left</label>
              <input
                type="number"
                value={state.cornerExponents.bottomLeft}
                onChange={(e) =>
                  onUpdate({
                    cornerExponents: {
                      ...state.cornerExponents,
                      bottomLeft: validateExponent(Number(e.target.value)),
                    },
                  })
                }
                min={SHAPE_BOUNDS.EXPONENT.MIN}
                max={SHAPE_BOUNDS.EXPONENT.MAX}
                step={SHAPE_BOUNDS.EXPONENT.STEP}
                className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="text-xs text-neutral-400 mb-1 block">Bottom Right</label>
              <input
                type="number"
                value={state.cornerExponents.bottomRight}
                onChange={(e) =>
                  onUpdate({
                    cornerExponents: {
                      ...state.cornerExponents,
                      bottomRight: validateExponent(Number(e.target.value)),
                    },
                  })
                }
                min={SHAPE_BOUNDS.EXPONENT.MIN}
                max={SHAPE_BOUNDS.EXPONENT.MAX}
                step={SHAPE_BOUNDS.EXPONENT.STEP}
                className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* Background Color */}
      <div>
        <label className="text-xs text-neutral-400 mb-2 block">Background Color</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={state.backgroundColor}
            onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
            className="w-12 h-10 rounded cursor-pointer"
          />
          <input
            type="text"
            value={state.backgroundColor}
            onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
            className="flex-1 bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white font-mono text-sm"
          />
        </div>
      </div>
    </div>
  );
}
