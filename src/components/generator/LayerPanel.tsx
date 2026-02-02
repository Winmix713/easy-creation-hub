import { Layer, BlendMode } from '@/types/layers';
import { Eye, EyeOff, Lock, Unlock, Trash2, Copy, Plus, GripVertical } from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useRef, useState } from 'react';

interface LayerPanelProps {
  layers: Layer[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string) => void;
  onAddLayer: () => void;
  onRemoveLayer: (id: string) => void;
  onDuplicateLayer: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
  onSetBlendMode: (id: string, mode: BlendMode) => void;
  onSetOpacity: (id: string, opacity: number) => void;
  onReorderLayers?: (fromIndex: number, toIndex: number) => void;
}

const BLEND_MODES: BlendMode[] = [
  'normal',
  'multiply',
  'screen',
  'overlay',
  'darken',
  'lighten',
  'color-dodge',
  'color-burn',
  'hard-light',
  'soft-light',
  'difference',
  'exclusion',
  'hue',
  'saturation',
  'color',
  'luminosity',
];

export function LayerPanel({
  layers,
  selectedLayerId,
  onSelectLayer,
  onAddLayer,
  onRemoveLayer,
  onDuplicateLayer,
  onToggleVisibility,
  onToggleLock,
  onSetBlendMode,
  onSetOpacity,
  onReorderLayers,
}: LayerPanelProps) {
  const selectedLayer = layers.find((l) => l.id === selectedLayerId);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-80 bg-neutral-900 border-r border-neutral-800 flex flex-col">
        {/* Header */}
        <div className="h-12 border-b border-neutral-800 flex items-center justify-between px-4">
          <h2 className="font-semibold text-white">Layers</h2>
          <button
            onClick={onAddLayer}
            className="p-1.5 hover:bg-neutral-800 rounded transition-colors text-white"
            title="Add layer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Layer List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {layers.length === 0 ? (
            <div className="text-center py-8 text-neutral-500 text-sm">
              <p>No layers yet</p>
              <p className="text-xs mt-1">Click + to add a layer</p>
            </div>
          ) : (
            layers.map((layer, index) => (
              <LayerItem
                key={layer.id}
                layer={layer}
                index={index}
                isSelected={selectedLayerId === layer.id}
                onSelectLayer={onSelectLayer}
                onToggleVisibility={onToggleVisibility}
                onToggleLock={onToggleLock}
                onReorderLayers={onReorderLayers}
                setIsDragging={setIsDragging}
              />
            ))
          )}
        </div>

        {/* Layer Properties */}
        {selectedLayer && (
          <div className="border-t border-neutral-800 p-4 space-y-4">
            <div>
              <h3 className="text-xs font-semibold text-white mb-2">Layer Properties</h3>
            </div>

            {/* Opacity */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-neutral-400">Opacity</label>
                <span className="text-xs text-white font-mono">{selectedLayer.opacity}%</span>
              </div>
              <input
                type="range"
                value={selectedLayer.opacity}
                onChange={(e) => onSetOpacity(selectedLayer.id, Number(e.target.value))}
                min={0}
                max={100}
                className="w-full"
              />
            </div>

            {/* Blend Mode */}
            <div>
              <label className="text-xs text-neutral-400 mb-2 block">Blend Mode</label>
              <select
                value={selectedLayer.blendMode}
                onChange={(e) => onSetBlendMode(selectedLayer.id, e.target.value as BlendMode)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white text-sm"
              >
                {BLEND_MODES.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode.charAt(0).toUpperCase() + mode.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => onDuplicateLayer(selectedLayer.id)}
                className="flex-1 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Copy className="w-4 h-4" />
                Duplicate
              </button>
              <button
                onClick={() => onRemoveLayer(selectedLayer.id)}
                className="flex-1 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-500 rounded transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
}

interface LayerItemProps {
  layer: Layer;
  index: number;
  isSelected: boolean;
  onSelectLayer: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
  onReorderLayers?: (fromIndex: number, toIndex: number) => void;
  setIsDragging: (isDragging: boolean) => void;
}

function LayerItem({
  layer,
  index,
  isSelected,
  onSelectLayer,
  onToggleVisibility,
  onToggleLock,
  onReorderLayers,
  setIsDragging,
}: LayerItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'LAYER',
    item: { id: layer.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: () => setIsDragging(false),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'LAYER',
    hover(item: { id: string; index: number }) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      onReorderLayers?.(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      onClick={() => onSelectLayer(layer.id)}
      className={`p-3 rounded-lg cursor-pointer transition-colors ${
        isSelected
          ? 'bg-blue-600/20 border-blue-500/50 border'
          : 'bg-neutral-800 hover:bg-neutral-750 border border-transparent'
      }`}
      style={{
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 flex-1">
          <GripVertical className="w-3.5 h-3.5 text-neutral-500" />
          <span className="text-sm font-medium text-white truncate">
            {layer.name}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility(layer.id);
            }}
            className="p-1 hover:bg-neutral-700 rounded transition-colors"
          >
            {layer.visible ? (
              <Eye className="w-3.5 h-3.5 text-white" />
            ) : (
              <EyeOff className="w-3.5 h-3.5 text-neutral-500" />
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLock(layer.id);
            }}
            className="p-1 hover:bg-neutral-700 rounded transition-colors"
          >
            {layer.locked ? (
              <Lock className="w-3.5 h-3.5 text-white" />
            ) : (
              <Unlock className="w-3.5 h-3.5 text-neutral-500" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-neutral-400">
        <span className="capitalize">{layer.type}</span>
        <span>•</span>
        <span>{layer.opacity}%</span>
      </div>
    </div>
  );
}