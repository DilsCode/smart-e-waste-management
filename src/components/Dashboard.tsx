
import { useState } from 'react';
import { useData } from '../context/DataContext';
import { Role } from '../types';
import AdminView from './admin/AdminView';
import StaffView from './staff/StaffView';
import RecyclerView from './recycler/RecyclerView';
import PresentationMode from './admin/pages/PresentationMode';
import { 
    MenuIcon, CloseIcon, LogoIcon
} from './shared/Icons';
import { LogOut, Presentation } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Dashboard = () => {
    const { state, logout } = useData();
    const currentUser = state?.currentUser;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showPresentation, setShowPresentation] = useState(false);

    if (!currentUser) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
            <AnimatePresence>
                {showPresentation && <PresentationMode onClose={() => setShowPresentation(false)} />}
            </AnimatePresence>

            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo and Brand */}
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-500/20">
                                <LogoIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">EcoConnect</h1>
                                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest leading-none">Portal</p>
                            </div>
                        </div>

                        {/* Desktop Navigation Info */}
                        <div className="hidden md:flex items-center space-x-8">
                            <button 
                                onClick={() => setShowPresentation(true)}
                                className="flex items-center space-x-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 font-bold rounded-xl border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
                            >
                                <Presentation className="w-4 h-4" />
                                <span className="text-sm">Project Demo</span>
                            </button>

                            <div className="flex items-center space-x-4 px-4 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/10">
                                    {currentUser.name.charAt(0)}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-gray-900 dark:text-white leading-none">{currentUser.name}</span>
                                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mt-1">{currentUser.role}</span>
                                </div>
                            </div>
                            
                            <button 
                                onClick={logout}
                                className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                                title="Sign Out"
                            >
                                <LogOut className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center">
                            <button 
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                            >
                                {isMenuOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden"
                        >
                            <div className="p-6 space-y-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-500/20">
                                        {currentUser.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">{currentUser.name}</p>
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">{currentUser.role}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={logout}
                                    className="w-full py-4 bg-red-50 dark:bg-red-900/20 text-red-600 font-bold rounded-2xl flex items-center justify-center space-x-2"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    {currentUser.role === Role.Admin && <AdminView />}
                    {currentUser.role === Role.Staff && <StaffView />}
                    {currentUser.role === Role.Recycler && <RecyclerView />}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
