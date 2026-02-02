import { useState, useRef, useEffect } from 'react';
import { Layer } from '@/types/layers';

interface LayerTransformControlsProps {
  layer: Layer;
  isSelected: boolean;
  onTransformUpdate: (layerId: string, transform: Partial<Layer['transform']>) => void;
}

export function LayerTransformControls({
  layer,
  isSelected,
  onTransformUpdate,
}: LayerTransformControlsProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  // Don't show controls if layer is locked or not selected
  if (!isSelected || layer.locked || !layer.visible) {
    return null;
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    // Prevent dragging when not clicking on the layer itself
    if (e.target !== elementRef.current && !elementRef.current?.contains(e.target as Node)) {
      return;
    }

    e.stopPropagation();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - layer.transform.x,
      y: e.clientY - layer.transform.y,
    });
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      onTransformUpdate(layer.id, { x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, layer.id, onTransformUpdate]);

  // Calculate bounding box based on layer content
  const width = layer.content?.superellipseState?.width || 200;
  const height = layer.content?.superellipseState?.height || 200;

  return (
    <div
      ref={elementRef}
      className="absolute pointer-events-auto cursor-move"
      style={{
        left: '50%',
        top: '50%',
        marginLeft: -width / 2,
        marginTop: -height / 2,
        width,
        height,
        border: '2px dashed rgba(59, 130, 246, 0.5)',
        borderRadius: '8px',
        zIndex: 1000,
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Corner handles for future scale implementation */}
      <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full cursor-nwse-resize" />
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full cursor-nesw-resize" />
      <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 rounded-full cursor-nesw-resize" />
      <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 rounded-full cursor-nwse-resize" />

      {/* Center handle for future rotate implementation */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-4 h-4 bg-green-500 rounded-full cursor-grab" title="Rotate (Coming Soon)" />
    </div>
  );
}
