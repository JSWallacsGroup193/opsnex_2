import React from 'react';
import { ErrorPage } from './error/ErrorPage';

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { error?: Error }> {
  constructor(props: any) { 
    super(props); 
    this.state = {}; 
  }
  
  static getDerivedStateFromError(error: Error) { 
    return { error }; 
  }
  
  componentDidCatch(error: Error) { 
    console.error('ErrorBoundary caught:', error); 
  }

  resetError = () => {
    this.setState({ error: undefined });
  }
  
  render() {
    if (this.state.error) {
      return (
        <ErrorPage
          errorCode={500}
          onRetry={this.resetError}
          errorDetails={{
            code: this.state.error.name,
            timestamp: new Date().toISOString(),
            requestId: `ERR-${Date.now()}`,
            stackTrace: this.state.error.stack,
          }}
          isAdmin={false}
        />
      );
    }
    return this.props.children;
  }
}
