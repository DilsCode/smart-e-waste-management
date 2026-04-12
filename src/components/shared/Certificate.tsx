
import { Award, Download, Share2, ShieldCheck } from 'lucide-react';
import { User } from '../../types';

interface CertificateProps {
  user: User;
  totalWeight: number;
}

export const Certificate = ({ user, totalWeight }: CertificateProps) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border-8 border-emerald-500/20 shadow-2xl max-w-2xl mx-auto relative overflow-hidden print:border-none print:shadow-none">
      {/* Decorative Elements */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-emerald-500 p-4 rounded-full shadow-lg shadow-emerald-500/40">
            <Award className="w-12 h-12 text-white" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white uppercase tracking-widest">Certificate of Impact</h1>
          <p className="text-emerald-600 dark:text-emerald-400 font-semibold tracking-widest uppercase text-sm">EcoConnect Campus Recycling Program</p>
        </div>

        <div className="py-8 border-y-2 border-emerald-100 dark:border-emerald-800/50">
          <p className="text-gray-500 dark:text-gray-400 italic">This is to certify that</p>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white my-2">{user.name}</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
            has successfully contributed to the campus sustainability goals by responsibly recycling 
            <span className="font-bold text-emerald-600 dark:text-emerald-400 mx-1">{totalWeight.toFixed(1)} kg</span> 
            of electronic waste.
          </p>
        </div>

        <div className="flex justify-between items-end pt-8">
          <div className="text-left">
            <div className="w-32 h-px bg-gray-400 mb-2" />
            <p className="text-[10px] font-bold text-gray-400 uppercase">Program Director</p>
          </div>
          
          <div className="flex flex-col items-center">
            <ShieldCheck className="w-12 h-12 text-emerald-500/30 mb-2" />
            <p className="text-[8px] text-gray-400 font-mono">VERIFIED ID: {user.id}-{Date.now().toString(36).toUpperCase()}</p>
          </div>

          <div className="text-right">
            <div className="w-32 h-px bg-gray-400 mb-2" />
            <p className="text-[10px] font-bold text-gray-400 uppercase">Date Issued: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons (Hidden during print) */}
      <div className="mt-8 flex justify-center space-x-4 print:hidden">
        <button 
          onClick={handlePrint}
          className="flex items-center px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/30"
        >
          <Download className="w-5 h-5 mr-2" />
          Download PDF
        </button>
        <button className="flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
          <Share2 className="w-5 h-5 mr-2" />
          Share Impact
        </button>
      </div>
    </div>
  );
};
