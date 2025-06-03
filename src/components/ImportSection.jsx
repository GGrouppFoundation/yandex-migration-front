import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Loader2, FileText, AlertCircle } from 'lucide-react';
import { useToast } from '../contexts/ToastContext.jsx';
import { useOrganizations } from '../hooks/useOrganizations.js';
import { apiService } from '../services/api.js';
import { validateZipFile } from '../utils/file.js';
import OrganizationSelector from './OrganizationSelector.jsx';

const ImportSection = () => {
    const [selectedOrg, setSelectedOrg] = useState('');
    const [importFile, setImportFile] = useState(null);
    const [importLoading, setImportLoading] = useState(false);
    const { toast } = useToast();
    const { t } = useTranslation();

    const { organizations, loading: orgsLoading, error: orgsError } = useOrganizations();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && validateZipFile(file)) {
            setImportFile(file);
        } else if (file) {
            toast.warning(t('toast.selectZipFile'));
            setImportFile(null);
            event.target.value = '';
        } else {
            setImportFile(null);
        }
    };

    const handleImport = async () => {
        if (!selectedOrg) {
            toast.warning(t('toast.selectOrgForImport'));
            return;
        }
        if (!importFile) {
            toast.warning(t('toast.selectFile'));
            return;
        }

        setImportLoading(true);
        try {
            const results = await apiService.importConfig(selectedOrg, importFile);
            const successCount = results.filter(r => r.isSuccess).length;
            const failCount = results.length - successCount;

            if (results.length === 0) {
                toast.info(t('toast.importNoConfigsFound'));
            } else if (failCount === 0) {
                toast.success(t('toast.importSuccess', { count: successCount }));
            } else {
                toast.warning(t('toast.importCompleted', { successCount, failCount }));
                results.forEach(r => {
                    if (!r.isSuccess) {
                        const failureReason = r.failureReason || 'Unknown reason';
                        toast.error(t('toast.importFailed', { details: `${r.originalKey || 'Item'}: ${failureReason}` }), 10000);
                    }
                });
            }

            setImportFile(null);
            const fileInput = document.getElementById('import-file-input');
            if (fileInput) fileInput.value = '';
        } catch (error) {
            toast.error(t('toast.importFailed', { details: error.message }));
        } finally {
            setImportLoading(false);
        }
    };

    const isImportDisabled = !importFile || !selectedOrg || importLoading;

    return (
        <div className="space-y-8">
            <OrganizationSelector
                organizations={organizations}
                selectedOrg={selectedOrg}
                onOrgChange={setSelectedOrg}
                loading={orgsLoading}
                error={orgsError}
            />

            {selectedOrg && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{t('importSection.title')}</h3>
                    <p className="text-sm text-gray-600 mb-6">
                        {t('importSection.uploadPrompt')}
                    </p>

                    <div className="space-y-6">
                        <div>
                            <label htmlFor="import-file-input" className="block text-sm font-medium text-gray-700 mb-2">
                                {t('importSection.fileInputLabel')}
                            </label>
                            <div className="flex items-center justify-center w-full">
                                <label
                                    htmlFor="import-file-input"
                                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-3 text-gray-400" />
                                        <p className="mb-2 text-sm text-gray-500">
                                            <span className="font-semibold">{t('importSection.fileDragPrompt')}</span> {t('common.orConjunction')} {t('importSection.fileDropPrompt')}
                                        </p>
                                    </div>
                                    <input
                                        id="import-file-input"
                                        type="file"
                                        accept=".ytexp,application/zip,application/x-zip-compressed"
                                        onChange={handleFileChange}
                                        disabled={importLoading}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            {importFile && (
                                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-green-600" />
                                        <div>
                                            <p className="text-sm font-medium text-green-800">
                                                {importFile.name}
                                            </p>
                                            <p className="text-xs text-green-600">
                                                {(importFile.size / 1024).toFixed(1)} KB
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex gap-3">
                                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-medium text-yellow-800 mb-1">{t('importSection.importantNotesTitle')}</h4>
                                    <ul className="text-sm text-yellow-700 space-y-1">
                                        <li>• {t('importSection.noteOverwrite')}</li>
                                        <li>• {t('importSection.noteBackup')}</li>
                                        <li>• {t('importSection.noteLargeFile')}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="border-t pt-6">
                            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                                <div>
                                    <h4 className="font-medium text-gray-900">{t('importSection.readyToImport')}</h4>
                                    <p className="text-sm text-gray-600">
                                        {importFile
                                            ? t('importSection.fileSelected', { filename: importFile.name })
                                            : t('importSection.noFileSelected')
                                        }
                                    </p>
                                </div>

                                <button
                                    onClick={handleImport}
                                    disabled={isImportDisabled}
                                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-md transition-colors font-medium min-w-[160px]"
                                >
                                    {importLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Upload className="w-5 h-5" />
                                    )}
                                    {importLoading ? t('importSection.importingButton') : t('importSection.importButton')}
                                </button>
                            </div>

                            {(!selectedOrg || !importFile) && !importLoading && (
                                <p className="text-sm text-amber-600 mt-3">
                                    {!selectedOrg ? t('importSection.warningSelectOrg') : t('importSection.warningSelectFile')}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {!selectedOrg && organizations.length > 0 && !orgsLoading && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm">
                        {t('toast.selectOrgForImportTarget')}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ImportSection;