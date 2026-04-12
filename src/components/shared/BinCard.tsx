
import { Bin } from '../../types';
import { LocationMarkerIcon } from './Icons';

interface BinCardProps {
    bin: Bin;
    onClick: () => void;
}

const BinCard = ({ bin, onClick }: BinCardProps) => {
    const fillPercentage = (bin.current_count / bin.capacity) * 100;

    let progressBarColor = 'bg-green-500';
    if (fillPercentage > 80) {
        progressBarColor = 'bg-red-500';
    } else if (fillPercentage > 50) {
        progressBarColor = 'bg-yellow-400';
    }

    let statusColor = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    let statusText = bin.status.replace('-', ' ');
    if (bin.status === 'awaiting-pickup') {
      statusColor = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }

    return (
        <div 
            onClick={onClick}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 border dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
        >
            <div>
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-1">{bin.name}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${statusColor}`}>
                        {statusText}
                    </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mb-4">
                    <LocationMarkerIcon className="w-4 h-4 mr-1.5" />
                    {bin.location}
                </p>
            </div>
            <div>
                <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300 mb-1">
                    <span>Fill Level</span>
                    <span>{bin.current_count} / {bin.capacity}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                    <div className={`${progressBarColor} h-2.5 rounded-full`} style={{ width: `${fillPercentage}%` }}></div>
                </div>
            </div>
        </div>
    );
};

export default BinCard;