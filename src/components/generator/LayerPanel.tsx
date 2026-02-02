import React, { memo } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { 
  Layers, 
  Plus, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Trash2, 
  Copy,
  Square,
  Type,
  Image
} from 'lucide-react';

/**
 * Layer Panel Component
 * Displays and manages layers
 */
export const LayerPanel: React.FC = memo(() => {
  const { layers } = useAppContext();

  const getLayerIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <Type className="w-4 h-4" />;
      case 'image':
        return <Image className="w-4 h-4" />;
      default:
        return <Square className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-64 border-r border-border bg-card flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Layers</h2>
          </div>
          <button
            onClick={() => layers.add('shape')}
            className="p-1.5 hover:bg-secondary rounded transition-colors"
            title="Add Layer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Layer List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {layers.items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No layers yet
          </div>
        ) : (
          layers.items.map((layer) => (
            <div
              key={layer.id}
              onClick={() => layers.select(layer.id)}
              className={`
                group flex items-center gap-2 p-2 rounded cursor-pointer transition-colors
                ${layers.selectedId === layer.id 
                  ? 'bg-primary/10 border border-primary/30' 
                  : 'hover:bg-secondary/50 border border-transparent'}
              `}
            >
              {/* Layer Icon */}
              <div className="text-muted-foreground">
                {getLayerIcon(layer.type)}
              </div>

              {/* Layer Name */}
              <span className="flex-1 truncate text-sm">
                {layer.name}
              </span>

              {/* Layer Controls */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    layers.toggleVisibility(layer.id);
                  }}
                  className="p-1 hover:bg-muted rounded"
                  title={layer.visible ? 'Hide' : 'Show'}
                >
                  {layer.visible ? (
                    <Eye className="w-3.5 h-3.5" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    layers.toggleLock(layer.id);
                  }}
                  className="p-1 hover:bg-muted rounded"
                  title={layer.locked ? 'Unlock' : 'Lock'}
                >
                  {layer.locked ? (
                    <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                  ) : (
                    <Unlock className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    layers.duplicate(layer.id);
                  }}
                  className="p-1 hover:bg-muted rounded"
                  title="Duplicate"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    layers.remove(layer.id);
                  }}
                  className="p-1 hover:bg-destructive/20 hover:text-destructive rounded"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Layer Buttons */}
      <div className="p-3 border-t border-border">
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => layers.add('shape')}
            className="flex flex-col items-center gap-1 p-2 hover:bg-secondary rounded transition-colors text-xs"
          >
            <Square className="w-4 h-4" />
            Shape
          </button>
          <button
            onClick={() => layers.add('text')}
            className="flex flex-col items-center gap-1 p-2 hover:bg-secondary rounded transition-colors text-xs"
          >
            <Type className="w-4 h-4" />
            Text
          </button>
          <button
            onClick={() => layers.add('image')}
            className="flex flex-col items-center gap-1 p-2 hover:bg-secondary rounded transition-colors text-xs"
          >
            <Image className="w-4 h-4" />
            Image
          </button>
        </div>
      </div>
    </div>
  );
});

LayerPanel.displayName = 'LayerPanel';
