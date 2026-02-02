import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface SceneSettingsProps {
  globalScale: number;
  setGlobalScale: (v: number) => void;
  gradientMaskIntensity: number;
  setGradientMaskIntensity: (v: number) => void;
  noiseOverlay: boolean;
  setNoiseOverlay: (v: boolean) => void;
  isDark: boolean;
}

export function SceneSettings({
  globalScale,
  setGlobalScale,
  gradientMaskIntensity,
  setGradientMaskIntensity,
  noiseOverlay,
  setNoiseOverlay,
  isDark,
}: SceneSettingsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className={cn('text-lg font-semibold mb-4', isDark ? 'text-white' : 'text-zinc-900')}>
          Scene Settings
        </h3>
        <p className="text-sm text-neutral-400 mb-4">Global appearance controls</p>
      </div>

      {/* Global Scale */}
      <div>
        <div className="flex justify-between text-sm mb-2">
          <label className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>Global Scale</label>
          <span className={isDark ? 'text-zinc-300' : 'text-zinc-700'}>{globalScale.toFixed(1)}x</span>
        </div>
        <Slider value={[globalScale]} onValueChange={(v) => setGlobalScale(v[0])} min={0.5} max={2} step={0.1} />
        <p className="text-xs text-neutral-500 mt-1">Scale all elements uniformly</p>
      </div>

      {/* Gradient Mask Intensity */}
      <div>
        <div className="flex justify-between text-sm mb-2">
          <label className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>Gradient Mask Intensity</label>
          <span className={isDark ? 'text-zinc-300' : 'text-zinc-700'}>{Math.round(gradientMaskIntensity * 100)}%</span>
        </div>
        <Slider
          value={[gradientMaskIntensity]}
          onValueChange={(v) => setGradientMaskIntensity(v[0])}
          min={0}
          max={1}
          step={0.01}
        />
        <p className="text-xs text-neutral-500 mt-1">Control gradient visibility fade</p>
      </div>

      {/* Noise Overlay */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <label className={cn('text-sm font-medium', isDark ? 'text-zinc-300' : 'text-zinc-700')}>
              Noise Overlay
            </label>
            <p className="text-xs text-neutral-500 mt-0.5">Add grain texture to scene</p>
          </div>
          <Switch checked={noiseOverlay} onCheckedChange={setNoiseOverlay} />
        </div>
      </div>

      {/* Background Info */}
      <div className="mt-6 p-4 bg-neutral-800/50 rounded-lg border border-neutral-700">
        <h4 className="text-sm font-medium text-white mb-2">Scene Information</h4>
        <div className="space-y-1 text-xs text-neutral-400">
          <div className="flex justify-between">
            <span>Render Quality:</span>
            <span className="text-neutral-300">High (Retina)</span>
          </div>
          <div className="flex justify-between">
            <span>Color Space:</span>
            <span className="text-neutral-300">OKLCH</span>
          </div>
          <div className="flex justify-between">
            <span>Blend Mode:</span>
            <span className="text-neutral-300">Screen</span>
          </div>
        </div>
      </div>
    </div>
  );
}
