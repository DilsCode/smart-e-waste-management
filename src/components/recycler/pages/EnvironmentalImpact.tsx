
import { useMemo } from 'react';
import { useData } from '../../../context/DataContext';
import { motion } from 'motion/react';
import { Leaf, Droplets, Zap, Wind, ShieldCheck } from 'lucide-react';

const EnvironmentalImpact = () => {
  const { state } = useData();
  const { pickups = [], currentUser = null } = state || {};

  const impact = useMemo(() => {
    if (!currentUser) return { weight: 0, co2: 0, energy: 0, water: 0 };
    
    const myCompletedPickups = pickups.filter(p => p.status === 'completed');
    const weight = myCompletedPickups.reduce((acc, p) => acc + p.estimated_weight, 0);
    
    // Environmental impact coefficients (approximate)
    return {
      weight: Math.round(weight),
      co2: Math.round(weight * 1.44), // 1.44 kg CO2 per kg of e-waste
      energy: Math.round(weight * 2.5), // 2.5 kWh saved per kg
      water: Math.round(weight * 12) // 12 liters of water saved per kg
    };
  }, [pickups, currentUser]);

  const cards = [
    { title: 'CO2 Offset', value: `${impact.co2} kg`, icon: <Wind />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Energy Saved', value: `${impact.energy} kWh`, icon: <Zap />, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { title: 'Water Conserved', value: `${impact.water} L`, icon: <Droplets />, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { title: 'Toxic Waste Diverted', value: `${impact.weight} kg`, icon: <ShieldCheck />, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl">
          <Leaf className="w-8 h-8 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Environmental Impact</h2>
          <p className="text-gray-500">Your contribution to a sustainable future.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm flex items-center space-x-8"
          >
            <div className={`w-20 h-20 ${card.bg} ${card.color} rounded-3xl flex items-center justify-center`}>
              {card.icon}
            </div>
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{card.title}</p>
              <h3 className="text-4xl font-bold text-gray-900 dark:text-white mt-1">{card.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-emerald-500 p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl shadow-emerald-500/20">
        <div className="relative z-10 max-w-2xl">
          <h3 className="text-3xl font-bold mb-4">You're making a difference!</h3>
          <p className="text-emerald-50 opacity-90 text-lg leading-relaxed">
            By collecting and recycling {impact.weight} kg of e-waste, you've prevented hazardous materials like lead and mercury from entering our soil and water systems. Your efforts are equivalent to planting {Math.round(impact.co2 / 20)} trees!
          </p>
        </div>
        <Leaf className="absolute -bottom-10 -right-10 w-64 h-64 text-white/10 rotate-12" />
      </div>
    </div>
  );
};

export default EnvironmentalImpact;
