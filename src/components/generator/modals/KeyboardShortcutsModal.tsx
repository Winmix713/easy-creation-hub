import React, { memo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts = [
  { keys: ['Ctrl', 'Z'], description: 'Undo' },
  { keys: ['Ctrl', 'Shift', 'Z'], description: 'Redo' },
  { keys: ['Ctrl', 'E'], description: 'Export code' },
  { keys: ['Ctrl', '0'], description: 'Reset view' },
  { keys: ['Ctrl', '1'], description: 'Zoom to 100%' },
  { keys: ['Ctrl', '+'], description: 'Zoom in' },
  { keys: ['Ctrl', '-'], description: 'Zoom out' },
  { keys: ['Ctrl', 'D'], description: 'Duplicate layer' },
  { keys: ['Delete'], description: 'Delete selected layer' },
  { keys: ['?'], description: 'Show shortcuts' },
  { keys: ['Alt', 'Drag'], description: 'Pan canvas' },
  { keys: ['Scroll'], description: 'Zoom canvas' },
];

/**
 * Keyboard Shortcuts Modal Component
 */
export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = memo(({
  isOpen,
  onClose,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 mt-4">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <span className="text-sm text-muted-foreground">
                {shortcut.description}
              </span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key, keyIndex) => (
                  <React.Fragment key={keyIndex}>
                    <kbd className="px-2 py-1 bg-secondary rounded text-xs font-mono">
                      {key}
                    </kbd>
                    {keyIndex < shortcut.keys.length - 1 && (
                      <span className="text-muted-foreground">+</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
});

KeyboardShortcutsModal.displayName = 'KeyboardShortcutsModal';
