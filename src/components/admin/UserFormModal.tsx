import { useState, useEffect } from 'react';
import { Role, User } from '../../types';
import { X } from 'lucide-react';

interface UserFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (userData: Omit<User, 'id'> | User) => void;
    userToEdit: User | null;
}

const UserFormModal = ({ isOpen, onClose, onSave, userToEdit }: UserFormModalProps) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<Role>(Role.Staff);

    useEffect(() => {
        if (userToEdit) {
            setName(userToEdit.name);
            setEmail(userToEdit.email);
            setRole(userToEdit.role);
        } else {
            setName('');
            setEmail('');
            setRole(Role.Staff);
        }
    }, [userToEdit, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (userToEdit) {
            onSave({ ...userToEdit, name, email, role });
        } else {
            onSave({ name, email, role });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
                    <h2 className="text-xl font-bold">{userToEdit ? 'Edit User' : 'Add New User'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/20 transition-all"
                            placeholder="Enter full name"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/20 transition-all"
                            placeholder="Enter email address"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value as Role)}
                            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/20 transition-all"
                        >
                            <option value={Role.Staff}>Staff</option>
                            <option value={Role.Recycler}>Recycler</option>
                            <option value={Role.Admin}>Admin</option>
                        </select>
                    </div>
                    
                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all"
                        >
                            {userToEdit ? 'Save Changes' : 'Create User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserFormModal;
