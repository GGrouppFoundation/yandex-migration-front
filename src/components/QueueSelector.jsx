import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';

const QueueSelector = ({
    queues,
    selectedQueues,
    loading,
    error,
    onToggleQueue,
    onSelectAll
}) => {
    const { t } = useTranslation();
    const allSelected = queues.length > 0 && queues.length === selectedQueues.length;

    return (
        <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">
                    {t('queueSelector.label')} {loading && <Loader2 className="w-4 h-4 animate-spin inline ml-2" />}
                </label>
                {queues.length > 0 && !loading && (
                    <button
                        onClick={onSelectAll}
                        className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        {allSelected ? t('queueSelector.deselectAll') : t('queueSelector.selectAll')}
                    </button>
                )}
            </div>

            <div className="border border-gray-300 rounded-md p-3 max-h-60 overflow-y-auto bg-gray-50 min-h-[50px]">
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                    </div>
                ) : error ? (
                    <p className="text-red-500 text-sm text-center py-2">{t('queueSelector.error', { details: error })}</p>
                ) : queues.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-2">
                        {t('queueSelector.noQueues')}
                    </p>
                ) : (
                    queues.map(queue => (
                        <label
                            key={queue.id}
                            className="flex items-center gap-2 py-1.5 cursor-pointer hover:bg-gray-200 px-2 rounded transition-colors"
                        >
                            <input
                                type="checkbox"
                                checked={selectedQueues.includes(queue.id)}
                                onChange={() => onToggleQueue(queue.id)}
                                className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                            />
                            <span className="text-sm text-gray-700">
                                {queue.name} ({queue.key})
                            </span>
                        </label>
                    ))
                )}
            </div>

            {selectedQueues.length > 0 && (
                <p className="text-xs text-gray-600 mt-1">
                    {t('queueSelector.queuesSelected', { count: selectedQueues.length })}
                </p>
            )}
        </div>
    );
};

export default QueueSelector;