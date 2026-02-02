import React, { memo, useCallback } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Undo2, Redo2, Code2, Keyboard, RotateCcw } from 'lucide-react';

/**
 * Top Bar Component
 * Contains app title, history controls, and action buttons
 */
export const TopBar: React.FC = memo(() => {
  const { history, superellipse, modals } = useAppContext();

  const handleExportClick = useCallback(() => {
    modals.export.open();
  }, [modals.export]);

  const handleShortcutsClick = useCallback(() => {
    modals.shortcuts.open();
  }, [modals.shortcuts]);

  return (
    <div className="h-14 border-b border-border flex items-center justify-between px-6 bg-card">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-gradient-primary">
          Superellipse Generator Pro
        </h1>
        <span className="text-xs text-muted-foreground font-mono">v3.0</span>
      </div>

      <div className="flex items-center gap-2">
        {/* History Controls */}
        <button
          onClick={history.undo}
          disabled={!history.canUndo}
          className="p-2 hover:bg-secondary rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Undo (Ctrl+Z)"
          aria-label="Undo"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          onClick={history.redo}
          disabled={!history.canRedo}
          className="p-2 hover:bg-secondary rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Redo (Ctrl+Shift+Z)"
          aria-label="Redo"
        >
          <Redo2 className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-border mx-2" />

        {/* Action Buttons */}
        <button
          onClick={handleExportClick}
          className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded transition-colors text-sm flex items-center gap-2"
          title="Export Code (Ctrl+E)"
          aria-label="Export code"
        >
          <Code2 className="w-4 h-4" />
          Export
        </button>

        <button
          onClick={handleShortcutsClick}
          className="p-2 hover:bg-secondary rounded transition-colors"
          title="Keyboard Shortcuts (?)"
          aria-label="Show keyboard shortcuts"
        >
          <Keyboard className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-border mx-2" />

        <button
          onClick={superellipse.resetState}
          className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded transition-colors text-sm flex items-center gap-2"
          aria-label="Reset to default state"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>
    </div>
  );
});

TopBar.displayName = 'TopBar';
