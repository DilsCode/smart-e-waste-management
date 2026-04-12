
import { Leaf, Droplets, Zap, TrendingUp } from 'lucide-react';

interface ImpactMetricProps {
  label: string;
  value: string;
  subtext: string;
  icon: React.ReactNode;
  color: string;
}

const ImpactMetric = ({ label, value, subtext, icon, color }: ImpactMetricProps) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
        {icon}
      </div>
      <div className="flex items-center text-emerald-500 text-sm font-semibold">
        <TrendingUp className="w-4 h-4 mr-1" />
        +12%
      </div>
    </div>
    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">{label}</h3>
    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
    <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">{subtext}</p>
  </div>
);

export const EnvironmentalImpact = ({ totalWeightKg }: { totalWeightKg: number }) => {
  // Constants for impact calculation (approximate)
  const co2Saved = (totalWeightKg * 1.5).toFixed(1); // 1.5kg CO2 per kg of e-waste
  const waterSaved = (totalWeightKg * 25).toFixed(0); // 25L water per kg
  const energySaved = (totalWeightKg * 8.4).toFixed(1); // 8.4 kWh per kg

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <ImpactMetric 
        label="CO2 Emission Reduced" 
        value={`${co2Saved} kg`} 
        subtext="Equivalent to planting 4 trees"
        icon={<Leaf className="w-6 h-6 text-emerald-500" />}
        color="bg-emerald-500"
      />
      <ImpactMetric 
        label="Water Conserved" 
        value={`${waterSaved} L`} 
        subtext="Equivalent to 120 showers"
        icon={<Droplets className="w-6 h-6 text-blue-500" />}
        color="bg-blue-500"
      />
      <ImpactMetric 
        label="Energy Recovered" 
        value={`${energySaved} kWh`} 
        subtext="Powers a laptop for 200 hours"
        icon={<Zap className="w-6 h-6 text-yellow-500" />}
        color="bg-yellow-500"
      />
    </div>
  );
};
