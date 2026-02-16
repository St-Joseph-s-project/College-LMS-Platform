import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="p-10 border-4 border-red-500 bg-red-50 m-10">
                    <h1 className="text-3xl font-bold text-red-700 mb-4">Something went wrong.</h1>
                    <p className="font-mono bg-white p-4 border rounded text-red-600">
                        {this.state.error?.toString()}
                    </p>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
