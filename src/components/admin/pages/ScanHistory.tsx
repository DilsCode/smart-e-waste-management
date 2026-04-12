
import { useData } from '../../../context/DataContext';
import { HistoryIcon } from '../../shared/Icons';

const ScanHistory = () => {
    const { state, getBinById, getUserById } = useData();
    const { scanLogs = [] } = state || {};

    const sortedLogs = [...scanLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold flex items-center">
                    <HistoryIcon className="w-7 h-7 mr-3 text-emerald-500" />
                    Scan History
                </h1>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 border-b dark:border-gray-700">
                            <tr>
                                <th className="p-4 font-semibold">Time</th>
                                <th className="p-4 font-semibold">Staff Member</th>
                                <th className="p-4 font-semibold">Bin Name</th>
                                <th className="p-4 font-semibold">Items Logged</th>
                                <th className="p-4 font-semibold">Total Weight</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-gray-700">
                            {sortedLogs.length > 0 ? (
                                sortedLogs.map((log) => {
                                    const staff = getUserById(log.staff_id);
                                    const bin = getBinById(log.bin_id);
                                    const totalWeight = log.items.reduce((sum, item) => sum + item.weight, 0);

                                    return (
                                        <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="p-4 text-sm whitespace-nowrap">
                                                {new Date(log.timestamp).toLocaleString()}
                                            </td>
                                            <td className="p-4">
                                                <div className="font-medium">{staff?.name || 'Unknown Staff'}</div>
                                                <div className="text-xs text-gray-500">{staff?.email}</div>
                                            </td>
                                            <td className="p-4 font-medium text-emerald-600 dark:text-emerald-400">
                                                {bin?.name || 'Deleted Bin'}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {log.items.map((item, idx) => (
                                                        <span key={idx} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                                                            {item.type} ({item.weight}kg)
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="p-4 font-bold">
                                                {totalWeight.toFixed(2)} kg
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">
                                        No scan activity recorded yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ScanHistory;
