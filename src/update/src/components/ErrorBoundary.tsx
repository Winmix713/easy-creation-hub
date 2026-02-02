import React, { Component, ReactNode, ErrorInfo } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the app.
 * 
 * Only catches errors in child components during rendering, in lifecycle methods,
 * and in constructors. Does not catch errors in:
 * - Event handlers (use try/catch instead)
 * - Asynchronous code (use try/catch in async functions)
 * - Server-side rendering
 * - Errors in the Error Boundary itself
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  /**
   * Update state so the next render will show the fallback UI
   */
  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  /**
   * Log the error to error reporting service
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error('Error caught by boundary:', error);
    console.error('Error info:', errorInfo);

    // Update state with error details for display
    this.setState({
      error,
      errorInfo,
    });

    // TODO: Send error to error tracking service (e.g., Sentry, LogRocket)
    // logErrorToService(error, errorInfo);
  }

  /**
   * Reset error boundary state
   */
  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            {/* Error Icon */}
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-900/20 rounded-full">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>

            {/* Error Title */}
            <h1 className="text-2xl font-bold text-white mb-2 text-center">
              Something went wrong
            </h1>

            {/* Error Description */}
            <p className="text-neutral-400 text-center mb-6">
              The application encountered an unexpected error. Please try refreshing the page or
              resetting your work.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-neutral-800 rounded border border-neutral-700">
                <p className="text-xs font-mono text-red-400 mb-2 font-bold">Error Message:</p>
                <p className="text-xs font-mono text-neutral-300 mb-4 overflow-auto max-h-32">
                  {this.state.error.toString()}
                </p>

                {this.state.errorInfo && (
                  <>
                    <p className="text-xs font-mono text-red-400 mb-2 font-bold">Stack Trace:</p>
                    <pre className="text-xs font-mono text-neutral-300 overflow-auto max-h-48 whitespace-pre-wrap break-words">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={this.resetError}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </button>

              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded font-medium transition-colors"
              >
                Refresh Page
              </button>
            </div>

            {/* Support Text */}
            <p className="text-xs text-neutral-500 mt-6 text-center">
              If this problem persists, please{' '}
              <a href="#" className="text-blue-400 hover:text-blue-300">
                contact support
              </a>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
