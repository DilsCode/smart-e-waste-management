
import { useMemo } from 'react';
import { useData } from '../../../context/DataContext';
import { motion } from 'motion/react';
import { Package, Smartphone, Laptop, Battery, Cpu, HardDrive } from 'lucide-react';

const InventoryTracking = () => {
  const { state } = useData();
  const { pickups = [], currentUser = null } = state || {};

  const inventory = useMemo(() => {
    if (!currentUser) return [];
    
    const myCompletedPickups = pickups.filter(p => p.status === 'completed');
    
    const totals: Record<string, number> = {};
    myCompletedPickups.forEach(p => {
      p.items?.forEach(item => {
        totals[item.type] = (totals[item.type] || 0) + item.quantity;
      });
    });

    return Object.entries(totals).map(([type, quantity]) => ({
      type,
      quantity,
      icon: type.toLowerCase().includes('mobile') ? <Smartphone /> :
            type.toLowerCase().includes('laptop') ? <Laptop /> :
            type.toLowerCase().includes('battery') ? <Battery /> :
            type.toLowerCase().includes('motherboard') ? <Cpu /> :
            <HardDrive />
    }));
  }, [pickups, currentUser]);

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl">
          <Package className="w-8 h-8 text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory Tracking</h2>
          <p className="text-gray-500">Manage and view your collected e-waste inventory.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inventory.length > 0 ? inventory.map((item, index) => (
          <motion.div
            key={item.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm flex items-center space-x-6"
          >
            <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500">
              {item.icon}
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white">{item.type}</h4>
              <p className="text-2xl font-bold text-purple-600">{item.quantity} <span className="text-xs font-normal text-gray-400">units</span></p>
            </div>
          </motion.div>
        )) : (
          <div className="col-span-full text-center py-20 bg-white dark:bg-gray-800 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-gray-700">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-200" />
            <p className="text-gray-500">No inventory collected yet. Complete some pickups to see data here.</p>
          </div>
        )}
      </div>

      {inventory.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Recent Additions</h3>
          <div className="space-y-4">
            {pickups.filter(p => p.status === 'completed').slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-sm">
                    <Package className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Pickup #{p.id}</p>
                    <p className="text-[10px] text-gray-500">{new Date(p.completed_at!).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-600">+{p.estimated_weight} kg</p>
                  <p className="text-[10px] text-gray-400">{p.items?.length || 0} items</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryTracking;
