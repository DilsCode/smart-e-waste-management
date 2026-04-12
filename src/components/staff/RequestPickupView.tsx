
import { useState, useMemo, FormEvent } from 'react';
import { useData } from '../../context/DataContext';
import { SendIcon, TrashIcon } from '../shared/Icons';
import { PickupItem } from '../../types';
import { Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const RequestPickupView = () => {
    const { state, requestPickup, getBinById } = useData();
    const { bins = [], currentUser = null, settings = { itemPrices: [], collegeName: '', adminEmail: '' } } = state || {};
    
    const availableBins = useMemo(() => bins.filter(b => b.status !== 'awaiting-pickup'), [bins]);

    const [selectedBinId, setSelectedBinId] = useState<string>(availableBins[0]?.id.toString() || '');
    const [items, setItems] = useState<PickupItem[]>([{ type: settings.itemPrices[0]?.type || '', quantity: 1 }]);
    const [notes, setNotes] = useState('');
    const [feedback, setFeedback] = useState('');

    const { totalWeight, totalPayment } = useMemo(() => {
        let weight = 0;
        let payment = 0;
        for (const item of items) {
            const itemDetails = settings.itemPrices.find(p => p.type === item.type);
            if (itemDetails && item.quantity > 0) {
                const itemTotalWeight = itemDetails.weight_kg * item.quantity;
                weight += itemTotalWeight;
                payment += itemTotalWeight * itemDetails.price_per_kg;
            }
        }
        return { totalWeight: weight, totalPayment: payment };
    }, [items, settings.itemPrices]);
    
    const handleItemChange = (index: number, field: 'type' | 'quantity', value: string | number) => {
        const newItems = [...items];
        if(field === 'quantity') {
            newItems[index][field] = Math.max(0, Number(value));
        } else {
            newItems[index][field] = value as string;
        }
        setItems(newItems);
    };

    const handleAddItem = () => {
        setItems([...items, { type: settings.itemPrices[0]?.type || '', quantity: 1 }]);
    };
    
    const handleRemoveItem = (index: number) => {
        if(items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };
    
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!currentUser || !selectedBinId) return;

        const bin = getBinById(selectedBinId);
        if (bin?.status === 'awaiting-pickup') {
            setFeedback('This bin is already awaiting pickup.');
            setTimeout(() => setFeedback(''), 3000);
            return;
        }

        const validItems = items.filter(item => item.type && item.quantity > 0);
        if(validItems.length === 0) {
             setFeedback('Please add at least one item with a quantity greater than zero.');
            setTimeout(() => setFeedback(''), 3000);
            return;
        }

        requestPickup({
            binId: selectedBinId,
            userId: currentUser.id,
            notes: notes || null,
            items: validItems,
        });

        setFeedback('Pickup requested successfully!');
        setNotes('');
        setItems([{ type: settings.itemPrices[0]?.type || '', quantity: 1 }]);
        
        const nextAvailableBin = bins.find(b => b.status !== 'awaiting-pickup');
        setSelectedBinId(nextAvailableBin?.id.toString() || '');
        
        setTimeout(() => setFeedback(''), 3000);
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700">
                <div className="flex items-center space-x-4 mb-8">
                    <div className="p-4 bg-emerald-500 rounded-3xl shadow-lg shadow-emerald-500/20">
                        <Truck className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Request a Pickup</h2>
                        <p className="text-gray-500">Submit a new e-waste collection request.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-2">
                        <label htmlFor="binSelect" className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Select Bin / Location</label>
                        <select 
                            id="binSelect" 
                            value={selectedBinId} 
                            onChange={(e) => setSelectedBinId(e.target.value)} 
                            required 
                            className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-lg"
                        >
                            {availableBins.length > 0 ? availableBins.map(bin => (
                                <option key={bin.id} value={bin.id}>{bin.name} — {bin.location}</option>
                            )) : (
                                <option disabled>All bins are currently awaiting pickup</option>
                            )}
                        </select>
                    </div>
                    
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">E-Waste Items</label>
                        <div className="space-y-4">
                            {items.map((item, index) => (
                                <motion.div 
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center space-x-3"
                                >
                                    <select 
                                        value={item.type} 
                                        onChange={(e) => handleItemChange(index, 'type', e.target.value)} 
                                        className="flex-grow px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                                    >
                                        {settings.itemPrices.map(priceItem => (
                                            <option key={priceItem.type} value={priceItem.type}>{priceItem.type}</option>
                                        ))}
                                    </select>
                                    <input 
                                        type="number" 
                                        value={item.quantity} 
                                        min="1" 
                                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} 
                                        className="w-24 px-4 py-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-center font-bold" 
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => handleRemoveItem(index)} 
                                        disabled={items.length === 1} 
                                        className="p-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl disabled:opacity-30 transition-colors"
                                    >
                                        <TrashIcon className="w-6 h-6" />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                        <button 
                            type="button" 
                            onClick={handleAddItem} 
                            className="flex items-center text-sm font-bold text-emerald-600 hover:text-emerald-500 transition-colors ml-1"
                        >
                            <span className="mr-2 text-xl">+</span> Add Another Item
                        </button>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="notes" className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Additional Notes (Optional)</label>
                        <textarea 
                            id="notes" 
                            value={notes} 
                            onChange={(e) => setNotes(e.target.value)} 
                            rows={3} 
                            placeholder="e.g., Bin is overflowing, please hurry." 
                            className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                        />
                    </div>

                    <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-[2rem] border border-emerald-100 dark:border-emerald-800/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-center sm:text-left">
                            <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Estimated Impact</p>
                            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{totalWeight.toFixed(2)} kg <span className="text-sm font-normal opacity-70">/ ₹{totalPayment.toFixed(0)}</span></p>
                        </div>
                        <button 
                            type="submit" 
                            disabled={availableBins.length === 0} 
                            className="w-full sm:w-auto px-10 py-4 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
                        >
                            <span>Submit Request</span>
                            <SendIcon className="w-5 h-5" />
                        </button>
                    </div>
                </form>

                <AnimatePresence>
                    {feedback && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mt-6 p-4 bg-emerald-500 text-white text-center font-bold rounded-2xl shadow-lg"
                        >
                            {feedback}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default RequestPickupView;
