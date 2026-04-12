
import { useState, useMemo, ChangeEvent } from 'react';
import { useData } from '../../../context/DataContext';
import { DownloadIcon, ScaleIcon, MoneyIcon, TruckIcon, TrashIcon, RecyclerIcon } from '../../shared/Icons';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const InsightCard = ({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-full text-green-700 dark:text-green-300">
                {icon}
            </div>
            <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h4>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
            </div>
        </div>
    </div>
);

const EnvironmentalCard = ({ title, value, icon, colorClass }: { title: string, value: string, icon: React.ReactNode, colorClass: string }) => (
    <div className={`p-5 rounded-lg text-white ${colorClass}`}>
        <div className="flex items-center space-x-3">
            <div>{icon}</div>
            <div>
                <p className="font-bold text-xl">{value}</p>
                <p className="text-sm opacity-90">{title}</p>
            </div>
        </div>
    </div>
);

const AnalyticsReports = () => {
    const { state, getBinById } = useData();
    const { currentUser, pickups = [], bins = [] } = state || {};

    const myBins = useMemo(() => {
        if (!currentUser) return [];
        return bins.filter(b => b.assigned_recycler_id === currentUser.id);
    }, [bins, currentUser]);

    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        binId: 'all',
    });

    const handleFilterChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const filteredCompletedPickups = useMemo(() => {
        if (!currentUser) return [];
        let data = pickups.filter(p => p.recycler_id === currentUser.id && p.status === 'completed' && p.completed_at);

        if (filters.startDate) {
            data = data.filter(p => new Date(p.completed_at!) >= new Date(filters.startDate));
        }
        if (filters.endDate) {
            const endDate = new Date(filters.endDate);
            endDate.setHours(23, 59, 59, 999);
            data = data.filter(p => new Date(p.completed_at!) <= endDate);
        }
        if (filters.binId !== 'all') {
            data = data.filter(p => p.bin_id === filters.binId);
        }
        
        return data;
    }, [pickups, filters, currentUser]);

    const totalPickupsCompleted = filteredCompletedPickups.length;
    const totalWasteCollected = filteredCompletedPickups.reduce((acc, p) => acc + p.estimated_weight, 0);
    const totalRevenue = filteredCompletedPickups.reduce((acc, p) => acc + p.estimated_payment, 0);

    const CO2_SAVED_PER_KG = 2.8;
    const LANDFILL_SAVED_PER_KG_M3 = 0.001;
    const co2Saved = totalWasteCollected * CO2_SAVED_PER_KG;
    const landfillSaved = totalWasteCollected * LANDFILL_SAVED_PER_KG_M3;

    const collectionTrendData = useMemo(() => {
        const trend = filteredCompletedPickups.reduce((acc, p) => {
            const date = new Date(p.completed_at!).toLocaleDateString('en-CA');
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(trend).map(([date, count]) => ({ date, count })).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [filteredCompletedPickups]);

    const wasteByBinData = useMemo(() => {
        const wasteData = filteredCompletedPickups.reduce((acc, p) => {
            const binName = getBinById(p.bin_id)?.name || 'Unknown';
            acc[binName] = (acc[binName] || 0) + p.estimated_weight;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(wasteData).map(([name, weight]) => ({ name: name.split(' ').slice(0, 2).join(' '), weight: parseFloat(weight.toFixed(2)) })).sort((a,b) => b.weight - a.weight);
    }, [filteredCompletedPickups, getBinById]);

    const handleExportCSV = () => {
        const headers = ['Pickup ID', 'Bin Name', 'Weight (kg)', 'Payment (₹)', 'Completed Date'];
        const rows = filteredCompletedPickups.map(p => [
            p.id,
            `"${getBinById(p.bin_id)?.name || 'N/A'}"`,
            p.estimated_weight.toFixed(2),
            p.estimated_payment.toFixed(2),
            `"${new Date(p.completed_at!).toLocaleString()}"`
        ].join(','));

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "my-ewaste-collections-report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Analytics & Reports</h1>
                <button
                    onClick={handleExportCSV}
                    disabled={filteredCompletedPickups.length === 0}
                    className="flex items-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    <DownloadIcon className="w-5 h-5 mr-2" />
                    Export CSV
                </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
                    <input type="date" name="startDate" id="startDate" value={filters.startDate} onChange={handleFilterChange} className="mt-1 w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 focus:border-green-800 focus:ring-green-800"/>
                </div>
                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
                    <input type="date" name="endDate" id="endDate" value={filters.endDate} onChange={handleFilterChange} className="mt-1 w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 focus:border-green-800 focus:ring-green-800"/>
                </div>
                <div>
                    <label htmlFor="binId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bin</label>
                    <select name="binId" id="binId" value={filters.binId} onChange={handleFilterChange} className="mt-1 w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 focus:border-green-800 focus:ring-green-800">
                        <option value="all">All My Bins</option>
                        {myBins.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                </div>
            </div>

            {/* Insight Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InsightCard title="Total Pickups Completed" value={totalPickupsCompleted} icon={<TruckIcon className="w-6 h-6"/>} />
                <InsightCard title="Total Waste Collected" value={`${totalWasteCollected.toFixed(2)} kg`} icon={<ScaleIcon className="w-6 h-6"/>} />
                <InsightCard title="Total Revenue Earned" value={`₹${totalRevenue.toFixed(2)}`} icon={<MoneyIcon className="w-6 h-6"/>} />
            </div>

            {/* Environmental Impact */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4 text-green-800 dark:text-green-300">Environmental Impact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <EnvironmentalCard title="CO₂ Emissions Saved" value={`${co2Saved.toFixed(2)} kg`} icon={<RecyclerIcon className="w-8 h-8"/>} colorClass="bg-gradient-to-br from-green-600 to-green-800" />
                    <EnvironmentalCard title="Landfill Space Saved" value={`${landfillSaved.toFixed(3)} m³`} icon={<TrashIcon className="w-8 h-8"/>} colorClass="bg-gradient-to-br from-blue-500 to-blue-700" />
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h3 className="text-xl font-semibold mb-4">Collection Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={collectionTrendData}>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                            <XAxis dataKey="date" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="count" stroke="#007BFF" strokeWidth={2} name="Pickups" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h3 className="text-xl font-semibold mb-4">Waste by Bin</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={wasteByBinData}>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis />
                            <Tooltip formatter={(value) => `${value} kg`} />
                            <Legend />
                            <Bar dataKey="weight" fill="#065f46" name="Waste (kg)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsReports;