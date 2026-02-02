import React, { memo, RefObject } from 'react';
import { SuperellipseState, Layer } from '@/types';
import { ZoomIn, ZoomOut, Maximize, Move } from 'lucide-react';

interface CanvasContainerProps {
  state: SuperellipseState;
  pathData: string;
  layers: Layer[];
  selectedLayerId: string | null;
  zoom: number;
  panX: number;
  panY: number;
  isPanning: boolean;
  containerRef: RefObject<HTMLDivElement>;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onZoomTo100: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onTransformUpdate: (id: string, transform: any) => void;
  glowEnabled: boolean;
  maskSize: number;
  glowScale: number;
  positionX: number;
  positionY: number;
  noiseEnabled: boolean;
  noiseIntensity: number;
  onRandomColor: () => void;
}

/**
 * Canvas Container Component
 * Displays the superellipse with zoom/pan controls
 */
export const CanvasContainer: React.FC<CanvasContainerProps> = memo(({
  state,
  pathData,
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
  glowEnabled,
  noiseEnabled,
}) => {
  // Generate gradient ID
  const gradientId = 'superellipse-gradient';

  return (
    <div 
      ref={containerRef}
      className="flex-1 relative bg-canvas-bg overflow-hidden"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      style={{ cursor: isPanning ? 'grabbing' : 'default' }}
    >
      {/* Canvas Grid Background */}
      <div className="absolute inset-0 canvas-grid opacity-30" />

      {/* Zoom Controls */}
      <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
        <div className="bg-card/90 backdrop-blur-sm rounded-lg border border-border flex items-center">
          <button
            onClick={onZoomOut}
            className="p-2 hover:bg-secondary/50 transition-colors rounded-l-lg"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="px-3 text-sm font-mono min-w-[60px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={onZoomIn}
            className="p-2 hover:bg-secondary/50 transition-colors rounded-r-lg"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={onZoomTo100}
          className="p-2 bg-card/90 backdrop-blur-sm rounded-lg border border-border hover:bg-secondary/50 transition-colors"
          title="Zoom to 100%"
        >
          <Maximize className="w-4 h-4" />
        </button>
        <button
          onClick={onResetView}
          className="p-2 bg-card/90 backdrop-blur-sm rounded-lg border border-border hover:bg-secondary/50 transition-colors"
          title="Reset View"
        >
          <Move className="w-4 h-4" />
        </button>
      </div>

      {/* Canvas Content */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
          transformOrigin: 'center center',
        }}
      >
        {/* Glow Effect */}
        {glowEnabled && (
          <div 
            className="absolute rounded-full blur-3xl opacity-50"
            style={{
              width: state.width * 2,
              height: state.height * 2,
              background: state.useGradient 
                ? `linear-gradient(${state.gradientAngle}deg, ${state.gradientStops.map(s => s.color).join(', ')})`
                : state.solidColor,
            }}
          />
        )}

        {/* Superellipse SVG */}
        <svg
          width={state.width}
          height={state.height}
          viewBox={`0 0 ${state.width} ${state.height}`}
          className="relative z-10"
        >
          <defs>
            <linearGradient
              id={gradientId}
              gradientTransform={`rotate(${state.gradientAngle})`}
            >
              {state.gradientStops.map((stop) => (
                <stop
                  key={stop.id}
                  offset={`${stop.position * 100}%`}
                  stopColor={stop.color}
                />
              ))}
            </linearGradient>
          </defs>
          
          <path
            d={pathData}
            fill={state.useGradient ? `url(#${gradientId})` : state.solidColor}
            stroke={state.hasStroke ? state.strokeColor : 'none'}
            strokeWidth={state.strokeWidth}
            className="drop-shadow-2xl"
          />
        </svg>

        {/* Noise Overlay */}
        {noiseEnabled && (
          <div className="absolute inset-0 noise-overlay pointer-events-none" />
        )}
      </div>

      {/* Canvas Info */}
      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg border border-border px-3 py-2 text-xs font-mono text-muted-foreground">
        {state.width} × {state.height}px • n={state.n.toFixed(2)}
      </div>
    </div>
  );
});

CanvasContainer.displayName = 'CanvasContainer';
