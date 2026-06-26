import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, errorMessage: "" };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Uncaught render error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-br from-[#F4F7FF] to-[#E9F0FE] px-6 font-poppins text-center">
          <h1 className="text-2xl font-bold text-[#0F172A]">Something went wrong</h1>
          <p className="max-w-sm text-[15px] text-[#64748B]">
            An unexpected error occurred. Please refresh the page or contact support if this
            keeps happening.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-[#1D4ED8] px-6 py-2.5 text-[15px] font-semibold text-white transition hover:bg-[#1A45BE]"
          >
            Refresh page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
