import { useState, useCallback } from 'react';

/**
 * Hook for managing modal states
 */
export const useModals = () => {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  return {
    export: {
      isOpen: isExportOpen,
      open: useCallback(() => setIsExportOpen(true), []),
      close: useCallback(() => setIsExportOpen(false), []),
    },
    shortcuts: {
      isOpen: isShortcutsOpen,
      open: useCallback(() => setIsShortcutsOpen(true), []),
      close: useCallback(() => setIsShortcutsOpen(false), []),
    },
  };
};
