
import { useData } from '../../context/DataContext';
import { motion } from 'motion/react';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

const BinStatus = () => {
  const { state } = useData();
  const { bins = [] } = state || {};

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {bins.map((bin) => {
          const fillPercentage = (bin.current_count / bin.capacity) * 100;
          const isFull = bin.status === 'full' || bin.status === 'awaiting-pickup';
          
          return (
            <motion.div
              key={bin.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{bin.name}</h4>
                  <p className="text-xs text-gray-500">{bin.location}</p>
                </div>
                {isFull ? (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                ) : fillPercentage > 70 ? (
                  <Clock className="w-5 h-5 text-amber-500" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                  <span className="text-gray-500">Fill Level</span>
                  <span className={isFull ? 'text-red-500' : 'text-emerald-500'}>
                    {Math.round(fillPercentage)}%
                  </span>
                </div>
                <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${fillPercentage}%` }}
                    className={`h-full rounded-full ${
                      isFull ? 'bg-red-500' : fillPercentage > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                  />
                </div>
                <p className="text-[10px] text-gray-400 text-right">
                  {bin.current_count} / {bin.capacity} items
                </p>
              </div>

              {isFull && (
                <div className="mt-4 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
                  <p className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase">Awaiting Pickup</p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default BinStatus;
