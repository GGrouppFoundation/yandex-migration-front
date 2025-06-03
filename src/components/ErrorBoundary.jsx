import React from 'react';
import { withTranslation } from 'react-i18next';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        const { t } = this.props;

        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-4">
                        <h2 className="text-xl font-semibold text-red-600 mb-4">{t('errorBoundary.title')}</h2>
                        <p className="text-gray-600 mb-4">
                            {t('errorBoundary.message')}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                        >
                            {t('errorBoundary.refreshButton')}
                        </button>
                        {process.env.NODE_ENV === 'development' && (
                            <details className="mt-4">
                                <summary className="text-sm text-gray-500 cursor-pointer">{t('errorBoundary.errorDetails')}</summary>
                                <pre className="text-xs text-red-500 mt-2 overflow-auto">
                                    {this.state.error?.toString()}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default withTranslation()(ErrorBoundary);