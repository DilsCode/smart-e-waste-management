
import { useState } from 'react';
import { useData } from '../../../context/DataContext';
import { Pickup } from '../../../types';
import ConfirmationModal from '../../shared/ConfirmationModal';
import { CheckCircleIcon, ClockIcon, TrashIcon } from '../../shared/Icons';

const PickupsManagement = () => {
    const { state, completePickup, deletePickup, getBinById, getUserById } = useData();
    const { pickups = [] } = state || {};

    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const [selectedPickup, setSelectedPickup] = useState<Pickup | null>(null);

    const pendingPickups = pickups.filter(p => p.status === 'pending' || p.status === 'accepted');
    const completedPickups = pickups.filter(p => p.status === 'completed').sort((a,b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime());

    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [pickupToDelete, setPickupToDelete] = useState<Pickup | null>(null);

    const handleOpenDeleteModal = (pickup: Pickup) => {
        setPickupToDelete(pickup);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (pickupToDelete) {
            deletePickup({ pickupId: pickupToDelete.id });
        }
        setDeleteModalOpen(false);
        setPickupToDelete(null);
    };

    const handleOpenCompleteModal = (pickup: Pickup) => {
        setSelectedPickup(pickup);
        setConfirmModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedPickup(null);
        setConfirmModalOpen(false);
    };

    const handleConfirmComplete = () => {
        if (selectedPickup) {
            completePickup({ pickupId: selectedPickup.id });
        }
        handleCloseModal();
    };

    const PickupTable = ({ pickupList, isPending }: { pickupList: Pickup[], isPending: boolean }) => (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="border-b dark:border-gray-700">
                    <tr>
                        <th className="p-3">Bin</th>
                        <th className="p-3">Recycler</th>
                        <th className="p-3">Requested By</th>
                        <th className="p-3">Request Time</th>
                        {!isPending && <th className="p-3">Completed At</th>}
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {pickupList.map(pickup => {
                        const bin = getBinById(pickup.bin_id);
                        const recycler = getUserById(pickup.recycler_id);
                        const requester = pickup.requester_id ? getUserById(pickup.requester_id) : null;
                        const requesterName = requester ? requester.name : 'Auto-triggered';

                        return (
                            <tr key={pickup.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="p-3 font-medium">{bin?.name || 'N/A'}</td>
                                <td className="p-3 text-gray-600 dark:text-gray-400">{recycler?.name || 'N/A'}</td>
                                <td className="p-3 text-gray-600 dark:text-gray-400">{requesterName}</td>
                                <td className="p-3 text-sm">{new Date(pickup.request_time).toLocaleString()}</td>
                                {!isPending && <td className="p-3 text-sm">{pickup.completed_at ? new Date(pickup.completed_at).toLocaleString() : 'N/A'}</td>}
                                <td className="p-3">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                                        pickup.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                        pickup.status === 'accepted' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    }`}>{pickup.status}</span>
                                </td>
                                <td className="p-3 text-right flex justify-end gap-2">
                                    {isPending && (
                                        <button
                                            onClick={() => handleOpenCompleteModal(pickup)}
                                            className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 flex items-center"
                                        >
                                            <CheckCircleIcon className="w-4 h-4 mr-1" />
                                            Complete
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleOpenDeleteModal(pickup)}
                                        className="text-xs font-semibold text-red-600 hover:text-red-800 flex items-center"
                                    >
                                        <TrashIcon className="w-4 h-4 mr-1" />
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold flex items-center mb-4">
                    <ClockIcon className="w-7 h-7 mr-3 text-yellow-500" />
                    Pending Pickups ({pendingPickups.length})
                </h2>
                {pendingPickups.length > 0 ? (
                    <PickupTable pickupList={pendingPickups} isPending={true} />
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">No pending pickups at the moment.</p>
                )}
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold flex items-center mb-4">
                    <CheckCircleIcon className="w-7 h-7 mr-3 text-green-500" />
                    Completed Pickups ({completedPickups.length})
                </h2>
                {completedPickups.length > 0 ? (
                    <PickupTable pickupList={completedPickups} isPending={false} />
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">No pickups have been completed yet.</p>
                )}
            </div>

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmComplete}
                title="Complete Pickup"
                message={`Are you sure you want to mark this pickup as completed? The bin will be reset.`}
                confirmText="Mark Completed"
                confirmVariant="primary"
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Pickup Request"
                message={`Are you sure you want to delete this pickup request? This action cannot be undone.`}
                confirmText="Delete Request"
                confirmVariant="danger"
            />
        </div>
    );
};

export default PickupsManagement;