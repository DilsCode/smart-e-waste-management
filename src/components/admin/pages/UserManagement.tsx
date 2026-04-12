
import { useState } from 'react';
import { useData } from '../../../context/DataContext';
import { Role, User } from '../../../types';
import { EditIcon, TrashIcon } from '../../shared/Icons';
import UserFormModal from '../UserFormModal';
import ConfirmationModal from '../../shared/ConfirmationModal';

const UserManagement = () => {
    const { state, addUser, editUser, deleteUser } = useData();
    const { users = [] } = state || {};
    
    // Filter out the collector role from being displayed/edited
    const manageableUsers = users.filter(u => u.role !== Role.Admin);

    const [isFormModalOpen, setFormModalOpen] = useState(false);
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

    const handleOpenAddModal = () => {
        setEditingUser(null);
        setFormModalOpen(true);
    };

    const handleOpenEditModal = (user: User) => {
        setEditingUser(user);
        setFormModalOpen(true);
    };

    const handleOpenDeleteModal = (userId: string) => {
        setDeletingUserId(userId);
        setConfirmModalOpen(true);
    };

    const handleCloseModals = () => {
        setFormModalOpen(false);
        setConfirmModalOpen(false);
        setEditingUser(null);
        setDeletingUserId(null);
    };

    const handleSaveUser = (userData: Omit<User, 'id'> | User) => {
        if ('id' in userData) {
            editUser(userData);
        } else {
            addUser(userData);
        }
        handleCloseModals();
    };

    const handleConfirmDelete = () => {
        if (deletingUserId) {
            deleteUser({ userId: deletingUserId });
        }
        handleCloseModals();
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">User Management</h1>
                <button
                    onClick={handleOpenAddModal}
                    className="px-4 py-2 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors"
                >
                    Add New User
                </button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b dark:border-gray-700">
                        <tr>
                            <th className="p-3">Name</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Role</th>
                            <th className="p-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {manageableUsers.map(user => (
                            <tr key={user.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="p-3 font-medium">{user.name}</td>
                                <td className="p-3 text-gray-600 dark:text-gray-400">{user.email}</td>
                                <td className="p-3">
                                    <span className="px-2 py-1 text-xs font-semibold rounded-full capitalize bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-3 text-right">
                                    <button onClick={() => handleOpenEditModal(user)} className="p-2 text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400">
                                        <EditIcon className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => handleOpenDeleteModal(user.id)} className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <UserFormModal
                isOpen={isFormModalOpen}
                onClose={handleCloseModals}
                onSave={handleSaveUser}
                userToEdit={editingUser}
            />

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={handleCloseModals}
                onConfirm={handleConfirmDelete}
                title="Delete User"
                message={`Are you sure you want to delete this user? This action cannot be undone.`}
                confirmText="Confirm Delete"
                confirmVariant="danger"
            />
        </div>
    );
};

export default UserManagement;