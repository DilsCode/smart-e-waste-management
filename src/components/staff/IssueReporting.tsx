
import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { motion } from 'motion/react';
import { AlertTriangle, Send, CheckCircle2 } from 'lucide-react';

const IssueReporting = () => {
  const { state, reportIssue } = useData();
  const { bins = [], currentUser = null } = state || {};
  
  const [selectedBinId, setSelectedBinId] = useState(bins[0]?.id || '');
  const [issueType, setIssueType] = useState<'damage' | 'overflow' | 'misplaced' | 'other'>('overflow');
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    await reportIssue({
      bin_id: selectedBinId,
      reporter_id: currentUser.id,
      issue_type: issueType,
      description
    });

    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setDescription('');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-2xl">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Report Bin Issue</h2>
          <p className="text-gray-500">Help us maintain the recycling infrastructure.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Select Bin</label>
          <select
            value={selectedBinId}
            onChange={(e) => setSelectedBinId(e.target.value)}
            className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
          >
            {bins.map(bin => (
              <option key={bin.id} value={bin.id}>{bin.name} ({bin.location})</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Issue Type</label>
          <div className="grid grid-cols-2 gap-3">
            {(['damage', 'overflow', 'misplaced', 'other'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setIssueType(type)}
                className={`py-3 px-4 rounded-xl border font-bold text-sm capitalize transition-all ${
                  issueType === type 
                    ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20' 
                    : 'bg-gray-50 dark:bg-gray-900/50 text-gray-500 border-gray-200 dark:border-gray-700 hover:bg-gray-100'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue in detail..."
            required
            rows={4}
            className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full py-4 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 shadow-xl shadow-red-500/20 transition-all flex items-center justify-center space-x-3"
        >
          {isSubmitted ? (
            <>
              <CheckCircle2 className="w-6 h-6" />
              <span>Reported Successfully!</span>
            </>
          ) : (
            <>
              <Send className="w-6 h-6" />
              <span>Submit Report</span>
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
};

export default IssueReporting;
