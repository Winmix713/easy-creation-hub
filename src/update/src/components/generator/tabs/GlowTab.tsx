import { SuperellipseState } from '@/types/layers';
import { Sparkles, ChevronDown, Play, Pause } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface GlowTabProps {
  state: SuperellipseState;
  onUpdate: (updates: Partial<SuperellipseState>) => void;
  onRandomizeGlow: () => void;
  // New glow editor props
  glowEnabled?: boolean;
  setGlowEnabled?: (v: boolean) => void;
  maskSize?: number;
  setMaskSize?: (v: number) => void;
  glowScale?: number;
  setGlowScale?: (v: number) => void;
  positionX?: number;
  setPositionX?: (v: number) => void;
  positionY?: number;
  setPositionY?: (v: number) => void;
  noiseEnabled?: boolean;
  setNoiseEnabled?: (v: boolean) => void;
  noiseIntensity?: number;
  setNoiseIntensity?: (v: number) => void;
  // Animation props
  animationEnabled?: boolean;
  setAnimationEnabled?: (v: boolean) => void;
  animationType?: 'pulse' | 'rotate' | 'wave';
  setAnimationType?: (v: 'pulse' | 'rotate' | 'wave') => void;
  animationSpeed?: number;
  setAnimationSpeed?: (v: number) => void;
}

export function GlowTab({ 
  state, 
  onUpdate, 
  onRandomizeGlow,
  glowEnabled = true,
  setGlowEnabled = () => {},
  maskSize = 0.3,
  setMaskSize = () => {},
  glowScale = 0.9,
  setGlowScale = () => {},
  positionX = -590,
  setPositionX = () => {},
  positionY = -1070,
  setPositionY = () => {},
  noiseEnabled = true,
  setNoiseEnabled = () => {},
  noiseIntensity = 0.35,
  setNoiseIntensity = () => {},
  animationEnabled = false,
  setAnimationEnabled = () => {},
  animationType = 'pulse',
  setAnimationType = () => {},
  animationSpeed = 1,
  setAnimationSpeed = () => {},
}: GlowTabProps) {
  const [isShapeOpen, setIsShapeOpen] = useState(true);
  const [isPositionOpen, setIsPositionOpen] = useState(false);
  const [isAnimationOpen, setIsAnimationOpen] = useState(false);

  const isDark = state.backgroundColor === '#1a1a1a';

  return (
    <div className="space-y-6">
      {/* Advanced Glow Editor */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={cn('text-lg font-semibold', isDark ? 'text-white' : 'text-zinc-900')}>
              Glow Editor
            </h3>
            <p className="text-sm text-neutral-500">Advanced glow effects</p>
          </div>
          <Switch
            checked={glowEnabled}
            onCheckedChange={setGlowEnabled}
            className="data-[state=unchecked]:bg-zinc-950 border border-white/10"
          />
        </div>

        {glowEnabled && (
          <div className="space-y-4">
            {/* Shape Configuration */}
            <Collapsible open={isShapeOpen} onOpenChange={setIsShapeOpen}>
              <CollapsibleTrigger asChild>
                <button className={cn(
                  'flex items-center justify-between w-full text-sm font-medium',
                  isDark ? 'text-zinc-400 hover:text-zinc-300' : 'text-zinc-600 hover:text-zinc-900'
                )}>
                  <span>Shape Configuration</span>
                  <ChevronDown className={cn('w-4 h-4 transition-transform', isShapeOpen && 'rotate-180')} />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-3 pt-3">
                  <div>
                    <div className="flex justify-between text-xs text-neutral-500 mb-1">
                      <span>Mask Size</span>
                      <span>{Math.round(maskSize * 100)}%</span>
                    </div>
                    <Slider value={[maskSize]} onValueChange={(v) => setMaskSize(v[0])} max={1} step={0.01} />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-neutral-500 mb-1">
                      <span>Glow Scale</span>
                      <span>{glowScale.toFixed(1)}x</span>
                    </div>
                    <Slider value={[glowScale]} onValueChange={(v) => setGlowScale(v[0])} min={0.5} max={3} step={0.1} />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <label className="text-xs text-neutral-500">Noise Overlay</label>
                    <Switch checked={noiseEnabled} onCheckedChange={setNoiseEnabled} />
                  </div>

                  {noiseEnabled && (
                    <div>
                      <div className="flex justify-between text-xs text-neutral-500 mb-1">
                        <span>Noise Intensity</span>
                        <span>{Math.round(noiseIntensity * 100)}%</span>
                      </div>
                      <Slider value={[noiseIntensity]} onValueChange={(v) => setNoiseIntensity(v[0])} max={1} step={0.01} />
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Position */}
            <div className="pt-4 border-t border-white/5">
              <Collapsible open={isPositionOpen} onOpenChange={setIsPositionOpen}>
                <CollapsibleTrigger asChild>
                  <button className={cn(
                    'flex items-center justify-between w-full text-sm font-medium',
                    isDark ? 'text-zinc-400 hover:text-zinc-300' : 'text-zinc-600 hover:text-zinc-900'
                  )}>
                    <span>Glow Position</span>
                    <ChevronDown className={cn('w-4 h-4 transition-transform', isPositionOpen && 'rotate-180')} />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-3 pt-3">
                    <div>
                      <div className="flex justify-between text-xs text-neutral-500 mb-1">
                        <span>X Position</span>
                        <span>{positionX}px</span>
                      </div>
                      <Slider value={[positionX]} onValueChange={(v) => setPositionX(v[0])} min={-800} max={-350} step={5} />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-neutral-500 mb-1">
                        <span>Y Position</span>
                        <span>{positionY}px</span>
                      </div>
                      <Slider value={[positionY]} onValueChange={(v) => setPositionY(v[0])} min={-1400} max={-600} step={5} />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>

            {/* Animation Controls */}
            <div className="pt-4 border-t border-white/5">
              <Collapsible open={isAnimationOpen} onOpenChange={setIsAnimationOpen}>
                <CollapsibleTrigger asChild>
                  <button className={cn(
                    'flex items-center justify-between w-full text-sm font-medium',
                    isDark ? 'text-zinc-400 hover:text-zinc-300' : 'text-zinc-600 hover:text-zinc-900'
                  )}>
                    <span className="flex items-center gap-2">
                      <Play className="w-3.5 h-3.5" />
                      Animation Controls
                    </span>
                    <ChevronDown className={cn('w-4 h-4 transition-transform', isAnimationOpen && 'rotate-180')} />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-3 pt-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-neutral-500">Enable Animation</label>
                      <Switch checked={animationEnabled} onCheckedChange={setAnimationEnabled} />
                    </div>

                    {animationEnabled && (
                      <>
                        <div>
                          <label className="text-xs text-neutral-500 mb-2 block">Animation Type</label>
                          <div className="grid grid-cols-3 gap-2">
                            {(['pulse', 'rotate', 'wave'] as const).map((type) => (
                              <button
                                key={type}
                                onClick={() => setAnimationType(type)}
                                className={cn(
                                  'px-3 py-2 rounded-lg text-xs font-medium transition-colors capitalize',
                                  animationType === type
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                                )}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs text-neutral-500 mb-1">
                            <span>Animation Speed</span>
                            <span>{animationSpeed.toFixed(1)}x</span>
                          </div>
                          <Slider
                            value={[animationSpeed]}
                            onValueChange={(v) => setAnimationSpeed(v[0])}
                            min={0.1}
                            max={3}
                            step={0.1}
                          />
                        </div>

                        {/* CSS Export Preview */}
                        <div className="mt-3 p-3 bg-neutral-950 rounded-lg border border-neutral-800">
                          <div className="text-xs text-neutral-500 mb-1">CSS Animation:</div>
                          <code className="text-xs text-blue-400 font-mono">
                            animation: {animationType} {(2 / animationSpeed).toFixed(1)}s ease-in-out infinite;
                          </code>
                        </div>
                      </>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        )}
      </div>

      {/* Original Glow Settings */}
      <div className="pt-6 border-t border-neutral-700">
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-semibold text-white">Layer Glow Effect</label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={state.glowEnabled}
              onChange={(e) => onUpdate({ glowEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {state.glowEnabled && (
          <>
            {/* Glow Color */}
            <div>
              <label className="text-xs text-neutral-400 mb-2 block">Glow Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={state.glowColor}
                  onChange={(e) => onUpdate({ glowColor: e.target.value })}
                  className="w-12 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={state.glowColor}
                  onChange={(e) => onUpdate({ glowColor: e.target.value })}
                  className="flex-1 bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white font-mono text-sm"
                />
                <button
                  onClick={onRandomizeGlow}
                  className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded transition-colors text-white"
                  title="Randomize"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Intensity */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-neutral-400">Intensity</label>
                <span className="text-xs text-white font-mono">{state.glowIntensity}%</span>
              </div>
              <input
                type="range"
                value={state.glowIntensity}
                onChange={(e) => onUpdate({ glowIntensity: Number(e.target.value) })}
                min={0}
                max={200}
                className="w-full"
              />
            </div>

            {/* Glow Layers */}
            <div className="mt-6">
              <h4 className="text-xs text-neutral-400 mb-3">Glow Layers</h4>
              <div className="space-y-3">
                {state.glowLayers.map((layer, index) => (
                  <div
                    key={layer.id}
                    className="bg-neutral-800 rounded-lg p-3 border border-neutral-700"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-white">
                        Layer {index + 1}
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={layer.enabled}
                          onChange={(e) => {
                            const newLayers = [...state.glowLayers];
                            newLayers[index] = {
                              ...newLayers[index],
                              enabled: e.target.checked,
                            };
                            onUpdate({ glowLayers: newLayers });
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs text-neutral-500">Blur</label>
                          <span className="text-xs text-neutral-400">{layer.blur}px</span>
                        </div>
                        <input
                          type="range"
                          value={layer.blur}
                          onChange={(e) => {
                            const newLayers = [...state.glowLayers];
                            newLayers[index] = {
                              ...newLayers[index],
                              blur: Number(e.target.value),
                            };
                            onUpdate({ glowLayers: newLayers });
                          }}
                          min={0}
                          max={150}
                          className="w-full"
                          disabled={!layer.enabled}
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs text-neutral-500">Opacity</label>
                          <span className="text-xs text-neutral-400">{layer.opacity}%</span>
                        </div>
                        <input
                          type="range"
                          value={layer.opacity}
                          onChange={(e) => {
                            const newLayers = [...state.glowLayers];
                            newLayers[index] = {
                              ...newLayers[index],
                              opacity: Number(e.target.value),
                            };
                            onUpdate({ glowLayers: newLayers });
                          }}
                          min={0}
                          max={100}
                          className="w-full"
                          disabled={!layer.enabled}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}