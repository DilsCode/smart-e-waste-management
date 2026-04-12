
import { useState } from 'react';
import { useData } from '../../../context/DataContext';
import { Bin } from '../../../types';
import BinFormModal from '../BinFormModal';
import ConfirmationModal from '../../shared/ConfirmationModal';
import { EditIcon, TrashIcon } from '../../shared/Icons';

const BinsManagement = () => {
    const { state, addBin, editBin, deleteBin, getUserById } = useData();
    const { bins = [] } = state || {};

    const [isFormModalOpen, setFormModalOpen] = useState(false);
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const [editingBin, setEditingBin] = useState<Bin | null>(null);
    const [deletingBinId, setDeletingBinId] = useState<string | null>(null);

    const handleOpenAddModal = () => {
        setEditingBin(null);
        setFormModalOpen(true);
    };

    const handleOpenEditModal = (bin: Bin) => {
        setEditingBin(bin);
        setFormModalOpen(true);
    };

    const handleOpenDeleteModal = (binId: string) => {
        setDeletingBinId(binId);
        setConfirmModalOpen(true);
    };

    const handleCloseModals = () => {
        setFormModalOpen(false);
        setConfirmModalOpen(false);
        setEditingBin(null);
        setDeletingBinId(null);
    };

    const handleSaveBin = (binData: Omit<Bin, 'id'> | Bin) => {
        if ('id' in binData) {
            editBin(binData);
        } else {
            addBin(binData);
        }
        handleCloseModals();
    };

    const handleConfirmDelete = () => {
        if (deletingBinId) {
            deleteBin({ binId: deletingBinId });
        }
        handleCloseModals();
    };
    
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Bins Management</h1>
                <button
                    onClick={handleOpenAddModal}
                    className="px-4 py-2 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors"
                >
                    Add New Bin
                </button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b dark:border-gray-700">
                        <tr>
                            <th className="p-3">Bin Name</th>
                            <th className="p-3">Location</th>
                            <th className="p-3">Fill Level</th>
                            <th className="p-3">Recycler</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bins.map(bin => {
                            const recycler = getUserById(bin.assigned_recycler_id);
                            return (
                                <tr key={bin.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="p-3 font-medium">{bin.name}</td>
                                    <td className="p-3 text-gray-600 dark:text-gray-400">{bin.location}</td>
                                    <td className="p-3">{bin.current_count} / {bin.capacity}</td>
                                    <td className="p-3 text-gray-600 dark:text-gray-400">{recycler?.name || 'N/A'}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                                            bin.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                        }`}>{bin.status.replace('-', ' ')}</span>
                                    </td>
                                    <td className="p-3 text-right">
                                        <button onClick={() => handleOpenEditModal(bin)} className="p-2 text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400">
                                            <EditIcon className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => handleOpenDeleteModal(bin.id)} className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400">
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <BinFormModal
                isOpen={isFormModalOpen}
                onClose={handleCloseModals}
                onSave={handleSaveBin}
                binToEdit={editingBin}
            />

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={handleCloseModals}
                onConfirm={handleConfirmDelete}
                title="Delete Bin"
                message={`Are you sure you want to delete this bin? This action cannot be undone.`}
                confirmText="Confirm Delete"
                confirmVariant="danger"
            />
        </div>
    );
};

export default BinsManagement;