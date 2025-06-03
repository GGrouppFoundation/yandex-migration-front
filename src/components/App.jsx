import { useTranslation } from 'react-i18next';
import { ToastProvider, useToast } from '../contexts/ToastContext.jsx';
import { useAuth } from '../hooks/useAuth.js';
import LoginScreen from './LoginScreen.jsx';
import Dashboard from './Dashboard.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';
import LoadingSpinner from './LoadingSpinner.jsx';

const AppContent = () => {
  const { user, loading, login, logout } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    toast.info(t('toast.loggedOut'));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <LoadingSpinner
          size="large"
          textKey="loadingApp"
          className="min-h-screen"
        />
      </div>
    );
  }

  return (
    <>
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <LoginScreen onLogin={login} />
      )}
    </>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ErrorBoundary>
  );
}