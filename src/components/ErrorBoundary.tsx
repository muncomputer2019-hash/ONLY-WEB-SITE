import React from 'react';
import { Link } from 'react-router-dom';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    let displayMsg = error.message || 'An unexpected application error occurred.';
    try {
      const parsed = JSON.parse(error.message) as { error?: string; path?: string };
      if (parsed && parsed.error) {
        displayMsg = `${parsed.error}${parsed.path ? ` (${parsed.path})` : ''}`;
      }
    } catch {
      // keep raw message
    }
    return { hasError: true, message: displayMsg };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('Application ErrorBoundary:', error, info.componentStack);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white text-slate-950 flex items-center justify-center px-4">
          <div className="max-w-lg w-full border border-slate-200 rounded-xl p-8 bg-white">
            <p className="text-xs font-medium text-slate-500 mb-2">MUN COMPUTER</p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 mb-3">
              Unable to complete this view
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">{this.state.message}</p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-4 py-2.5 text-sm font-medium bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors cursor-pointer"
              >
                Reload Page
              </button>
              <Link
                to="/"
                onClick={() => this.setState({ hasError: false, message: '' })}
                className="px-4 py-2.5 text-sm font-medium border border-slate-300 text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
