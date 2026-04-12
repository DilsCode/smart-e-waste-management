
import { useData } from '../../../context/DataContext';
import { PaymentIcon } from '../../shared/Icons';

const Payments = () => {
    const { state, getUserById } = useData();
    const { payments = [] } = state || {};

    const sortedPayments = [...payments].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold flex items-center">
                    <PaymentIcon className="w-7 h-7 mr-3 text-emerald-500" />
                    Payment Records
                </h1>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 border-b dark:border-gray-700">
                            <tr>
                                <th className="p-4 font-semibold">Date</th>
                                <th className="p-4 font-semibold">Recycler</th>
                                <th className="p-4 font-semibold">Amount</th>
                                <th className="p-4 font-semibold">Weight</th>
                                <th className="p-4 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-gray-700">
                            {sortedPayments.length > 0 ? (
                                sortedPayments.map((payment) => {
                                    const recycler = getUserById(payment.recycler_id);

                                    return (
                                        <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="p-4 text-sm whitespace-nowrap">
                                                {new Date(payment.timestamp).toLocaleString()}
                                            </td>
                                            <td className="p-4">
                                                <div className="font-medium">{recycler?.name || 'Unknown Recycler'}</div>
                                                <div className="text-xs text-gray-500">{recycler?.email}</div>
                                            </td>
                                            <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">
                                                ₹{payment.amount.toFixed(2)}
                                            </td>
                                            <td className="p-4">
                                                {payment.weight.toFixed(2)} kg
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                                                    payment.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                }`}>{payment.status}</span>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">
                                        No payment records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Payments;
