import { Layer } from '@/types/layers';
import { useState } from 'react';

interface TransformTabProps {
  selectedLayer: Layer | null | undefined;
  onUpdateTransform?: (layerId: string, transform: Partial<Layer['transform']>) => void;
}

export function TransformTab({ selectedLayer, onUpdateTransform }: TransformTabProps) {
  if (!selectedLayer) {
    return (
      <div className="text-center py-8 text-neutral-500 text-sm">
        <p>No layer selected</p>
        <p className="text-xs mt-2">Select a layer to edit its transform</p>
      </div>
    );
  }

  const { transform } = selectedLayer;

  const handleUpdate = (updates: Partial<Layer['transform']>) => {
    if (onUpdateTransform && selectedLayer) {
      onUpdateTransform(selectedLayer.id, updates);
    }
  };

  return (
    <div className="space-y-6">
      {/* Position */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Position</h3>
        
        <div className="space-y-3">
          {/* X Position */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-neutral-400">X</label>
              <span className="text-xs text-white font-mono">{transform.x.toFixed(0)}px</span>
            </div>
            <input
              type="range"
              value={transform.x}
              onChange={(e) => handleUpdate({ x: Number(e.target.value) })}
              min={-500}
              max={500}
              step={1}
              className="w-full"
            />
          </div>

          {/* Y Position */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-neutral-400">Y</label>
              <span className="text-xs text-white font-mono">{transform.y.toFixed(0)}px</span>
            </div>
            <input
              type="range"
              value={transform.y}
              onChange={(e) => handleUpdate({ y: Number(e.target.value) })}
              min={-500}
              max={500}
              step={1}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Rotation */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Rotation</h3>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-neutral-400">Angle</label>
            <span className="text-xs text-white font-mono">{transform.rotation.toFixed(0)}°</span>
          </div>
          <input
            type="range"
            value={transform.rotation}
            onChange={(e) => handleUpdate({ rotation: Number(e.target.value) })}
            min={0}
            max={360}
            step={1}
            className="w-full"
          />
        </div>
      </div>

      {/* Scale */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Scale</h3>
        
        <div className="space-y-3">
          {/* Scale X */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-neutral-400">Scale X</label>
              <span className="text-xs text-white font-mono">{transform.scaleX}%</span>
            </div>
            <input
              type="range"
              value={transform.scaleX}
              onChange={(e) => handleUpdate({ scaleX: Number(e.target.value) })}
              min={10}
              max={200}
              step={1}
              className="w-full"
            />
          </div>

          {/* Scale Y */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-neutral-400">Scale Y</label>
              <span className="text-xs text-white font-mono">{transform.scaleY}%</span>
            </div>
            <input
              type="range"
              value={transform.scaleY}
              onChange={(e) => handleUpdate({ scaleY: Number(e.target.value) })}
              min={10}
              max={200}
              step={1}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={() => handleUpdate({
          x: 0,
          y: 0,
          rotation: 0,
          scaleX: 100,
          scaleY: 100,
        })}
        className="w-full px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded transition-colors text-sm text-white"
      >
        Reset Transform
      </button>

      {/* Info */}
      <div className="p-3 bg-neutral-800/50 rounded text-xs text-neutral-400">
        <p className="mb-1">💡 <strong>Tip:</strong></p>
        <p>You can also drag the layer directly on the canvas to move it.</p>
      </div>
    </div>
  );
}