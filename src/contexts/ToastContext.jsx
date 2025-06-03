import { createContext, useContext, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

const TOAST_DURATIONS = {
    success: 10000,
    error: 15000,
    warning: 10000,
    info: 5000
};

const ToastItem = ({ toast, onRemove }) => {
    const { t } = useTranslation();

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-500" />,
        error: <AlertCircle className="w-5 h-5 text-red-500" />,
        warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />
    };

    const bgColors = {
        success: 'bg-green-50 border-green-200',
        error: 'bg-red-50 border-red-200',
        warning: 'bg-yellow-50 border-yellow-200',
        info: 'bg-blue-50 border-blue-200'
    };

    return (
        <div className={`flex items-start gap-3 p-4 rounded-lg border ${bgColors[toast.type]} shadow-lg transform transition-all duration-300 ease-in-out animate-slide-in max-w-md`}>
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 break-words">{toast.message}</p>
                {toast.type === 'error' && TOAST_DURATIONS.error > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                        {t('toast.errorAutoDismiss', { seconds: TOAST_DURATIONS.error / 1000 })}
                    </p>
                )}
            </div>
            <button
                onClick={() => onRemove(toast.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                aria-label={t('toast.dismissNotificationAria')}
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', customDuration = null) => {
        const id = Date.now() + Math.random();
        const duration = customDuration !== null ? customDuration : TOAST_DURATIONS[type];
        const toast = { id, message, type };

        setToasts(prev => [...prev, toast]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }

        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const clearAllToasts = useCallback(() => {
        setToasts([]);
    }, []);

    const toast = {
        success: (message, duration) => addToast(message, 'success', duration),
        error: (message, duration) => addToast(message, 'error', duration),
        warning: (message, duration) => addToast(message, 'warning', duration),
        info: (message, duration) => addToast(message, 'info', duration),
        warn: (message, duration) => addToast(message, 'warning', duration),
        clear: clearAllToasts
    };

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full pointer-events-none">
                <div className="space-y-2 pointer-events-auto">
                    {toasts.map(toastItem => (
                        <ToastItem
                            key={toastItem.id}
                            toast={toastItem}
                            onRemove={removeToast}
                        />
                    ))}
                </div>
            </div>
        </ToastContext.Provider>
    );
};