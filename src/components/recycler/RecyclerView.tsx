
import { useState } from 'react';
import RecyclerDashboard from './pages/RecyclerDashboard';
import PickupsManagement from './pages/PickupsManagement';
import RouteOptimization from './pages/RouteOptimization';
import EarningsAnalytics from './pages/EarningsAnalytics';
import InventoryTracking from './pages/InventoryTracking';
import EnvironmentalImpact from './pages/EnvironmentalImpact';
import StaffChat from './pages/StaffChat';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Truck, 
  Navigation, 
  TrendingUp, 
  Package, 
  Leaf, 
  MessageSquare
} from 'lucide-react';

const RecyclerView = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

    const tabs = [
      { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
      { id: 'pickups', label: 'Pickups', icon: <Truck className="w-5 h-5" /> },
      { id: 'route', label: 'Route Map', icon: <Navigation className="w-5 h-5" /> },
      { id: 'earnings', label: 'Earnings', icon: <TrendingUp className="w-5 h-5" /> },
      { id: 'inventory', label: 'Inventory', icon: <Package className="w-5 h-5" /> },
      { id: 'impact', label: 'Impact', icon: <Leaf className="w-5 h-5" /> },
      { id: 'chat', label: 'Messages', icon: <MessageSquare className="w-5 h-5" /> },
    ];

    const renderContent = () => {
      switch (activeTab) {
        case 'dashboard': return <RecyclerDashboard />;
        case 'pickups': return <PickupsManagement />;
        case 'route': return <RouteOptimization />;
        case 'earnings': return <EarningsAnalytics />;
        case 'inventory': return <InventoryTracking />;
        case 'impact': return <EnvironmentalImpact />;
        case 'chat': return <StaffChat />;
        default: return <RecyclerDashboard />;
      }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                        Recycler Panel
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 text-lg">
                        Manage your collections, track earnings, and optimize your routes.
                    </p>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 p-2 bg-gray-100 dark:bg-gray-900/50 rounded-[2.5rem] border border-gray-200 dark:border-gray-800">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 rounded-[2rem] font-bold text-sm transition-all ${
                    activeTab === tab.id 
                      ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-lg border border-gray-100 dark:border-gray-700' 
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <span className={`mr-3 ${activeTab === tab.id ? 'text-emerald-500' : 'text-gray-400'}`}>
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              ))}
            </div>
            
            {/* Main Content Area */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="min-h-[600px]"
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default RecyclerView;
