import { useTranslation } from 'react-i18next';

const OrganizationSelector = ({
    organizations,
    selectedOrg,
    onOrgChange,
    loading,
    error
}) => {
    const { t } = useTranslation();

    return (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('organizationSelector.selectOrg')}</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{t('organizationSelector.error', { details: error })}</p>
                </div>
            )}

            <label htmlFor="organization-select" className="block text-sm font-medium text-gray-700 mb-1">
                {t('organizationSelector.label')}
            </label>
            <select
                id="organization-select"
                value={selectedOrg}
                onChange={(e) => onOrgChange(e.target.value)}
                className="w-full max-w-md border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                disabled={loading || (organizations && organizations.length === 0 && !error)}
            >
                <option value="">
                    {loading ? t('organizationSelector.loading') : t('organizationSelector.placeholder')}
                </option>
                {organizations && organizations.map(org => (
                    <option key={org.id} value={org.id}>
                        {org.title}
                    </option>
                ))}
            </select>

            {organizations && organizations.length === 0 && !loading && !error && (
                <p className="text-sm text-gray-500 mt-2">{t('organizationSelector.noOrganizations')}</p>
            )}
        </div>
    );
};

export default OrganizationSelector;