import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { useToast } from '../contexts/ToastContext.jsx';
import { authService } from '../services/auth.js';

const LoginScreen = ({ onLogin }) => {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const { t } = useTranslation();

    useEffect(() => {
        const hash = window.location.hash;
        if (hash.includes('access_token=')) {
            const token = hash.split('access_token=')[1].split('&')[0];
            handleTokenExchange(token);
            window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
        }
    });

    const handleTokenExchange = async (token) => {
        setLoading(true);
        try {
            const user = await authService.exchangeTokenForIAM(token);
            toast.success(t('login.welcome', { name: user.name }));
            onLogin(user);
        } catch (error) {
            const errorMessage = error.message || 'Unknown error';
            if (errorMessage.includes('HTTP') || errorMessage.toLowerCase().includes('failed to fetch')) {
                toast.error(t('login.authFailedGeneric'));
            } else {
                toast.error(t('login.authFailed', { details: errorMessage }));
            }
            console.error("Authentication error details:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = () => {
        window.location.href = authService.getYandexAuthUrl();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                    <p className="text-gray-600">{t('authenticating')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl font-bold text-center mb-6">{t('login.title')}</h1>
                <p className="text-gray-600 text-center mb-6">{t('login.prompt')}</p>
                <button
                    onClick={handleLogin}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                    {t('login.button')}
                </button>
            </div>
        </div>
    );
};

export default LoginScreen;