
interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: 'blue' | 'green' | 'yellow' | 'emerald' | 'purple';
}

const colorClasses = {
    blue: 'from-blue-500 to-blue-400',
    green: 'from-green-500 to-green-400',
    yellow: 'from-yellow-500 to-yellow-400',
    emerald: 'from-emerald-500 to-emerald-400',
    purple: 'from-purple-500 to-purple-400',
};

const StatCard = ({ title, value, icon, color }: StatCardProps) => {
    return (
        <div className={`bg-gradient-to-br ${colorClasses[color]} text-white p-6 rounded-xl shadow-lg`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-lg font-medium opacity-80">{title}</p>
                    <p className="text-4xl font-bold">{value}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default StatCard;