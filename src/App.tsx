import { AppProvider } from '@/contexts/AppContext';
import { AppContent } from '@/components/app/AppContent';
import { KeyboardShortcuts } from '@/components/app/KeyboardShortcuts';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

/**
 * Main Application Component
 * 
 * Responsibilities:
 * - Provide global context
 * - Setup error boundary
 * - Initialize keyboard shortcuts
 * 
 * All business logic is delegated to context providers and child components
 */
export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <KeyboardShortcuts />
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
