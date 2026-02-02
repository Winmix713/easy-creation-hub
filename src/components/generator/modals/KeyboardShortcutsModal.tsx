import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Shortcut {
  keys: string[];
  description: string;
  category: string;
}

const shortcuts: Shortcut[] = [
  // General
  { keys: ['Ctrl', 'Z'], description: 'Undo', category: 'General' },
  { keys: ['Ctrl', 'Shift', 'Z'], description: 'Redo', category: 'General' },
  { keys: ['Ctrl', 'S'], description: 'Save Preset', category: 'General' },
  { keys: ['Ctrl', 'E'], description: 'Export', category: 'General' },
  
  // Canvas Navigation
  { keys: ['Space', 'Drag'], description: 'Pan Canvas', category: 'Navigation' },
  { keys: ['Ctrl', 'Scroll'], description: 'Zoom In/Out', category: 'Navigation' },
  { keys: ['Ctrl', '0'], description: 'Fit to View', category: 'Navigation' },
  { keys: ['Ctrl', '1'], description: 'Zoom to 100%', category: 'Navigation' },
  { keys: ['Ctrl', '+'], description: 'Zoom In', category: 'Navigation' },
  { keys: ['Ctrl', '-'], description: 'Zoom Out', category: 'Navigation' },
  
  // Layer Management
  { keys: ['Delete'], description: 'Delete Selected Layer', category: 'Layers' },
  { keys: ['Ctrl', 'D'], description: 'Duplicate Layer', category: 'Layers' },
  { keys: ['Ctrl', 'G'], description: 'Group Layers', category: 'Layers' },
  { keys: ['Ctrl', 'Shift', 'G'], description: 'Ungroup', category: 'Layers' },
  { keys: ['['], description: 'Move Layer Back', category: 'Layers' },
  { keys: [']'], description: 'Move Layer Forward', category: 'Layers' },
];

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  if (!isOpen) return null;

  const categories = Array.from(new Set(shortcuts.map((s) => s.category)));

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-800 w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
          <div>
            <h2 className="text-2xl font-bold text-white">Keyboard Shortcuts</h2>
            <p className="text-sm text-neutral-400 mt-1">Speed up your workflow with these shortcuts</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {categories.map((category) => (
            <div key={category}>
              <h3 className="text-lg font-semibold text-white mb-3">{category}</h3>
              <div className="space-y-2">
                {shortcuts
                  .filter((s) => s.category === category)
                  .map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg hover:bg-neutral-800 transition-colors"
                    >
                      <span className="text-neutral-300">{shortcut.description}</span>
                      <div className="flex gap-1">
                        {shortcut.keys.map((key, keyIndex) => (
                          <span key={keyIndex} className="flex items-center gap-1">
                            <kbd className="px-2 py-1 bg-neutral-700 text-white rounded text-xs font-mono border border-neutral-600 shadow-sm min-w-[2rem] text-center">
                              {key}
                            </kbd>
                            {keyIndex < shortcut.keys.length - 1 && (
                              <span className="text-neutral-500 text-xs">+</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-800 bg-neutral-900/50">
          <p className="text-xs text-neutral-500 text-center">
            Use <kbd className="px-1.5 py-0.5 bg-neutral-700 rounded text-neutral-300">?</kbd> to toggle
            this modal
          </p>
        </div>
      </div>
    </div>
  );
}
