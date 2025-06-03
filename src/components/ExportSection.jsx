import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Loader2 } from 'lucide-react';
import { useToast } from '../contexts/ToastContext.jsx';
import { useOrganizations } from '../hooks/useOrganizations.js';
import { useQueues } from '../hooks/useQueues.js';
import { apiService } from '../services/api.js';
import { downloadFile, extractFilename } from '../utils/file.js';
import OrganizationSelector from './OrganizationSelector.jsx';
import QueueSelector from './QueueSelector.jsx';

const ExportSection = () => {
    const [selectedOrg, setSelectedOrg] = useState('');
    const [exportLoading, setExportLoading] = useState(false);
    const { toast } = useToast();
    const { t } = useTranslation();

    const { organizations, loading: orgsLoading, error: orgsError } = useOrganizations();
    const {
        queues,
        selectedQueues,
        loading: queuesLoading,
        error: queuesError,
        toggleQueueSelection,
        selectAllQueues
    } = useQueues(selectedOrg);

    const handleExport = async () => {
        if (!selectedOrg) {
            toast.warning(t('toast.selectOrg'));
            return;
        }
        if (selectedQueues.length === 0) {
            toast.warning(t('toast.selectQueues'));
            return;
        }

        setExportLoading(true);
        try {
            const response = await apiService.exportConfig(selectedOrg, selectedQueues);
            const filename = extractFilename(response.headers);

            if (!filename) {
                toast.error(t('toast.exportFilenameError'));
                setExportLoading(false);
                return;
            }

            const blob = await response.blob();
            downloadFile(blob, filename);
            toast.success(t('toast.exportSuccess', { filename }));
        } catch (error) {
            toast.error(t('toast.exportFailed', { details: error.message }));
        } finally {
            setExportLoading(false);
        }
    };

    const isExportDisabled = !selectedOrg || selectedQueues.length === 0 || exportLoading || queuesLoading;

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
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{t('exportSection.title')}</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        {t('exportSection.selectQueuesPrompt')}
                    </p>

                    <QueueSelector
                        queues={queues}
                        selectedQueues={selectedQueues}
                        loading={queuesLoading}
                        error={queuesError}
                        onToggleQueue={toggleQueueSelection}
                        onSelectAll={selectAllQueues}
                    />

                    <div className="border-t pt-6 mt-6">
                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                            <div>
                                <h4 className="font-medium text-gray-900">{t('exportSection.readyToExport')}</h4>
                                <p className="text-sm text-gray-600">
                                    {selectedQueues.length > 0
                                        ? t('queueSelector.queuesSelected', { count: selectedQueues.length })
                                        : t('exportSection.noQueuesSelected')
                                    }
                                </p>
                            </div>

                            <button
                                onClick={handleExport}
                                disabled={isExportDisabled}
                                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-md transition-colors font-medium min-w-[160px]"
                            >
                                {exportLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Download className="w-5 h-5" />
                                )}
                                {exportLoading ? t('exportSection.exportingButton') : t('exportSection.exportButton')}
                            </button>
                        </div>

                        {selectedQueues.length === 0 && !queuesLoading && queues.length > 0 && (
                            <p className="text-sm text-amber-600 mt-3">
                                {t('exportSection.warningSelectQueue')}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {!selectedOrg && organizations.length > 0 && !orgsLoading && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm">
                        {t('toast.selectOrgToViewQueues')}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ExportSection;