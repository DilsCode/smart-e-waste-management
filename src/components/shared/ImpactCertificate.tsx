
import { motion } from 'motion/react';
import { useData } from '../../context/DataContext';
import { DownloadIcon, LogoIcon, CheckCircleIcon } from './Icons';

interface ImpactCertificateProps {
    userId: string;
    weight: number;
    onClose: () => void;
}

const ImpactCertificate = ({ userId, weight, onClose }: ImpactCertificateProps) => {
    const { getUserById, state } = useData();
    const user = getUserById(userId);
    const { settings = { collegeName: 'Smart E-Waste Management System' } } = state || {};

    if (!user) return null;

    const totalWeight = weight || 0;
    const co2Saved = (totalWeight * 1.5).toFixed(2); // Mock calculation: 1.5kg CO2 per 1kg e-waste

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden print:shadow-none print:rounded-none"
            >
                {/* Certificate Content */}
                <div className="p-12 border-8 border-emerald-500/20 m-4 relative print:m-0 print:border-emerald-500">
                    {/* Decorative corners */}
                    <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-emerald-500"></div>
                    <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-emerald-500"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-emerald-500"></div>
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-emerald-500"></div>

                    <div className="text-center space-y-6">
                        <div className="flex justify-center mb-4">
                            <LogoIcon className="w-20 h-20 text-emerald-600" />
                        </div>
                        
                        <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white uppercase tracking-widest">
                            Certificate of Impact
                        </h1>
                        
                        <div className="h-1 w-32 bg-emerald-500 mx-auto"></div>
                        
                        <p className="text-xl text-gray-600 dark:text-gray-400 italic">
                            This is to certify that
                        </p>
                        
                        <h2 className="text-3xl font-bold text-emerald-600 underline decoration-emerald-200 underline-offset-8">
                            {user.name}
                        </h2>
                        
                        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
                            has successfully contributed to the environmental sustainability of 
                            <span className="font-bold block mt-1">{settings.collegeName}</span>
                            by responsibly recycling e-waste.
                        </p>

                        <div className="grid grid-cols-2 gap-8 py-8 border-y border-gray-100 dark:border-gray-800">
                            <div className="text-center">
                                <p className="text-sm text-gray-500 uppercase tracking-wider">Total Recycled</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalWeight.toFixed(2)} kg</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-500 uppercase tracking-wider">CO2 Offset</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">{co2Saved} kg</p>
                            </div>
                        </div>

                        <div className="flex justify-between items-end pt-8">
                            <div className="text-left">
                                <p className="text-xs text-gray-400">Date Issued</p>
                                <p className="font-medium">{new Date().toLocaleDateString()}</p>
                            </div>
                            <div className="text-center">
                                <CheckCircleIcon className="w-12 h-12 text-emerald-500 mx-auto mb-1" />
                                <p className="text-[10px] uppercase tracking-tighter text-gray-400">Verified System Record</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400">Certificate ID</p>
                                <p className="font-mono text-xs">EC-{user.id.substring(0, 8).toUpperCase()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-6 bg-gray-50 dark:bg-gray-800/50 flex justify-end space-x-4 print:hidden">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium"
                    >
                        Close
                    </button>
                    <button 
                        onClick={handlePrint}
                        className="flex items-center px-8 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 shadow-lg transition-all transform hover:scale-105"
                    >
                        <DownloadIcon className="w-5 h-5 mr-2" />
                        Download PDF
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default ImpactCertificate;
