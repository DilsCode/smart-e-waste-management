
import { useMemo } from 'react';
import { useData } from '../../../context/DataContext';
import { BinsIcon, AlertIcon, TruckIcon } from '../../shared/Icons';

const StatCard = ({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow flex items-center space-x-4">
        <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-full text-green-700 dark:text-green-300">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">{value}</p>
        </div>
    </div>
);


const RecyclerDashboard = () => {
    const { state } = useData();
    const { bins = [], pickups = [], currentUser = null } = state || {};

    const myBins = useMemo(() => {
        if (!currentUser) return [];
        // Show all bins for the demo
        return bins;
    }, [bins]);

    const myPickups = useMemo(() => {
        if (!currentUser) return [];
        // Show all pickups for the demo
        return pickups;
    }, [pickups]);

    const activeBins = myBins.length;
    const fullBins = myBins.filter(b => b.status === 'awaiting-pickup').length;
    const pendingPickups = myPickups.filter(p => p.status === 'pending').length;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="My Active Bins" value={activeBins} icon={<BinsIcon className="w-8 h-8"/>} />
                <StatCard title="Full Bins" value={fullBins} icon={<AlertIcon className="w-8 h-8"/>} />
                <StatCard title="Pending Pickups" value={pendingPickups} icon={<TruckIcon className="w-8 h-8"/>} />
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
                <p className="text-gray-500 dark:text-gray-400 italic">No recent activity to show.</p>
            </div>
        </div>
    );
};

export default RecyclerDashboard;
