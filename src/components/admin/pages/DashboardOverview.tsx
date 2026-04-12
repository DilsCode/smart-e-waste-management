
import { useData } from '../../../context/DataContext';
import StatCard from '../../shared/StatCard';
import { TrashIcon, AlertIcon, ScaleIcon, MoneyIcon } from '../../shared/Icons';
import { useMemo } from 'react';

const DashboardOverview = () => {
    const { state, requestPickup } = useData();
    const { bins = [], pickups = [], payments = [] } = state || {};

    const totalBins = bins.length;
    const fullBins = bins.filter(b => b.status === 'awaiting-pickup').length;
    const totalWeight = useMemo(() => pickups.filter(p => p.status === 'completed').reduce((acc, p) => acc + p.estimated_weight, 0), [pickups]);
    const totalRevenue = useMemo(() => payments.reduce((acc, p) => acc + p.amount, 0), [payments]);

    const handleForcePickup = (binId: string) => {
        if (!state.currentUser) return;
        requestPickup({ binId, userId: state.currentUser.id, notes: 'Manually triggered by Admin.' });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
                <p className="text-gray-500 dark:text-gray-400">Welcome back to the e-waste management system.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Bins" value={totalBins} icon={<TrashIcon className="w-6 h-6"/>} color="green" />
                <StatCard title="Full Bins" value={fullBins} icon={<AlertIcon className="w-6 h-6"/>} color="yellow" />
                <StatCard title="Total Waste" value={`${totalWeight.toFixed(1)} kg`} icon={<ScaleIcon className="w-6 h-6"/>} color="blue" />
                <StatCard title="Revenue" value={`₹${totalRevenue.toFixed(0)}`} icon={<MoneyIcon className="w-6 h-6"/>} color="emerald" />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="p-4 border-b dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Bin Status</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-500 dark:text-gray-400 font-bold">
                            <tr>
                                <th className="p-4">Bin Name</th>
                                <th className="p-4">Location</th>
                                <th className="p-4">Fill Level</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-gray-700">
                            {bins.map(bin => {
                                const fillRatio = bin.current_count / bin.capacity;
                                const fillPercent = Math.min(100, Math.round(fillRatio * 100));
                                
                                return (
                                    <tr key={bin.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="p-4 font-semibold text-gray-900 dark:text-white">{bin.name}</td>
                                        <td className="p-4 text-gray-600 dark:text-gray-400 text-sm">{bin.location}</td>
                                        <td className="p-4">
                                            <div className="w-full max-w-[100px]">
                                                <div className="flex justify-between text-[10px] mb-1 font-bold text-gray-400">
                                                    <span>{fillPercent}%</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                    <div 
                                                        style={{ width: `${fillPercent}%` }}
                                                        className={`h-full rounded-full ${
                                                            fillPercent > 80 ? 'bg-red-500' : 
                                                            fillPercent > 50 ? 'bg-yellow-500' : 'bg-emerald-500'
                                                        }`}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-[10px] font-bold rounded-md uppercase ${
                                                bin.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                                                'bg-amber-100 text-amber-700'
                                            }`}>
                                                {bin.status.replace('-', ' ')}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button 
                                                onClick={() => handleForcePickup(bin.id)}
                                                disabled={bin.status === 'awaiting-pickup'}
                                                className="text-xs font-bold text-emerald-600 hover:text-emerald-500 disabled:opacity-30"
                                            >
                                                Request Pickup
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
