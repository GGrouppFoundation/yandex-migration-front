import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LoadingSpinner = ({
    size = 'default',
    className = '',
    textKey = null
}) => {
    const { t } = useTranslation();
    const sizeClasses = {
        small: 'w-4 h-4',
        default: 'w-8 h-8',
        large: 'w-12 h-12'
    };

    const displayText = t(textKey);

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div className="text-center">
                <Loader2 className={`${sizeClasses[size]} animate-spin mx-auto text-blue-600`} />
                {displayText && <p className="text-gray-600 mt-2">{displayText}</p>}
            </div>
        </div>
    );
};

export default LoadingSpinner;