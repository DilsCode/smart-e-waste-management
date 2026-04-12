import { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import StatCard from '../shared/StatCard';
import { ScaleIcon, HistoryIcon, UsersIcon } from '../shared/Icons';

import { Pickup, Role } from '../../types';

interface AnalyticsDashboardProps {
    pickups: Pickup[];
}

const AnalyticsDashboard = ({ pickups }: AnalyticsDashboardProps) => {
    const { state } = useData();
    const { bins = [], users = [] } = state || {};

    const stats = useMemo(() => {
        const totalWeight = pickups.filter(p => p.status === 'completed').reduce((acc, p) => acc + p.estimated_weight, 0);
        const activeBins = bins.filter(b => b.status === 'active').length;
        const totalUsers = users.length;
        return { totalWeight, activeBins, totalUsers };
    }, [bins, pickups, users]);

    const chartData = useMemo(() => {
        return bins.map(b => ({
            name: b.name.split(' ')[0],
            fill: (b.current_count / b.capacity) > 0.8 ? '#ef4444' : '#10b981',
            value: b.current_count
        }));
    }, [bins]);

    const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total E-Waste Collected" value={`${stats.totalWeight.toFixed(1)} kg`} icon={<ScaleIcon className="w-6 h-6" />} color="emerald" />
                <StatCard title="Active Bins" value={stats.activeBins} icon={<HistoryIcon className="w-6 h-6" />} color="blue" />
                <StatCard title="Total Users" value={stats.totalUsers} icon={<UsersIcon className="w-6 h-6" />} color="purple" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold mb-6">Bin Fill Levels</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {chartData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={chartData[index].fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold mb-6">User Distribution</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Staff', value: users.filter(u => u.role === Role.Staff).length },
                                        { name: 'Recycler', value: users.filter(u => u.role === Role.Recycler).length },
                                        { name: 'Admin', value: users.filter(u => u.role === Role.Admin).length },
                                    ]}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {[0, 1, 2].map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
