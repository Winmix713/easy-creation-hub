import { useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';

/**
 * Keyboard Shortcuts Handler
 * Centralized keyboard event management
 */
export const KeyboardShortcuts: React.FC = () => {
  const { history, canvas, layers, modals } = useAppContext();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      // Undo
      if (isCtrlOrCmd && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        history.undo();
        return;
      }

      // Redo
      if (isCtrlOrCmd && (e.key === 'Z' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault();
        history.redo();
        return;
      }

      // Export
      if (isCtrlOrCmd && e.key === 'e') {
        e.preventDefault();
        modals.export.open();
        return;
      }

      // Shortcuts modal
      if (e.key === '?') {
        e.preventDefault();
        modals.shortcuts.open();
        return;
      }

      // Reset view (Zoom to fit)
      if (isCtrlOrCmd && e.key === '0') {
        e.preventDefault();
        canvas.resetView();
        return;
      }

      // Zoom to 100%
      if (isCtrlOrCmd && e.key === '1') {
        e.preventDefault();
        canvas.zoomTo100();
        return;
      }

      // Zoom in
      if (isCtrlOrCmd && e.key === '+') {
        e.preventDefault();
        canvas.zoomIn();
        return;
      }

      // Zoom out
      if (isCtrlOrCmd && e.key === '-') {
        e.preventDefault();
        canvas.zoomOut();
        return;
      }

      // Delete layer
      if (e.key === 'Delete' && layers.selectedId) {
        e.preventDefault();
        layers.remove(layers.selectedId);
        return;
      }

      // Duplicate layer
      if (isCtrlOrCmd && e.key === 'd' && layers.selectedId) {
        e.preventDefault();
        layers.duplicate(layers.selectedId);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [history, canvas, layers, modals]);

  return null;
};
