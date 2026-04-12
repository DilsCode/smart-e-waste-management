
import { useState, useMemo } from 'react';
import { useData } from '../../../context/DataContext';
import { Pickup, Bin } from '../../../types';
import { LocationMarkerIcon, CheckCircleIcon } from '../../shared/Icons';
import ConfirmationModal from '../../shared/ConfirmationModal';

const PickupCard = ({ pickup, bin, requesterName, onComplete, onAccept }: { 
    pickup: Pickup, 
    bin?: Bin, 
    requesterName: string, 
    onComplete: (id: string) => void,
    onAccept: (id: string) => void 
}) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow border dark:border-gray-700 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
            <div>
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-green-800 dark:text-green-300">{bin?.name || 'Unknown Bin'}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                        pickup.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                        pickup.status === 'accepted' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>{pickup.status}</span>
                </div>
                <p className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <LocationMarkerIcon className="w-4 h-4 mr-2 text-gray-400" />
                    {bin?.location}
                </p>
                <div className="space-y-2 text-sm border-t dark:border-gray-700 pt-3 mt-3">
                    <p><strong>Requested by:</strong> {requesterName}</p>
                    <p><strong>Request Time:</strong> {new Date(pickup.request_time).toLocaleString()}</p>
                    <p><strong>Est. Weight:</strong> {pickup.estimated_weight.toFixed(2)} kg</p>
                    <p><strong>Est. Payment:</strong> ₹{pickup.estimated_payment.toFixed(2)}</p>
                    {pickup.completed_at && <p><strong>Completed:</strong> {new Date(pickup.completed_at).toLocaleString()}</p>}
                    {pickup.notes && <p className="p-2 bg-gray-100 dark:bg-gray-700/50 rounded-md mt-2 italic"><strong>Notes:</strong> "{pickup.notes}"</p>}
                </div>
            </div>
            {pickup.status === 'pending' && (
                <button
                    onClick={() => onAccept(pickup.id)}
                    className="w-full flex items-center justify-center px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors duration-300"
                >
                    <CheckCircleIcon className="w-5 h-5 mr-2" />
                    Accept Request
                </button>
            )}
            {pickup.status === 'accepted' && (
                <button
                    onClick={() => onComplete(pickup.id)}
                    className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors duration-300"
                >
                    <CheckCircleIcon className="w-5 h-5 mr-2" />
                    Mark as Collected
                </button>
            )}
        </div>
    );
};

const PickupsManagement = () => {
    const { state, completePickup, acceptPickup, getUserById, getBinById } = useData();
    const { currentUser, pickups = [] } = state || {};
    const [activeTab, setActiveTab] = useState('pending');
    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; pickupId: string | null }>({ isOpen: false, pickupId: null });

    const myPickups = useMemo(() => {
        if (!currentUser) return [];
        // In this demo, we show all pickups to any logged-in recycler to avoid ID mismatch issues
        // with temporary accounts. In a production app, we would filter strictly by recycler_id.
        return pickups.sort((a, b) => new Date(b.request_time).getTime() - new Date(a.request_time).getTime());
    }, [pickups]);

    const pendingPickups = myPickups.filter(p => p.status === 'pending' || p.status === 'accepted');
    const completedPickups = myPickups.filter(p => p.status === 'completed');

    const handleOpenConfirm = (id: string) => {
        setConfirmModal({ isOpen: true, pickupId: id });
    };

    const handleConfirmComplete = () => {
        if (confirmModal.pickupId) {
            completePickup({ pickupId: confirmModal.pickupId });
        }
        setConfirmModal({ isOpen: false, pickupId: null });
    };

    const handleAccept = (id: string) => {
        acceptPickup({ pickupId: id });
    };

    const pickupsToDisplay = activeTab === 'pending' ? pendingPickups : completedPickups;

    return (
         <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-6">
            <h1 className="text-2xl font-bold">Pickup Management</h1>
            <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button onClick={() => setActiveTab('pending')} className={`px-4 py-2 font-semibold ${activeTab === 'pending' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}>Active Requests ({pendingPickups.length})</button>
                <button onClick={() => setActiveTab('completed')} className={`px-4 py-2 font-semibold ${activeTab === 'completed' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}>Completed History ({completedPickups.length})</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {pickupsToDisplay.length > 0 ? (
                    pickupsToDisplay.map(p => {
                        const requester = p.requester_id ? getUserById(p.requester_id) : null;
                        const requesterName = requester ? requester.name : 'Auto-triggered';
                        return <PickupCard key={p.id} pickup={p} bin={getBinById(p.bin_id)} requesterName={requesterName} onComplete={handleOpenConfirm} onAccept={handleAccept} />
                    })
                ) : (
                    <p className="col-span-full text-center text-gray-500 dark:text-gray-400 p-4">No {activeTab} pickups to show.</p>
                )}
            </div>
            
            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, pickupId: null })}
                onConfirm={handleConfirmComplete}
                title="Confirm Collection"
                message="Are you sure you have collected the items from this bin? This will reset the bin's status."
                confirmText="Yes, Collected"
                confirmVariant="primary"
            />
        </div>
    );
};

export default PickupsManagement;