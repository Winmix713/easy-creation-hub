import { SuperellipseState } from '@/types/layers';
import { cn } from '@/lib/utils';

interface QuickPresetsProps {
  onLoadPreset: (state: Partial<SuperellipseState>) => void;
}

interface PresetCard {
  id: string;
  name: string;
  description: string;
  preview: string;
  state: Partial<SuperellipseState>;
}

const presets: PresetCard[] = [
  {
    id: 'ios-icon',
    name: 'iOS Icon',
    description: 'Apple app icon style',
    preview: 'bg-gradient-to-br from-blue-500 to-purple-600',
    state: {
      exponent: 4.5,
      width: 200,
      height: 200,
      fillType: 'linear',
      solidColor: '#667eea',
      gradientStops: [
        { id: '1', color: '#667eea', position: 0 },
        { id: '2', color: '#764ba2', position: 100 },
      ],
      gradientAngle: 135,
      glowEnabled: true,
      glowIntensity: 60,
    },
  },
  {
    id: 'pill',
    name: 'Pill Button',
    description: 'Rounded capsule shape',
    preview: 'bg-gradient-to-r from-pink-500 to-rose-500',
    state: {
      exponent: 10,
      width: 300,
      height: 100,
      fillType: 'linear',
      solidColor: '#ec4899',
      gradientStops: [
        { id: '1', color: '#ec4899', position: 0 },
        { id: '2', color: '#f43f5e', position: 100 },
      ],
      gradientAngle: 90,
      glowEnabled: false,
    },
  },
  {
    id: 'rounded-square',
    name: 'Rounded Square',
    description: 'Soft corners',
    preview: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    state: {
      exponent: 6,
      width: 200,
      height: 200,
      fillType: 'linear',
      solidColor: '#10b981',
      gradientStops: [
        { id: '1', color: '#10b981', position: 0 },
        { id: '2', color: '#0d9488', position: 100 },
      ],
      gradientAngle: 135,
      glowEnabled: false,
    },
  },
  {
    id: 'sharp-square',
    name: 'Sharp Square',
    description: 'Minimal corners',
    preview: 'bg-gradient-to-br from-orange-500 to-red-600',
    state: {
      exponent: 10,
      width: 200,
      height: 200,
      fillType: 'linear',
      solidColor: '#f97316',
      gradientStops: [
        { id: '1', color: '#f97316', position: 0 },
        { id: '2', color: '#dc2626', position: 100 },
      ],
      gradientAngle: 135,
      glowEnabled: false,
    },
  },
  {
    id: 'blob',
    name: 'Organic Blob',
    description: 'Asymmetric shape',
    preview: 'bg-gradient-to-br from-violet-500 to-indigo-600',
    state: {
      exponent: 3,
      width: 250,
      height: 200,
      fillType: 'radial',
      solidColor: '#8b5cf6',
      gradientStops: [
        { id: '1', color: '#8b5cf6', position: 0 },
        { id: '2', color: '#4f46e5', position: 100 },
      ],
      glowEnabled: true,
      glowIntensity: 80,
    },
  },
  {
    id: 'neon',
    name: 'Neon Glow',
    description: 'Bright glowing effect',
    preview: 'bg-gradient-to-br from-cyan-400 to-blue-600',
    state: {
      exponent: 4,
      width: 200,
      height: 200,
      fillType: 'linear',
      solidColor: '#22d3ee',
      gradientStops: [
        { id: '1', color: '#22d3ee', position: 0 },
        { id: '2', color: '#2563eb', position: 100 },
      ],
      gradientAngle: 135,
      glowEnabled: true,
      glowIntensity: 150,
      glowColor: '#22d3ee',
    },
  },
];

export function QuickPresets({ onLoadPreset }: QuickPresetsProps) {
  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-1">Quick Presets</h3>
        <p className="text-sm text-neutral-400">Click to apply a preset configuration</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onLoadPreset(preset.state)}
            className="group relative overflow-hidden rounded-xl border border-neutral-700 hover:border-neutral-600 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {/* Preview */}
            <div className={cn('h-32 w-full transition-transform group-hover:scale-105', preset.preview)} />

            {/* Content */}
            <div className="p-3 bg-neutral-800 border-t border-neutral-700">
              <div className="font-medium text-white text-sm mb-0.5">{preset.name}</div>
              <div className="text-xs text-neutral-400">{preset.description}</div>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-colors pointer-events-none" />
          </button>
        ))}
      </div>
    </div>
  );
}
