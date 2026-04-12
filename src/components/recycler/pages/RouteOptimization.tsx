
import { useData } from '../../../context/DataContext';
import { motion } from 'motion/react';
import { MapPin, Navigation, Truck, Clock } from 'lucide-react';

const RouteOptimization = () => {
  const { state, acceptPickup } = useData();
  const { pickups = [], bins = [] } = state || {};

  const activePickups = pickups.filter(p => p.status === 'accepted' || p.status === 'pending');

  const handleAccept = (id: string) => {
    acceptPickup({ pickupId: id });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
          <Navigation className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Route Optimization</h2>
          <p className="text-gray-500">Live map view of your assigned collection points.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Simulation */}
        <div className="lg:col-span-2 bg-gray-100 dark:bg-gray-900 rounded-[2.5rem] h-[500px] relative overflow-hidden border border-gray-200 dark:border-gray-800">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          
          {/* Simulated Map Markers */}
          {activePickups.map((pickup, index) => {
            const bin = bins.find(b => b.id === pickup.bin_id);
            return (
              <motion.div
                key={pickup.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.2 }}
                className="absolute"
                style={{ 
                  top: `${20 + (index * 15) % 60}%`, 
                  left: `${20 + (index * 25) % 60}%` 
                }}
              >
                <div className="relative group">
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    <p className="text-xs font-bold">{bin?.name || 'Collection Point'}</p>
                    <p className="text-[10px] text-gray-500">{bin?.location}</p>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-transform hover:scale-125 ${
                    pickup.status === 'accepted' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}>
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div className={`absolute -inset-2 rounded-full animate-ping opacity-20 ${
                    pickup.status === 'accepted' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}></div>
                </div>
              </motion.div>
            );
          })}

          <div className="absolute bottom-6 left-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Accepted</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Pending</span>
              </div>
            </div>
          </div>
        </div>

        {/* Route Details */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 dark:text-white px-2">Next Destinations</h3>
          {activePickups.length > 0 ? activePickups.map((pickup, index) => {
            const bin = bins.find(b => b.id === pickup.bin_id);
            return (
              <motion.div
                key={pickup.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center space-x-4"
              >
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-900 rounded-xl flex items-center justify-center text-gray-500 font-bold">
                  {index + 1}
                </div>
                <div className="flex-grow">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">{bin?.name}</h4>
                  <p className="text-[10px] text-gray-500">{bin?.location}</p>
                </div>
                <div className="text-right flex flex-col items-end">
                  {pickup.status === 'pending' ? (
                    <button 
                      onClick={() => handleAccept(pickup.id)}
                      className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-lg hover:bg-emerald-600 transition-all mb-1"
                    >
                      Accept
                    </button>
                  ) : (
                    <div className="flex items-center text-emerald-500 text-[10px] font-bold uppercase mb-1">
                      <Clock className="w-3 h-3 mr-1" />
                      15 min
                    </div>
                  )}
                  <p className="text-[10px] text-gray-400">2.4 km</p>
                </div>
              </motion.div>
            );
          }) : (
            <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
              <Truck className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              <p className="text-xs text-gray-500">No active routes found.</p>
            </div>
          )}
          
          {activePickups.length > 0 && (
            <button className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center space-x-2">
              <Navigation className="w-5 h-5" />
              <span>Start Optimized Route</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RouteOptimization;
