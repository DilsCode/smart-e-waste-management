
import { useState } from 'react';
import { Trophy, Medal, Award, User, Download } from 'lucide-react';
import { User as UserType } from '../../types';
import ImpactCertificate from './ImpactCertificate';
import { useData } from '../../context/DataContext';

interface LeaderboardProps {
  users: UserType[];
  contributions: Record<string, number>; // userId -> weightRecycled
}

export const Leaderboard = ({ users, contributions }: LeaderboardProps) => {
  const { state } = useData();
  const [showCertificate, setShowCertificate] = useState(false);
  
  const sortedUsers = [...users]
    .filter(u => contributions[u.id] > 0)
    .sort((a, b) => (contributions[b.id] || 0) - (contributions[a.id] || 0))
    .slice(0, 5);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 1: return <Medal className="w-6 h-6 text-gray-400" />;
      case 2: return <Award className="w-6 h-6 text-amber-600" />;
      default: return <span className="text-lg font-bold text-gray-400">#{index + 1}</span>;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="p-6 border-b dark:border-gray-700 flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Eco-Warrior Leaderboard</h2>
          {state?.currentUser && contributions[state.currentUser.id] > 0 && (
            <button 
              onClick={() => setShowCertificate(true)}
              className="mt-2 flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              <Download className="w-3 h-3 mr-1" />
              Download My Impact Certificate
            </button>
          )}
        </div>
        <Trophy className="w-5 h-5 text-yellow-500" />
      </div>

      {showCertificate && state?.currentUser && (
        <ImpactCertificate 
          userId={state.currentUser.id} 
          weight={contributions[state.currentUser.id] || 0}
          onClose={() => setShowCertificate(false)} 
        />
      )}
      <div className="divide-y dark:divide-gray-700">
        {sortedUsers.length > 0 ? sortedUsers.map((user, index) => (
          <div key={user.id} className="p-4 flex items-center space-x-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
              {getRankIcon(index)}
            </div>
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <User className="w-6 h-6" />
              </div>
            </div>
            <div className="flex-grow">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{contributions[user.id].toFixed(1)} kg</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Recycled</p>
            </div>
          </div>
        )) : (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No contributions yet. Be the first!
          </div>
        )}
      </div>
    </div>
  );
};
