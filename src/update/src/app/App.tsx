import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSuperellipse } from '@/hooks/useSuperellipse';
import { useLayerManager } from '@/hooks/useLayerManager';
import { useCanvasNavigation } from '@/hooks/useCanvasNavigation';
import { usePresets } from '@/hooks/usePresets';
import { useEditor, useGlowEditor, useModals, useNoiseSettings } from '@/context/EditorContext';
import { LayerPanel } from '@/components/generator/LayerPanel';
import { CanvasContainer } from '@/components/generator/CanvasContainer';
import { ControlPanel } from '@/components/generator/ControlPanel';
import { ExportCodeModal } from '@/components/generator/modals/ExportCodeModal';
import { KeyboardShortcutsModal } from '@/components/generator/modals/KeyboardShortcutsModal';
import { Undo2, Redo2, Code2, Keyboard } from 'lucide-react';
import { SuperellipseState } from '@/types/layers';

/**
 * Main Application Component
 * 
 * Manages the entire Superellipse Generator application including:
 * - Shape editing and layer management
 * - Canvas navigation and rendering
 * - Glow effects and animations
 * - Keyboard shortcuts and modals
 * 
 * @version 3.0
 */
export default function App() {
  // ============================================================================
  // Hooks - External State Management
  // ============================================================================
  
  const {
    state,
    updateState,
    updateGradientStop,
    addGradientStop,
    removeGradientStop,
    resetState,
    loadState,
    randomizeGlow,
    pathData,
  } = useSuperellipse();

  const {
    layers,
    selectedLayerId,
    selectedLayer,
    setSelectedLayerId,
    addLayer,
    removeLayer,
    updateLayer,
    duplicateLayer,
    toggleVisibility,
    toggleLock,
    reorderLayers,
    setBlendMode,
    setOpacity,
    updateTransform,
    updateLayerName,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useLayerManager();

  const {
    zoom,
    panX,
    panY,
    isPanning,
    containerRef,
    zoomIn,
    zoomOut,
    resetView,
    zoomTo100,
    handleMouseDown,
    handleMouseMove,
  } = useCanvasNavigation();

  const {
    presets,
    savePreset,
    deletePreset,
    duplicatePreset,
    exportPresets,
    importPresets,
  } = usePresets();

  // ============================================================================
  // Context State - Glow Editor (from EditorContext)
  // ============================================================================
  // These settings are now centralized in EditorContext to eliminate prop drilling

  const {
    glowEnabled,
    maskSize,
    glowScale,
    positionX,
    positionY,
  } = useGlowEditor();

  // Also access noise settings from context
  const {
    noiseEnabled,
    noiseIntensity,
  } = useEditor();

  // ============================================================================
  // Context State - Modals (from EditorContext)
  // ============================================================================
  // Modal states are centralized in EditorContext

  const {
    isExportModalOpen,
    isShortcutsModalOpen,
    setIsExportModalOpen,
    setIsShortcutsModalOpen,
  } = useModals();

  // ============================================================================
  // Event Handlers - Memoized for Performance
  // ============================================================================

  /**
   * Generates a random color and temporarily disables glow effect
   * Uses setTimeout to create smooth transition animation
   */
  const handleRandomColor = useCallback(() => {
    setGlowEnabled(false);
    
    const generateTimer = setTimeout(() => {
      const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
      updateState({ solidColor: randomColor });
      
      const enableTimer = setTimeout(() => {
        setGlowEnabled(true);
      }, 90);
      
      return () => clearTimeout(enableTimer);
    }, 950);
    
    return () => clearTimeout(generateTimer);
  }, [updateState]);

  /**
   * Updates superellipse state and syncs with selected layer
   */
  const handleUpdateState = useCallback(
    (updates: Partial<SuperellipseState>) => {
      updateState(updates);
      
      // Sync with selected layer if it's a shape type
      if (selectedLayerId && selectedLayer?.type === 'shape') {
        const currentContent = selectedLayer.content?.superellipseState || state;
        updateLayer(selectedLayerId, {
          content: {
            ...selectedLayer.content,
            superellipseState: { ...currentContent, ...updates },
          },
        });
      }
    },
    [updateState, selectedLayerId, selectedLayer, state, updateLayer]
  );

  /**
   * Updates a gradient stop and syncs with selected layer
   */
  const handleUpdateGradientStop = useCallback(
    (id: string, updates: Partial<{ color: string; position: number }>) => {
      updateGradientStop(id, updates);
      
      if (
        selectedLayerId &&
        selectedLayer?.type === 'shape' &&
        selectedLayer.content?.superellipseState
      ) {
        const updatedStops = selectedLayer.content.superellipseState.gradientStops.map((stop) =>
          stop.id === id ? { ...stop, ...updates } : stop
        );
        
        updateLayer(selectedLayerId, {
          content: {
            ...selectedLayer.content,
            superellipseState: {
              ...selectedLayer.content.superellipseState,
              gradientStops: updatedStops,
            },
          },
        });
      }
    },
    [updateGradientStop, selectedLayerId, selectedLayer, updateLayer]
  );

  /**
   * Adds a new gradient stop and syncs with selected layer
   */
  const handleAddGradientStop = useCallback(
    (color: string, position: number) => {
      addGradientStop(color, position);
      
      if (
        selectedLayerId &&
        selectedLayer?.type === 'shape' &&
        selectedLayer.content?.superellipseState
      ) {
        const newStop = {
          id: Date.now().toString(),
          color,
          position,
        };
        
        const updatedStops = [
          ...selectedLayer.content.superellipseState.gradientStops,
          newStop,
        ].sort((a, b) => a.position - b.position);
        
        updateLayer(selectedLayerId, {
          content: {
            ...selectedLayer.content,
            superellipseState: {
              ...selectedLayer.content.superellipseState,
              gradientStops: updatedStops,
            },
          },
        });
      }
    },
    [addGradientStop, selectedLayerId, selectedLayer, updateLayer]
  );

  /**
   * Removes a gradient stop and syncs with selected layer
   */
  const handleRemoveGradientStop = useCallback(
    (id: string) => {
      removeGradientStop(id);
      
      if (
        selectedLayerId &&
        selectedLayer?.type === 'shape' &&
        selectedLayer.content?.superellipseState
      ) {
        const updatedStops = selectedLayer.content.superellipseState.gradientStops.filter(
          (stop) => stop.id !== id
        );
        
        updateLayer(selectedLayerId, {
          content: {
            ...selectedLayer.content,
            superellipseState: {
              ...selectedLayer.content.superellipseState,
              gradientStops: updatedStops,
            },
          },
        });
      }
    },
    [removeGradientStop, selectedLayerId, selectedLayer, updateLayer]
  );

  /**
   * Handles adding a new shape layer
   */
  const handleAddLayer = useCallback(() => {
    addLayer('shape');
  }, [addLayer]);

  /**
   * Opens export modal
   */
  const handleOpenExportModal = useCallback(() => {
    setIsExportModalOpen(true);
  }, []);

  /**
   * Closes export modal
   */
  const handleCloseExportModal = useCallback(() => {
    setIsExportModalOpen(false);
  }, []);

  /**
   * Opens shortcuts modal
   */
  const handleOpenShortcutsModal = useCallback(() => {
    setIsShortcutsModalOpen(true);
  }, []);

  /**
   * Closes shortcuts modal
   */
  const handleCloseShortcutsModal = useCallback(() => {
    setIsShortcutsModalOpen(false);
  }, []);

  // ============================================================================
  // Effects
  // ============================================================================

  /**
   * Syncs global superellipse state with selected layer's state
   * Loads layer's state when selection changes
   */
  useEffect(() => {
    if (selectedLayer?.type === 'shape' && selectedLayer.content?.superellipseState) {
      loadState(selectedLayer.content.superellipseState);
    }
  }, [selectedLayerId, selectedLayer, loadState]);

  /**
   * Global keyboard shortcuts handler
   * Manages undo/redo, export, zoom, and layer operations
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isModifier = e.ctrlKey || e.metaKey;

      // Undo
      if (isModifier && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }

      // Redo
      if (isModifier && (e.key === 'Z' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault();
        redo();
        return;
      }

      // Export
      if (isModifier && e.key === 'e') {
        e.preventDefault();
        setIsExportModalOpen(true);
        return;
      }

      // Shortcuts modal
      if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsModalOpen(true);
        return;
      }

      // Reset view (Zoom to fit)
      if (isModifier && e.key === '0') {
        e.preventDefault();
        resetView();
        return;
      }

      // Zoom to 100%
      if (isModifier && e.key === '1') {
        e.preventDefault();
        zoomTo100();
        return;
      }

      // Zoom in
      if (isModifier && e.key === '+') {
        e.preventDefault();
        zoomIn();
        return;
      }

      // Zoom out
      if (isModifier && e.key === '-') {
        e.preventDefault();
        zoomOut();
        return;
      }

      // Delete layer
      if (e.key === 'Delete' && selectedLayerId) {
        e.preventDefault();
        removeLayer(selectedLayerId);
        return;
      }

      // Duplicate layer
      if (isModifier && e.key === 'd' && selectedLayerId) {
        e.preventDefault();
        duplicateLayer(selectedLayerId);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    undo,
    redo,
    resetView,
    zoomTo100,
    zoomIn,
    zoomOut,
    selectedLayerId,
    removeLayer,
    duplicateLayer,
  ]);

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className="h-screen bg-neutral-950 text-white flex flex-col">
      {/* Top Bar */}
      <header className="h-14 border-b border-neutral-800 flex items-center justify-between px-6 bg-neutral-900">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Superellipse Generator Pro
          </h1>
          <span className="text-xs text-neutral-500 font-mono" aria-label="Version">
            v3.0
          </span>
        </div>

        <nav className="flex items-center gap-2" aria-label="Main navigation">
          {/* History Controls */}
          <button
            onClick={undo}
            disabled={!canUndo}
            className="p-2 hover:bg-neutral-800 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Undo (Ctrl+Z)"
            aria-label="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          
          <button
            onClick={redo}
            disabled={!canRedo}
            className="p-2 hover:bg-neutral-800 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Redo (Ctrl+Shift+Z)"
            aria-label="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-neutral-700 mx-2" role="separator" />

          {/* Action Buttons */}
          <button
            onClick={handleOpenExportModal}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded transition-colors text-sm flex items-center gap-2"
            title="Export Code (Ctrl+E)"
            aria-label="Export code"
          >
            <Code2 className="w-4 h-4" />
            Export
          </button>

          <button
            onClick={handleOpenShortcutsModal}
            className="p-2 hover:bg-neutral-800 rounded transition-colors"
            title="Keyboard Shortcuts (?)"
            aria-label="Show keyboard shortcuts"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-neutral-700 mx-2" role="separator" />

          <button
            onClick={resetState}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded transition-colors text-sm"
            aria-label="Reset to default state"
          >
            Reset
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel: Layers */}
        <aside className="w-64" aria-label="Layer panel">
          <LayerPanel
            layers={layers}
            selectedLayerId={selectedLayerId}
            onSelectLayer={setSelectedLayerId}
            onAddLayer={handleAddLayer}
            onRemoveLayer={removeLayer}
            onDuplicateLayer={duplicateLayer}
            onToggleVisibility={toggleVisibility}
            onToggleLock={toggleLock}
            onSetBlendMode={setBlendMode}
            onSetOpacity={setOpacity}
            onReorderLayers={reorderLayers}
          />
        </aside>

        {/* Center: Canvas */}
        <section className="flex-1" aria-label="Canvas">
          <CanvasContainer
            state={state}
            pathData={pathData}
            layers={layers}
            selectedLayerId={selectedLayerId}
            zoom={zoom}
            panX={panX}
            panY={panY}
            isPanning={isPanning}
            containerRef={containerRef}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onResetView={resetView}
            onZoomTo100={zoomTo100}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onTransformUpdate={updateTransform}
            glowEnabled={glowEnabled}
            maskSize={maskSize}
            glowScale={glowScale}
            positionX={positionX}
            positionY={positionY}
            noiseEnabled={noiseEnabled}
            noiseIntensity={noiseIntensity}
            onRandomColor={handleRandomColor}
          />
        </section>

        {/* Right Panel: Controls */}
        <aside className="w-80" aria-label="Control panel">
          <ControlPanel
            state={state}
            pathData={pathData}
            presets={presets}
            selectedLayer={selectedLayer}
            onUpdateState={handleUpdateState}
            onUpdateGradientStop={handleUpdateGradientStop}
            onAddGradientStop={handleAddGradientStop}
            onRemoveGradientStop={handleRemoveGradientStop}
            onRandomizeGlow={randomizeGlow}
            onSavePreset={savePreset}
            onLoadPreset={loadState}
            onDeletePreset={deletePreset}
            onDuplicatePreset={duplicatePreset}
            onExportPresets={exportPresets}
            onImportPresets={importPresets}
            onUpdateTransform={updateTransform}
            glowEnabled={glowEnabled}
            setGlowEnabled={setGlowEnabled}
            maskSize={maskSize}
            setMaskSize={setMaskSize}
            glowScale={glowScale}
            setGlowScale={setGlowScale}
            positionX={positionX}
            setPositionX={setPositionX}
            positionY={positionY}
            setPositionY={setPositionY}
            noiseEnabled={noiseEnabled}
            setNoiseEnabled={setNoiseEnabled}
            noiseIntensity={noiseIntensity}
            setNoiseIntensity={setNoiseIntensity}
            animationEnabled={animationEnabled}
            setAnimationEnabled={setAnimationEnabled}
            animationType={animationType}
            setAnimationType={setAnimationType}
            animationSpeed={animationSpeed}
            setAnimationSpeed={setAnimationSpeed}
            globalScale={globalScale}
            setGlobalScale={setGlobalScale}
            gradientMaskIntensity={gradientMaskIntensity}
            setGradientMaskIntensity={setGradientMaskIntensity}
            sceneNoiseOverlay={sceneNoiseOverlay}
            setSceneNoiseOverlay={setSceneNoiseOverlay}
          />
        </aside>
      </main>

      {/* Modals */}
      <ExportCodeModal
        isOpen={isExportModalOpen}
        onClose={handleCloseExportModal}
        state={state}
        pathData={pathData}
      />

      <KeyboardShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={handleCloseShortcutsModal}
      />
    </div>
  );
}
