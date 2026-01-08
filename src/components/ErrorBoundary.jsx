import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-800 rounded-lg p-6">
                        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
                            Algo deu errado
                        </h1>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            Ocorreu um erro ao carregar a aplicação. Por favor, recarregue a página.
                        </p>
                        <details className="mb-4">
                            <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 mb-2">
                                Detalhes do erro
                            </summary>
                            <pre className="text-xs bg-gray-100 dark:bg-zinc-800 p-2 rounded overflow-auto">
                                {this.state.error?.toString()}
                            </pre>
                        </details>
                        <button
                            onClick={() => {
                                window.location.reload();
                            }}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                            Recarregar Página
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
