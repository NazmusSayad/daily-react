import { Component, ErrorInfo, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback: ReactNode | ((error: Error, errorInfo: ErrorInfo) => ReactNode)
}

interface ErrorBoundaryState {
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * React error boundary component for catching and displaying errors in the component tree.
 *
 * @example
 * <ErrorBoundary fallback={<div>Something went wrong</div>}>
 *   <App />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { error: null, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    })
  }

  render() {
    const { children, fallback } = this.props
    const { error, errorInfo } = this.state

    if (!error) return children

    if (typeof fallback === 'function') {
      return (fallback as (error: Error, errorInfo: ErrorInfo) => ReactNode)(
        error,
        errorInfo as ErrorInfo
      )
    }

    return fallback
  }
}
