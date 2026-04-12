
import { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { motion } from 'motion/react';
import { Trophy, Medal, Award, Star } from 'lucide-react';

const Leaderboard = () => {
  const { state } = useData();
  const { users = [], pickups = [] } = state || {};

  const rankings = useMemo(() => {
    const staffUsers = users.filter(u => u.role === 'staff');
    const stats = staffUsers.map(user => {
      const userPickups = pickups.filter(p => p.requester_id === user.id && p.status === 'completed');
      const totalWeight = userPickups.reduce((acc, p) => acc + p.estimated_weight, 0);
      return {
        ...user,
        totalWeight,
        pickupCount: userPickups.length,
        points: Math.round(totalWeight * 10) // 10 points per kg
      };
    });

    return stats.sort((a, b) => b.points - a.points);
  }, [users, pickups]);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-2xl">
          <Trophy className="w-8 h-8 text-amber-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recycling Leaderboard</h2>
          <p className="text-gray-500">Top contributors to a greener campus.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {rankings.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center p-6 rounded-2xl border transition-all ${
              index === 0 
                ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800' 
                : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'
            }`}
          >
            <div className="flex items-center justify-center w-12 h-12 mr-6">
              {index === 0 ? (
                <Trophy className="w-8 h-8 text-amber-500" />
              ) : index === 1 ? (
                <Medal className="w-8 h-8 text-gray-400" />
              ) : index === 2 ? (
                <Award className="w-8 h-8 text-orange-400" />
              ) : (
                <span className="text-xl font-bold text-gray-400">#{index + 1}</span>
              )}
            </div>

            <div className="flex-grow">
              <h4 className="font-bold text-gray-900 dark:text-white">{user.name}</h4>
              <p className="text-xs text-gray-500">{user.pickupCount} successful pickups</p>
            </div>

            <div className="text-right">
              <div className="flex items-center justify-end text-emerald-600 dark:text-emerald-400 font-bold text-xl">
                <Star className="w-5 h-5 mr-2 fill-current" />
                {user.points}
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Eco Points</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
