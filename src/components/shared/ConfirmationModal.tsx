
interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    confirmVariant?: 'primary' | 'danger';
}

const ConfirmationModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message,
    confirmText = 'Confirm',
    confirmVariant = 'danger'
}: ConfirmationModalProps) => {
    if (!isOpen) return null;

    const confirmButtonClasses = {
        primary: 'bg-emerald-600 hover:bg-emerald-700',
        danger: 'bg-red-600 hover:bg-red-700',
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md">
                <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">{message}</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-t dark:border-gray-700 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-white rounded-md ${confirmButtonClasses[confirmVariant]}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;