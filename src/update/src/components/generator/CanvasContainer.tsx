import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react';
import { PreviewArea } from './PreviewArea';
import { SuperellipseState, Layer } from '@/types/layers';

interface CanvasContainerProps {
  state: SuperellipseState;
  pathData: string;
  layers: Layer[];
  selectedLayerId: string | null;
  zoom: number;
  panX: number;
  panY: number;
  isPanning: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onZoomTo100: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onTransformUpdate?: (layerId: string, transform: Partial<Layer['transform']>) => void;
  // New glow editor props
  glowEnabled?: boolean;
  maskSize?: number;
  glowScale?: number;
  positionX?: number;
  positionY?: number;
  noiseEnabled?: boolean;
  noiseIntensity?: number;
  onRandomColor?: () => void;
}

export function CanvasContainer({
  state,
  pathData,
  layers,
  selectedLayerId,
  zoom,
  panX,
  panY,
  isPanning,
  containerRef,
  onZoomIn,
  onZoomOut,
  onResetView,
  onZoomTo100,
  onMouseDown,
  onMouseMove,
  onTransformUpdate,
  glowEnabled = true,
  maskSize = 0.3,
  glowScale = 0.9,
  positionX = -590,
  positionY = -1070,
  noiseEnabled = true,
  noiseIntensity = 0.35,
  onRandomColor = () => {},
}: CanvasContainerProps) {
  return (
    <div className="relative flex-1 flex flex-col bg-neutral-900">
      {/* Toolbar */}
      <div className="h-12 border-b border-neutral-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-white">Canvas Preview</h2>
          <span className="text-xs text-neutral-500">
            {state.width} × {state.height}px
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onZoomOut}
            className="p-2 hover:bg-neutral-800 rounded transition-colors text-white"
            title="Zoom Out (Ctrl + -)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          
          <button
            onClick={onZoomTo100}
            className="px-3 py-1 hover:bg-neutral-800 rounded transition-colors text-white text-sm font-mono"
            title="Zoom to 100% (Ctrl + 1)"
          >
            {zoom}%
          </button>
          
          <button
            onClick={onZoomIn}
            className="p-2 hover:bg-neutral-800 rounded transition-colors text-white"
            title="Zoom In (Ctrl + +)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          
          <div className="w-px h-6 bg-neutral-700 mx-1" />
          
          <button
            onClick={onResetView}
            className="p-2 hover:bg-neutral-800 rounded transition-colors text-white"
            title="Fit to View (Ctrl + 0)"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          
          <button
            onClick={onResetView}
            className="p-2 hover:bg-neutral-800 rounded transition-colors text-white"
            title="Reset Pan"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div
        ref={containerRef}
        className={`flex-1 relative ${isPanning ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
      >
        <PreviewArea
          state={state}
          pathData={pathData}
          layers={layers}
          selectedLayerId={selectedLayerId}
          zoom={zoom}
          panX={panX}
          panY={panY}
          glowEnabled={glowEnabled}
          maskSize={maskSize}
          glowScale={glowScale}
          positionX={positionX}
          positionY={positionY}
          noiseEnabled={noiseEnabled}
          noiseIntensity={noiseIntensity}
          onRandomColor={onRandomColor}
          onTransformUpdate={onTransformUpdate}
        />
      </div>

      {/* Help text */}
      <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg text-xs">
        <p className="mb-1">
          <kbd className="bg-neutral-800 px-1 rounded">Space</kbd> + Drag to pan
        </p>
        <p>
          <kbd className="bg-neutral-800 px-1 rounded">Ctrl</kbd> + Scroll to zoom
        </p>
      </div>
    </div>
  );
}