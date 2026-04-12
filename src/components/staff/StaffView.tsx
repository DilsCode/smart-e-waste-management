
import { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import RequestPickupView from './RequestPickupView';
import AIDisposalAssistant from './AIDisposalAssistant';
import Leaderboard from './Leaderboard';
import IssueReporting from './IssueReporting';
import BinStatus from './BinStatus';
import ChatWithRecycler from './ChatWithRecycler';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Truck, 
  Bot, 
  Trophy, 
  AlertTriangle, 
  MessageSquare,
  TrendingUp
} from 'lucide-react';

const StaffView = () => {
    const { state } = useData();
    const { currentUser = null, pickups = [], settings = { itemPrices: [], collegeName: '', adminEmail: '' } } = state || {};
    const [activeTab, setActiveTab] = useState('dashboard');

    const myRecentRequests = useMemo(() => {
        if (!currentUser) return [];
        return pickups
            .filter(p => p.requester_id === currentUser.id)
            .sort((a, b) => new Date(b.request_time).getTime() - new Date(a.request_time).getTime());
    }, [pickups, currentUser]);

    const myTotalWeight = useMemo(() => {
        return myRecentRequests
            .filter(p => p.status === 'completed')
            .reduce((acc, p) => acc + p.estimated_weight, 0);
    }, [myRecentRequests]);

    const tabs = [
      { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
      { id: 'pickup', label: 'Request Pickup', icon: <Truck className="w-5 h-5" /> },
      { id: 'ai', label: 'AI Assistant', icon: <Bot className="w-5 h-5" /> },
      { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy className="w-5 h-5" /> },
      { id: 'issues', label: 'Report Issue', icon: <AlertTriangle className="w-5 h-5" /> },
      { id: 'chat', label: 'Messages', icon: <MessageSquare className="w-5 h-5" /> },
    ];

    const renderContent = () => {
      switch (activeTab) {
        case 'dashboard': return <BinStatus />;
        case 'pickup': return <RequestPickupView />;
        case 'ai': return <AIDisposalAssistant />;
        case 'leaderboard': return <Leaderboard />;
        case 'issues': return <IssueReporting />;
        case 'chat': return <ChatWithRecycler />;
        default: return <BinStatus />;
      }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                        Welcome, {currentUser?.name}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 text-lg">
                        Manage your e-waste pickup requests for {settings.collegeName}.
                    </p>
                </div>
                <div className="flex items-center space-x-4">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="bg-emerald-500 p-6 rounded-[2rem] shadow-xl shadow-emerald-500/20 text-white flex items-center space-x-4"
                    >
                        <div className="p-3 bg-white/20 rounded-2xl">
                          <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Total Recycled</p>
                          <p className="text-3xl font-bold">{myTotalWeight.toFixed(1)} <span className="text-sm font-normal opacity-80">kg</span></p>
                        </div>
                    </motion.div>
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

export default StaffView;
