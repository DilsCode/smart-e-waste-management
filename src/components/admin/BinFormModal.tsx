import { useState, useEffect, useMemo } from 'react';
import { Bin, Role } from '../../types';
import { X } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface BinFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (binData: Omit<Bin, 'id'> | Bin) => void;
    binToEdit: Bin | null;
}

const BinFormModal = ({ isOpen, onClose, onSave, binToEdit }: BinFormModalProps) => {
    const { state } = useData();
    const recyclers = useMemo(() => state.users.filter(u => u.role === Role.Recycler), [state.users]);

    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [capacity, setCapacity] = useState(10);
    const [qrCode, setQrCode] = useState('');
    const [assignedRecyclerId, setAssignedRecyclerId] = useState('');

    const [hasSetDefaultRecycler, setHasSetDefaultRecycler] = useState(false);

    const BIN_NAME_OPTIONS = [
        "Library Entrance",
        "Cafeteria",
        "Student Union",
        "Engineering Block A",
        "Engineering Block B",
        "Science Lab",
        "Admin Building",
        "Main Gate",
        "Hostel Block 1",
        "Hostel Block 2",
        "Sports Complex",
        "Auditorium",
        "IT Center",
        "Medical Room",
        "Placement Cell",
        "Workshop Area",
        "Research Wing"
    ];

    const LOCATION_OPTIONS = [
        "Ground Floor, Reception",
        "1st Floor, Corridor",
        "2nd Floor, Near Elevator",
        "Basement, Parking",
        "Main Entrance",
        "Rear Exit",
        "Near Canteen",
        "Central Plaza",
        "North Wing, Room 102",
        "South Wing, Room 205",
        "East Gate, Security Post",
        "West Gate, Near ATM"
    ];

    const CAPACITY_OPTIONS = [5, 10, 15, 20, 25, 30, 40, 50];

    useEffect(() => {
        if (isOpen) {
            if (binToEdit) {
                setName(binToEdit.name);
                setLocation(binToEdit.location);
                setCapacity(binToEdit.capacity);
                setQrCode(binToEdit.qr_code);
                setAssignedRecyclerId(binToEdit.assigned_recycler_id);
            } else {
                setName(BIN_NAME_OPTIONS[0]);
                setLocation(LOCATION_OPTIONS[0]);
                setCapacity(CAPACITY_OPTIONS[1]); // Default 10
                setQrCode(`BIN${Math.floor(Math.random() * 1000)}`);
                // Don't set assignedRecyclerId here, let the other effect handle it
            }
            setHasSetDefaultRecycler(false);
        }
    }, [binToEdit, isOpen]);

    // Separate effect to handle default recycler assignment when list loads
    useEffect(() => {
        if (isOpen && !binToEdit && !hasSetDefaultRecycler && recyclers.length > 0) {
            console.log("Setting default recycler:", recyclers[0].id);
            setAssignedRecyclerId(recyclers[0].id);
            setHasSetDefaultRecycler(true);
        }
    }, [isOpen, binToEdit, recyclers, hasSetDefaultRecycler]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!assignedRecyclerId) {
            alert("Please assign a recycler to this bin.");
            return;
        }

        const binData = {
            name,
            location,
            capacity,
            assigned_recycler_id: assignedRecyclerId,
        };

        if (binToEdit) {
            onSave({ ...binToEdit, ...binData, qr_code: qrCode, last_updated: new Date().toISOString() });
        } else {
            onSave({ 
                ...binData,
                current_count: 0, 
                qr_code: qrCode, 
                status: 'active',
                last_updated: new Date().toISOString()
            } as Omit<Bin, 'id'>);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
                    <h2 className="text-xl font-bold">{binToEdit ? 'Edit Bin' : 'Add New Bin'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">Bin Name (Section)</label>
                        <select
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/20 transition-all"
                        >
                            {BIN_NAME_OPTIONS.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">Location</label>
                        <select
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/20 transition-all"
                        >
                            {LOCATION_OPTIONS.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">Capacity (kg)</label>
                            <select
                                value={capacity}
                                onChange={(e) => setCapacity(Number(e.target.value))}
                                required
                                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/20 transition-all"
                            >
                                {CAPACITY_OPTIONS.map(opt => (
                                    <option key={opt} value={opt}>{opt} kg</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">QR Code</label>
                            <input
                                type="text"
                                value={qrCode}
                                onChange={(e) => setQrCode(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/20 transition-all"
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">Assigned Recycler</label>
                        <select
                            value={assignedRecyclerId}
                            onChange={(e) => setAssignedRecyclerId(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/20 transition-all"
                        >
                            <option value="">Select Recycler</option>
                            {recyclers.map(r => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
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
                            {binToEdit ? 'Save Changes' : 'Create Bin'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BinFormModal;
