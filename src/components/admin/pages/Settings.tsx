
import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useData } from '../../../context/DataContext';
import { Settings as SettingsType } from '../../../types';

const Settings = () => {
    const { state, updateSettings } = useData();
    const [settings, setSettings] = useState<SettingsType>(state?.settings || { collegeName: '', adminEmail: '', itemPrices: [] });
    const [feedback, setFeedback] = useState('');

    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (state?.settings && !isInitialized) {
            setSettings(state.settings);
            setIsInitialized(true);
        }
    }, [state?.settings, isInitialized]);

    const handleGeneralChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handlePriceChange = (index: number, value: string) => {
        const newItems = [...settings.itemPrices];
        newItems[index] = { ...newItems[index], price_per_kg: Number(value) };
        setSettings(prev => ({ ...prev, itemPrices: newItems }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        updateSettings(settings);
        setFeedback('Settings saved successfully!');
        setTimeout(() => setFeedback(''), 3000);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold border-b dark:border-gray-700 pb-4 mb-4">General Settings</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="collegeName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">College Name</label>
                        <input
                            type="text"
                            id="collegeName"
                            name="collegeName"
                            value={settings.collegeName}
                            onChange={handleGeneralChange}
                            className="mt-1 w-full max-w-lg rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 focus:border-emerald-500 focus:ring-emerald-500"
                        />
                    </div>
                     <div>
                        <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Admin Contact Email</label>
                        <input
                            type="email"
                            id="adminEmail"
                            name="adminEmail"
                            value={settings.adminEmail}
                            onChange={handleGeneralChange}
                            className="mt-1 w-full max-w-lg rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 focus:border-emerald-500 focus:ring-emerald-500"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold border-b dark:border-gray-700 pb-4 mb-4">System Settings</h2>
                <h3 className="text-lg font-semibold mb-2">Waste Item Prices (per kg)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {settings.itemPrices.map((item, index) => (
                        <div key={item.type}>
                            <label htmlFor={`price-${item.type}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{item.type}</label>
                            <div className="relative mt-1">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <span className="text-gray-500 sm:text-sm">₹</span>
                                </div>
                                <input
                                    type="number"
                                    id={`price-${item.type}`}
                                    name={`price-${item.type}`}
                                    min="0"
                                    step="0.01"
                                    value={item.price_per_kg}
                                    onChange={e => handlePriceChange(index, e.target.value)}
                                    className="block w-full rounded-md border-gray-300 pl-7 pr-2 shadow-sm dark:bg-gray-700 dark:border-gray-600 focus:border-emerald-500 focus:ring-emerald-500"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end items-center space-x-4">
                {feedback && <p className="text-green-600 dark:text-green-400">{feedback}</p>}
                <button
                    type="submit"
                    className="px-6 py-2 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors"
                >
                    Save Settings
                </button>
            </div>
        </form>
    );
};

export default Settings;