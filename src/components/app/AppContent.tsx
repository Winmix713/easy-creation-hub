import React, { memo } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { TopBar } from './TopBar';
import { LayerPanel } from '@/components/generator/LayerPanel';
import { CanvasContainer } from '@/components/generator/CanvasContainer';
import { ControlPanel } from '@/components/generator/ControlPanel';
import { ExportCodeModal } from '@/components/generator/modals/ExportCodeModal';
import { KeyboardShortcutsModal } from '@/components/generator/modals/KeyboardShortcutsModal';

/**
 * Main Application Content
 * Renders the three-panel layout with modals
 */
export const AppContent: React.FC = memo(() => {
  const { superellipse, layers, canvas, glow, modals } = useAppContext();

  return (
    <div className="h-screen bg-background text-foreground flex flex-col">
      <TopBar />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Layers */}
        <LayerPanel />

        {/* Center: Canvas */}
        <CanvasContainer
          state={superellipse.state}
          pathData={superellipse.pathData}
          layers={layers.items}
          selectedLayerId={layers.selectedId}
          zoom={canvas.zoom}
          panX={canvas.panX}
          panY={canvas.panY}
          isPanning={canvas.isPanning}
          containerRef={canvas.containerRef}
          onZoomIn={canvas.zoomIn}
          onZoomOut={canvas.zoomOut}
          onResetView={canvas.resetView}
          onZoomTo100={canvas.zoomTo100}
          onMouseDown={canvas.handleMouseDown}
          onMouseMove={canvas.handleMouseMove}
          onTransformUpdate={layers.updateTransform}
          glowEnabled={glow.enabled}
          maskSize={glow.maskSize}
          glowScale={glow.scale}
          positionX={glow.positionX}
          positionY={glow.positionY}
          noiseEnabled={glow.noiseEnabled}
          noiseIntensity={glow.noiseIntensity}
          onRandomColor={glow.randomizeColor}
        />

        {/* Right Panel: Controls */}
        <ControlPanel />
      </div>

      {/* Modals */}
      <ExportCodeModal
        isOpen={modals.export.isOpen}
        onClose={modals.export.close}
        state={superellipse.state}
        pathData={superellipse.pathData}
      />

      <KeyboardShortcutsModal
        isOpen={modals.shortcuts.isOpen}
        onClose={modals.shortcuts.close}
      />
    </div>
  );
});

AppContent.displayName = 'AppContent';
