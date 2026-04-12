
import { useMemo } from 'react';
import { useData } from '../../../context/DataContext';
import { motion } from 'motion/react';
import { TrendingUp, DollarSign, Calendar, ArrowUpRight, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const EarningsAnalytics = () => {
  const { state } = useData();
  const { payments = [], pickups = [], currentUser = null } = state || {};

  const stats = useMemo(() => {
    if (!currentUser) return { total: 0, monthly: 0, weekly: 0, count: 0 };
    
    const myPickups = pickups.filter(p => p.status === 'completed');
    const myPayments = payments.filter(pay => myPickups.some(p => p.id === pay.pickup_id));
    
    const total = myPayments.reduce((acc, p) => acc + p.amount, 0);
    
    // Mocking some time-based data for the chart
    const chartData = [
      { name: 'Mon', amount: 1200 },
      { name: 'Tue', amount: 2100 },
      { name: 'Wed', amount: 800 },
      { name: 'Thu', amount: 1600 },
      { name: 'Fri', amount: 2400 },
      { name: 'Sat', amount: 1900 },
      { name: 'Sun', amount: 500 },
    ];

    return { total, count: myPayments.length, chartData };
  }, [payments, pickups, currentUser]);

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl">
          <TrendingUp className="w-8 h-8 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Earnings Analytics</h2>
          <p className="text-gray-500">Track your income and collection performance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl">
              <DollarSign className="w-6 h-6 text-emerald-500" />
            </div>
            <span className="flex items-center text-emerald-500 text-xs font-bold">
              +12% <ArrowUpRight className="w-3 h-3 ml-1" />
            </span>
          </div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Total Earnings</p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">₹{stats.total.toLocaleString()}</h3>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <BarChart3 className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Collections</p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.count} <span className="text-sm font-normal text-gray-400">pickups</span></h3>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-500/10 rounded-xl">
              <Calendar className="w-6 h-6 text-amber-500" />
            </div>
          </div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Avg. Per Pickup</p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">₹{stats.count > 0 ? Math.round(stats.total / stats.count) : 0}</h3>
        </motion.div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Weekly Performance</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 12 }}
              />
              <Tooltip 
                cursor={{ fill: '#f9fafb' }}
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  padding: '12px'
                }}
              />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                {stats.chartData?.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={index === 4 ? '#10b981' : '#e5e7eb'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default EarningsAnalytics;
