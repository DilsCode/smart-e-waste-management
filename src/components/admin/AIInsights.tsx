import { useMemo } from 'react';
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

import { Bin, Pickup } from '../../types';

interface AIInsightsProps {
    pickups: Pickup[];
    bins: Bin[];
}

const AIInsights = ({ pickups, bins }: AIInsightsProps) => {
    // Use props instead of state for bins and pickups

    const insights = useMemo(() => {
        const fullBins = bins.filter(b => (b.current_count / b.capacity) > 0.8);
        const avgFillRate = bins.reduce((acc, b) => acc + (b.current_count / b.capacity), 0) / bins.length;
        const recentPickups = pickups.filter(p => p.status === 'completed').length;

        return [
            {
                title: 'High Priority Bins',
                description: fullBins.length > 0 
                    ? `${fullBins.length} bins are over 80% capacity and need immediate attention.`
                    : 'All bins are currently within optimal capacity limits.',
                icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
                type: fullBins.length > 0 ? 'warning' : 'success'
            },
            {
                title: 'Collection Efficiency',
                description: `Average bin fill rate is ${(avgFillRate * 100).toFixed(1)}%. Optimal collection window is 75-85%.`,
                icon: <TrendingUp className="w-5 h-5 text-blue-500" />,
                type: 'info'
            },
            {
                title: 'Recent Performance',
                description: `${recentPickups} pickups completed in the last 7 days. System is operating at peak efficiency.`,
                icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
                type: 'success'
            }
        ];
    }, [bins, pickups]);

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-lg font-bold uppercase tracking-widest">AI-Driven Insights</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {insights.map((insight, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                {insight.icon}
                            </div>
                            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                                insight.type === 'warning' ? 'bg-amber-100 text-amber-700' :
                                insight.type === 'success' ? 'bg-emerald-100 text-emerald-700' :
                                'bg-blue-100 text-blue-700'
                            }`}>
                                {insight.type}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-bold text-gray-900 dark:text-white">{insight.title}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{insight.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default AIInsights;
