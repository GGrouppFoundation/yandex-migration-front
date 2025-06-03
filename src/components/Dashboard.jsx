import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LogOut, Download, Upload, ArrowLeft } from 'lucide-react';
import ExportSection from './ExportSection.jsx';
import ImportSection from './ImportSection.jsx';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={() => changeLanguage('en')}
                disabled={i18n.language === 'en'}
                className={`px-3 py-1 text-sm rounded-md font-medium transition-colors
                            ${i18n.language === 'en'
                        ? 'bg-blue-600 text-white cursor-default'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50'
                    }`}
            >
                EN
            </button>
            <button
                onClick={() => changeLanguage('ru')}
                disabled={i18n.language === 'ru'}
                className={`px-3 py-1 text-sm rounded-md font-medium transition-colors
                            ${i18n.language === 'ru'
                        ? 'bg-blue-600 text-white cursor-default'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50'
                    }`}
            >
                RU
            </button>
        </div>
    );
};

const Dashboard = ({ user, onLogout }) => {
    const [currentFlow, setCurrentFlow] = useState(null);
    const { t } = useTranslation();

    const handleLogout = () => {
        onLogout();
    };

    const FlowSelector = () => (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {t('dashboard.whatToDo')}
                </h2>
                <p className="text-lg text-gray-600">
                    {t('dashboard.chooseAction')}
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div
                    onClick={() => setCurrentFlow('export')}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-200 hover:border-blue-300"
                >
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Download className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                            {t('dashboard.exportConfigTitle')}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {t('dashboard.exportConfigDescription')}
                        </p>
                        <div className="bg-blue-50 rounded-lg p-4">
                            <ul className="text-sm text-blue-800 space-y-2">
                                <li>• {t('dashboard.exportFeature1')}</li>
                                <li>• {t('dashboard.exportFeature2')}</li>
                                <li>• {t('dashboard.exportFeature3')}</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div
                    onClick={() => setCurrentFlow('import')}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-200 hover:border-green-300"
                >
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Upload className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                            {t('dashboard.importConfigTitle')}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {t('dashboard.importConfigDescription')}
                        </p>
                        <div className="bg-green-50 rounded-lg p-4">
                            <ul className="text-sm text-green-800 space-y-2">
                                <li>• {t('dashboard.importFeature1')}</li>
                                <li>• {t('dashboard.importFeature2')}</li>
                                <li>• {t('dashboard.importFeature3')}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const FlowHeader = ({ titleKey, onBack }) => (
        <div className="mb-8">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
            >
                <ArrowLeft className="w-4 h-4" />
                {t('dashboard.backToMainMenu')}
            </button>
            <h2 className="text-2xl font-bold text-gray-900">{t(titleKey)}</h2>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-xl font-semibold text-gray-900">
                            {t('appName')}
                        </h1>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">{t('dashboard.welcomeUser', { name: user.name })}</span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 rounded-md hover:bg-gray-100"
                            >
                                <LogOut className="w-4 h-4" />
                                {t('dashboard.logout')}
                            </button>
                            <LanguageSwitcher />
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {!currentFlow && <FlowSelector />}

                {currentFlow === 'export' && (
                    <>
                        <FlowHeader
                            titleKey="dashboard.exportConfigTitle"
                            onBack={() => setCurrentFlow(null)}
                        />
                        <ExportSection />
                    </>
                )}

                {currentFlow === 'import' && (
                    <>
                        <FlowHeader
                            titleKey="dashboard.importConfigTitle"
                            onBack={() => setCurrentFlow(null)}
                        />
                        <ImportSection />
                    </>
                )}
            </main>
        </div>
    );
};

export default Dashboard;