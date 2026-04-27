
import { useState } from 'react';
import { useData } from '../../../context/DataContext';
import { motion } from 'motion/react';
import { MapPin, Navigation, Truck, Clock, CheckCircle2, Phone } from 'lucide-react';

const RouteOptimization = () => {
  const { state, acceptPickup } = useData();
  const { pickups = [], bins = [] } = state || {};
  const [isNavigating, setIsNavigating] = useState(false);

  const activePickups = pickups.filter(p => p.status === 'accepted' || p.status === 'pending');

  const handleAccept = (id: string) => {
    acceptPickup({ pickupId: id });
  };

  const startNavigation = () => {
    setIsNavigating(true);
    // In a real app, this would open Google Maps or an internal nav system
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
            <Navigation className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Route Optimization</h2>
            <p className="text-gray-500">Live map view of your assigned collection points.</p>
          </div>
        </div>

        {isNavigating && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded-xl font-bold text-sm"
          >
            <Truck className="w-4 h-4 animate-bounce" />
            <span>Navigation Active</span>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Simulation */}
        <div className="lg:col-span-2 bg-gray-100 dark:bg-gray-900 rounded-[2.5rem] h-[550px] relative overflow-hidden border border-gray-200 dark:border-gray-800 shadow-inner">
          {/* Animated Background Grid */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          {/* Current Location Indicator */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg z-20"
          >
            <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-40"></div>
          </motion.div>

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
                  top: `${15 + (index * 18) % 70}%`, 
                  left: `${15 + (index * 22) % 70}%` 
                }}
              >
                <div className="relative group">
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100 whitespace-nowrap z-30">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className={`w-2 h-2 rounded-full ${pickup.status === 'accepted' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                      <p className="text-xs font-bold text-gray-900 dark:text-white">{bin?.name || 'Collection Point'}</p>
                    </div>
                    <p className="text-[10px] text-gray-500">{bin?.location}</p>
                    <div className="mt-2 text-[9px] font-bold text-blue-500 uppercase">EST. DISTANCE: 1.4km</div>
                  </div>
                  
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-transform hover:scale-125 z-10 ${
                    pickup.status === 'accepted' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}>
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className={`absolute -inset-2 rounded-full animate-pulse opacity-20 ${
                    pickup.status === 'accepted' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}></div>
                </div>
              </motion.div>
            );
          })}

          <div className="absolute top-6 left-6 flex flex-col space-y-2">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl">
               <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">ACCEPTED ({activePickups.filter(p => p.status === 'accepted').length})</span>
              </div>
            </div>
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl">
               <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">PENDING ({activePickups.filter(p => p.status === 'pending').length})</span>
              </div>
            </div>
          </div>

          <div className="absolute top-6 right-6 flex items-center space-x-2 p-2 bg-gray-900/40 backdrop-blur-sm rounded-xl border border-white/10">
             <button className="p-2 hover:bg-white/10 rounded-lg transition-all text-white"><Navigation className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Route Details */}
        <div className="space-y-4 flex flex-col h-[550px]">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold text-gray-900 dark:text-white px-2">Current Route</h3>
            <span className="text-[10px] font-bold text-blue-500 uppercase bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">Optimizing...</span>
          </div>
          
          <div className="flex-grow overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {activePickups.length > 0 ? activePickups.map((pickup, index) => {
              const bin = bins.find(b => b.id === pickup.bin_id);
              return (
                <motion.div
                  key={pickup.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-[1.5rem] border transition-all ${
                    pickup.status === 'accepted' 
                      ? 'bg-white dark:bg-gray-800 border-emerald-100 dark:border-emerald-900/30 shadow-sm' 
                      : 'bg-gray-50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                      pickup.status === 'accepted' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{bin?.name}</h4>
                      <p className="text-[10px] text-gray-500 mt-1">{bin?.location}</p>
                    </div>
                    {pickup.status === 'accepted' && (
                      <div className="flex space-x-1">
                        <button className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-all">
                          <Phone className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center text-gray-500 text-[10px] font-bold">
                        <Clock className="w-3 h-3 mr-1" />
                        {12 + index * 5}m
                      </div>
                      <div className="text-[10px] text-gray-400">{1.2 + index * 0.8} km</div>
                    </div>
                    
                    {pickup.status === 'pending' ? (
                      <button 
                        onClick={() => handleAccept(pickup.id)}
                        className="px-4 py-2 bg-emerald-500 text-white text-[10px] font-bold rounded-xl hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/20"
                      >
                        Accept Pickup
                      </button>
                    ) : (
                      <div className="flex items-center text-emerald-500 text-[10px] font-bold uppercase">
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Confirmed
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            }) : (
              <div className="flex flex-col items-center justify-center h-40 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                <Truck className="w-10 h-10 mb-2 text-gray-300" />
                <p className="text-xs text-gray-500">No active routes found.</p>
              </div>
            )}
          </div>
          
          <div className="pt-4 mt-auto">
            {!isNavigating ? (
              <button 
                onClick={startNavigation}
                disabled={activePickups.filter(p => p.status === 'accepted').length === 0}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:grayscale"
              >
                <Navigation className="w-5 h-5" />
                <span>Start Optimized Route</span>
              </button>
            ) : (
              <button 
                onClick={() => setIsNavigating(false)}
                className="w-full py-4 bg-gray-900 dark:bg-white dark:text-gray-900 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Finish Current Route</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteOptimization;
