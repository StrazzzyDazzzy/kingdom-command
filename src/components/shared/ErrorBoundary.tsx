import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false, error: null };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background">
          <div className="max-w-md w-full rounded-xl border border-destructive/30 bg-card p-8 text-center">
            <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-4" />
            <h1 className="text-xl font-display font-bold mb-2">Something went wrong</h1>
            <p className="text-sm text-muted-foreground mb-6">
              The application encountered an unexpected error. Our team has been notified.
            </p>
            {this.state.error && (
              <pre className="text-left text-xs bg-muted/30 rounded p-3 mb-4 overflow-auto max-h-32">
                {this.state.error.message}
              </pre>
            )}
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => window.location.reload()}>Reload</Button>
              <Button onClick={() => { this.setState({ hasError: false, error: null }); window.history.back(); }}>Go Back</Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
