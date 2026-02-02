import React, { memo } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Palette, 
  Sparkles, 
  Move,
  Plus,
  Trash2
} from 'lucide-react';

/**
 * Control Panel Component
 * Right sidebar with all shape controls
 */
export const ControlPanel: React.FC = memo(() => {
  const { superellipse, glow, animation, scene } = useAppContext();
  const { state, updateState, updateGradientStop, addGradientStop, removeGradientStop } = superellipse;

  return (
    <div className="w-80 border-l border-border bg-card flex flex-col overflow-hidden">
      <Tabs defaultValue="shape" className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-4 m-2">
          <TabsTrigger value="shape" className="text-xs">
            <Settings className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger value="fill" className="text-xs">
            <Palette className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger value="effects" className="text-xs">
            <Sparkles className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger value="transform" className="text-xs">
            <Move className="w-4 h-4" />
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          {/* Shape Tab */}
          <TabsContent value="shape" className="p-4 space-y-6 mt-0">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Settings className="w-4 h-4 text-primary" />
                Shape Properties
              </h3>

              {/* Width */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-xs">Width</Label>
                  <span className="text-xs text-muted-foreground">{state.width}px</span>
                </div>
                <Slider
                  value={[state.width]}
                  onValueChange={([v]) => updateState({ width: v })}
                  min={50}
                  max={500}
                  step={1}
                />
              </div>

              {/* Height */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-xs">Height</Label>
                  <span className="text-xs text-muted-foreground">{state.height}px</span>
                </div>
                <Slider
                  value={[state.height]}
                  onValueChange={([v]) => updateState({ height: v })}
                  min={50}
                  max={500}
                  step={1}
                />
              </div>

              {/* N Parameter */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-xs">Curvature (n)</Label>
                  <span className="text-xs text-muted-foreground">{state.n.toFixed(2)}</span>
                </div>
                <Slider
                  value={[state.n]}
                  onValueChange={([v]) => updateState({ n: v })}
                  min={0.5}
                  max={10}
                  step={0.01}
                />
              </div>

              {/* Stroke */}
              <div className="space-y-3 pt-3 border-t border-border">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Stroke</Label>
                  <Switch
                    checked={state.hasStroke}
                    onCheckedChange={(v) => updateState({ hasStroke: v })}
                  />
                </div>

                {state.hasStroke && (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-xs">Width</Label>
                        <span className="text-xs text-muted-foreground">{state.strokeWidth}px</span>
                      </div>
                      <Slider
                        value={[state.strokeWidth]}
                        onValueChange={([v]) => updateState({ strokeWidth: v })}
                        min={0}
                        max={20}
                        step={0.5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Color</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={state.strokeColor}
                          onChange={(e) => updateState({ strokeColor: e.target.value })}
                          className="w-8 h-8 rounded cursor-pointer border border-border"
                        />
                        <input
                          type="text"
                          value={state.strokeColor}
                          onChange={(e) => updateState({ strokeColor: e.target.value })}
                          className="flex-1 bg-secondary px-2 py-1 rounded text-xs font-mono"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Fill Tab */}
          <TabsContent value="fill" className="p-4 space-y-6 mt-0">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Palette className="w-4 h-4 text-primary" />
                Fill Options
              </h3>

              <div className="flex items-center justify-between">
                <Label className="text-xs">Use Gradient</Label>
                <Switch
                  checked={state.useGradient}
                  onCheckedChange={(v) => updateState({ useGradient: v })}
                />
              </div>

              {!state.useGradient ? (
                <div className="space-y-2">
                  <Label className="text-xs">Solid Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={state.solidColor}
                      onChange={(e) => updateState({ solidColor: e.target.value })}
                      className="w-10 h-10 rounded cursor-pointer border border-border"
                    />
                    <input
                      type="text"
                      value={state.solidColor}
                      onChange={(e) => updateState({ solidColor: e.target.value })}
                      className="flex-1 bg-secondary px-2 py-1 rounded text-xs font-mono"
                    />
                  </div>
                </div>
              ) : (
                <>
                  {/* Gradient Angle */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-xs">Gradient Angle</Label>
                      <span className="text-xs text-muted-foreground">{state.gradientAngle}°</span>
                    </div>
                    <Slider
                      value={[state.gradientAngle]}
                      onValueChange={([v]) => updateState({ gradientAngle: v })}
                      min={0}
                      max={360}
                      step={1}
                    />
                  </div>

                  {/* Gradient Stops */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Color Stops</Label>
                      <button
                        onClick={() => addGradientStop('#ffffff', 0.5)}
                        className="p-1 hover:bg-secondary rounded"
                        title="Add Stop"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {state.gradientStops.map((stop) => (
                        <div key={stop.id} className="flex items-center gap-2">
                          <input
                            type="color"
                            value={stop.color}
                            onChange={(e) => updateGradientStop(stop.id, { color: e.target.value })}
                            className="w-8 h-8 rounded cursor-pointer border border-border"
                          />
                          <input
                            type="number"
                            value={Math.round(stop.position * 100)}
                            onChange={(e) => updateGradientStop(stop.id, { position: Number(e.target.value) / 100 })}
                            className="w-16 bg-secondary px-2 py-1 rounded text-xs font-mono"
                            min={0}
                            max={100}
                          />
                          <span className="text-xs text-muted-foreground">%</span>
                          {state.gradientStops.length > 2 && (
                            <button
                              onClick={() => removeGradientStop(stop.id)}
                              className="p-1 hover:bg-destructive/20 hover:text-destructive rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="space-y-2">
                    <Label className="text-xs">Preview</Label>
                    <div
                      className="h-8 rounded border border-border"
                      style={{
                        background: `linear-gradient(${state.gradientAngle}deg, ${state.gradientStops
                          .map((s) => `${s.color} ${s.position * 100}%`)
                          .join(', ')})`,
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          {/* Effects Tab */}
          <TabsContent value="effects" className="p-4 space-y-6 mt-0">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Glow Effect
              </h3>

              <div className="flex items-center justify-between">
                <Label className="text-xs">Enable Glow</Label>
                <Switch
                  checked={glow.enabled}
                  onCheckedChange={glow.setEnabled}
                />
              </div>

              {glow.enabled && (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-xs">Mask Size</Label>
                      <span className="text-xs text-muted-foreground">{(glow.maskSize * 100).toFixed(0)}%</span>
                    </div>
                    <Slider
                      value={[glow.maskSize]}
                      onValueChange={([v]) => glow.setMaskSize(v)}
                      min={0}
                      max={1}
                      step={0.01}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-xs">Scale</Label>
                      <span className="text-xs text-muted-foreground">{(glow.scale * 100).toFixed(0)}%</span>
                    </div>
                    <Slider
                      value={[glow.scale]}
                      onValueChange={([v]) => glow.setScale(v)}
                      min={0.5}
                      max={2}
                      step={0.01}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Animation */}
            <div className="space-y-4 pt-4 border-t border-border">
              <h3 className="text-sm font-semibold">Animation</h3>

              <div className="flex items-center justify-between">
                <Label className="text-xs">Enable Animation</Label>
                <Switch
                  checked={animation.enabled}
                  onCheckedChange={animation.setEnabled}
                />
              </div>

              {animation.enabled && (
                <>
                  <div className="grid grid-cols-3 gap-2">
                    {(['pulse', 'rotate', 'wave'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => animation.setType(type)}
                        className={`
                          p-2 rounded text-xs capitalize transition-colors
                          ${animation.type === type 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-secondary hover:bg-secondary/80'}
                        `}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-xs">Speed</Label>
                      <span className="text-xs text-muted-foreground">{animation.speed}x</span>
                    </div>
                    <Slider
                      value={[animation.speed]}
                      onValueChange={([v]) => animation.setSpeed(v)}
                      min={0.1}
                      max={3}
                      step={0.1}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Noise */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Noise Overlay</Label>
                <Switch
                  checked={glow.noiseEnabled}
                  onCheckedChange={glow.setNoiseEnabled}
                />
              </div>

              {glow.noiseEnabled && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-xs">Intensity</Label>
                    <span className="text-xs text-muted-foreground">{(glow.noiseIntensity * 100).toFixed(0)}%</span>
                  </div>
                  <Slider
                    value={[glow.noiseIntensity]}
                    onValueChange={([v]) => glow.setNoiseIntensity(v)}
                    min={0}
                    max={1}
                    step={0.01}
                  />
                </div>
              )}
            </div>
          </TabsContent>

          {/* Transform Tab */}
          <TabsContent value="transform" className="p-4 space-y-6 mt-0">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Move className="w-4 h-4 text-primary" />
                Scene Settings
              </h3>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-xs">Global Scale</Label>
                  <span className="text-xs text-muted-foreground">{(scene.globalScale * 100).toFixed(0)}%</span>
                </div>
                <Slider
                  value={[scene.globalScale]}
                  onValueChange={([v]) => scene.setGlobalScale(v)}
                  min={0.5}
                  max={2}
                  step={0.01}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-xs">Gradient Mask Intensity</Label>
                  <span className="text-xs text-muted-foreground">{(scene.gradientMaskIntensity * 100).toFixed(0)}%</span>
                </div>
                <Slider
                  value={[scene.gradientMaskIntensity]}
                  onValueChange={([v]) => scene.setGradientMaskIntensity(v)}
                  min={0}
                  max={1}
                  step={0.01}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-xs">Noise Overlay</Label>
                <Switch
                  checked={scene.noiseOverlay}
                  onCheckedChange={scene.setNoiseOverlay}
                />
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
});

ControlPanel.displayName = 'ControlPanel';
