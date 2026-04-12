
import React, { useState, useMemo } from 'react';
import { useData } from '../../../context/DataContext';
import { DownloadIcon } from '../../shared/Icons';
import { Role } from '../../../types';

const InsightCard = ({ title, value }: { title: string; value: string | number }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</h4>
        <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2">{value}</p>
    </div>
);

const ReportsAnalytics = () => {
    const { state, getBinById, getUserById } = useData();
    const { 
        bins = [], 
        pickups = [], 
        users = []
    } = state || {};

    const recyclers = users.filter(u => u.role === Role.Recycler);

    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        binId: 'all',
        recyclerId: 'all',
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const filteredCompletedPickups = useMemo(() => {
        let data = pickups.filter(p => p.status === 'completed' && p.completed_at);

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
        if (filters.recyclerId !== 'all') {
            data = data.filter(p => p.recycler_id === filters.recyclerId);
        }
        
        return data;
    }, [pickups, filters]);
    
    const totalWasteCollected = filteredCompletedPickups.reduce((acc, p) => acc + p.estimated_weight, 0);
    const totalRevenue = filteredCompletedPickups.reduce((acc, p) => acc + p.estimated_payment, 0);

    const topPerformingBin = useMemo(() => {
        if (filteredCompletedPickups.length === 0) return 'N/A';
        const binWaste = filteredCompletedPickups.reduce((acc, p) => {
            const binName = getBinById(p.bin_id)?.name || 'Unknown';
            acc[binName] = (acc[binName] || 0) + p.estimated_weight;
            return acc;
        }, {} as Record<string, number>);
        
        const topBin = Object.entries(binWaste).sort((a, b) => b[1] - a[1])[0];
        return topBin ? topBin[0] : 'N/A';
    }, [filteredCompletedPickups, getBinById]);
    
    const handleExportCSV = () => {
        const headers = ['Pickup ID', 'Bin Name', 'Recycler', 'Weight (kg)', 'Payment (₹)', 'Completed Date'];
        const rows = filteredCompletedPickups.map(p => [
            p.id,
            `"${getBinById(p.bin_id)?.name || 'N/A'}"`,
            `"${getUserById(p.recycler_id)?.name || 'N/A'}"`,
            p.estimated_weight.toFixed(2),
            p.estimated_payment.toFixed(2),
            `"${new Date(p.completed_at!).toLocaleString()}"`
        ].join(','));

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "e-waste-report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Reports & Analytics</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Monitor waste collection performance and revenue.</p>
                </div>
                <button
                    onClick={handleExportCSV}
                    className="flex items-center justify-center px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all"
                >
                    <DownloadIcon className="w-5 h-5 mr-2" />
                    Export Report
                </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Start Date</label>
                        <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 transition-all"/>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">End Date</label>
                        <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 transition-all"/>
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Filter by Bin</label>
                    <select name="binId" value={filters.binId} onChange={handleFilterChange} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 transition-all">
                        <option value="all">All Bins</option>
                        {bins.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Filter by Recycler</label>
                    <select name="recyclerId" value={filters.recyclerId} onChange={handleFilterChange} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 transition-all">
                        <option value="all">All Recyclers</option>
                        {recyclers.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                </div>
            </div>

            {/* Insight Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InsightCard title="Total Collected" value={`${totalWasteCollected.toFixed(2)} kg`} />
                <InsightCard title="Total Revenue" value={`₹${totalRevenue.toFixed(2)}`} />
                <InsightCard title="Top Bin" value={topPerformingBin} />
            </div>

            {/* Detailed Table Placeholder */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b dark:border-gray-700">
                    <h3 className="text-lg font-bold">Recent Completed Pickups</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-900/50">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Bin</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Recycler</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Weight</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-gray-700">
                            {filteredCompletedPickups.slice(0, 10).map(p => (
                                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 font-medium">{getBinById(p.bin_id)?.name || 'N/A'}</td>
                                    <td className="px-6 py-4">{getUserById(p.recycler_id)?.name || 'N/A'}</td>
                                    <td className="px-6 py-4 font-bold text-emerald-600">{p.estimated_weight.toFixed(2)} kg</td>
                                    <td className="px-6 py-4 text-gray-500">{new Date(p.completed_at!).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {filteredCompletedPickups.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">No completed pickups found for the selected filters.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReportsAnalytics;
