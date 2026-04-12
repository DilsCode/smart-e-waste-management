
import { useState, useMemo, useEffect } from 'react';
import { Bin } from '../../types';
import { useData } from '../../context/DataContext';
import { CloseIcon, LocationMarkerIcon } from './Icons';

interface BinScanModalProps {
    bin: Bin;
    onClose: () => void;
}

const BinScanModal = ({ bin, onClose }: BinScanModalProps) => {
    const { state, addScanLog, getUserById } = useData();
    // FIX: Defensively destructure state and provide default values.
    const { settings = { itemPrices: [] }, scanLogs = [] } = state || {};
    // FIX: Safely initialize state to prevent crash if itemPrices is empty.
    const [item, setItem] = useState(settings.itemPrices[0]?.type || '');
    const [qty, setQty] = useState(1);
    const [feedback, setFeedback] = useState('');
    
    // Ensure the item state is updated if the settings load after the component mounts
    useEffect(() => {
        if (!item && settings.itemPrices.length > 0) {
            setItem(settings.itemPrices[0].type);
        }
    }, [settings.itemPrices, item]);

    const binForDisplay = bin;

    const fillPercentage = (binForDisplay.current_count / binForDisplay.capacity) * 100;
    let progressBarColor = 'bg-green-500';
    if (fillPercentage > 80) progressBarColor = 'bg-red-500';
    else if (fillPercentage > 50) progressBarColor = 'bg-yellow-400';

    let statusBadgeColor = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    let statusText = 'Active';
    if (fillPercentage >= 100) {
        statusBadgeColor = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
        statusText = 'Full';
    } else if (fillPercentage > 50) {
        statusBadgeColor = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
        statusText = 'Half Full';
    }

    const recentLogs = useMemo(() => {
        return scanLogs
            .filter(log => log.bin_id === bin.id)
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 5);
    }, [scanLogs, bin.id]);

    const handleAdd = async () => {
        if (!state?.currentUser) return;
        if (!item) {
            setFeedback('Please select an item type.');
            setTimeout(() => setFeedback(''), 2000);
            return;
        }

        const { pickupCreated } = await addScanLog({ binId: bin.id, itemType: item, quantity: qty, userId: state.currentUser.id });
        
        if (pickupCreated) {
            setFeedback('Item logged! Bin is now full and a pickup has been requested.');
        } else {
            setFeedback('Item successfully logged.');
        }

        setTimeout(() => {
           onClose();
        }, 2000);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg transform transition-all animate-fade-in-up">
                 <style>{`
                  @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                  }
                  .animate-fade-in-up {
                    animation: fade-in-up 0.3s ease-out forwards;
                  }
                `}</style>
                <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Log E-Waste Item</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 space-y-6">
                    {feedback ? (
                         <div className="text-center p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg">
                            <p>{feedback}</p>
                        </div>
                    ) : (
                    <>
                        {/* Bin Info Section */}
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border dark:border-gray-600">
                             <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold">{binForDisplay.name}</h3>
                                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusBadgeColor}`}>{statusText}</span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mb-4">
                               <LocationMarkerIcon className="w-4 h-4 mr-1.5" />
                               {binForDisplay.location}
                            </p>
                            <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300 mb-1">
                                <span>Fill Level</span>
                                <span>{binForDisplay.current_count} / {binForDisplay.capacity} items</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                                <div className={`${progressBarColor} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${fillPercentage}%` }}></div>
                            </div>
                        </div>

                        {/* Form Section */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-lg">Add New Item</h4>
                             <div>
                                <label htmlFor="itemType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Item Type</label>
                                <select
                                    id="itemType"
                                    value={item}
                                    onChange={e => setItem(e.target.value)}
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                                >
                                    {settings.itemPrices.length === 0 && <option disabled>No items configured</option>}
                                    {settings.itemPrices.map(i => <option key={i.type} value={i.type}>{i.type}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantity</label>
                                <input
                                    id="quantity"
                                    type="number"
                                    value={qty}
                                    onChange={e => setQty(Math.max(1, Number(e.target.value)))}
                                    min="1"
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                                />
                            </div>
                        </div>

                        {/* Recent Activity Section */}
                        <div>
                             <h4 className="font-semibold text-lg mb-2">Last 5 Logged Items in this Bin</h4>
                             <div className="overflow-x-auto border dark:border-gray-600 rounded-lg">
                                 <table className="w-full text-sm text-left">
                                     <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-700 dark:text-gray-400">
                                         <tr>
                                             <th className="p-2">Item</th>
                                             <th className="p-2">Qty</th>
                                             <th className="p-2">Date & Time</th>
                                             <th className="p-2">Logged By</th>
                                         </tr>
                                     </thead>
                                     <tbody>
                                         {recentLogs.length > 0 ? recentLogs.map(log => (
                                             <tr key={log.id} className="border-b dark:border-gray-700 last:border-b-0">
                                                 <td className="p-2 font-medium">{log.items[0]?.type || 'N/A'}</td>
                                                 <td className="p-2">{log.items[0]?.quantity || 0}</td>
                                                 <td className="p-2 text-gray-500 dark:text-gray-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                                                 <td className="p-2 text-gray-500 dark:text-gray-400">{getUserById(log.staff_id)?.name.split(' ')[0] || 'N/A'}</td>
                                             </tr>
                                         )) : (
                                            <tr>
                                                <td colSpan={4} className="text-center p-4 text-gray-500 dark:text-gray-400">No items logged in this bin yet.</td>
                                            </tr>
                                         )}
                                     </tbody>
                                 </table>
                             </div>
                        </div>
                    </>
                    )}
                </div>
                {!feedback && (
                    <div className="p-6 bg-gray-50 dark:bg-gray-700/50 border-t dark:border-gray-700 flex justify-end space-x-4">
                        <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
                            Cancel
                        </button>
                        <button onClick={handleAdd} className="px-6 py-2 bg-emerald-500 text-white font-semibold rounded-md hover:bg-emerald-600 shadow transition-transform transform hover:scale-105">
                            Add Item
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BinScanModal;