
import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { LogoIcon } from './Icons';
import { Role } from '../../types';
import { LogIn, Mail, Lock, AlertTriangle, ShieldCheck, UserCircle, Recycle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Login = () => {
  const { login } = useData();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await login(email, selectedRole || undefined, name);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const resetSelection = () => {
    setSelectedRole(null);
    setName('');
    setEmail('');
    setPassword('');
    setError(null);
  };

  const roleInfo = {
    [Role.Admin]: {
      title: 'Administration',
      icon: <ShieldCheck className="w-10 h-10 text-white" />,
      color: 'bg-emerald-500',
      hoverColor: 'hover:bg-emerald-600',
      shadowColor: 'shadow-emerald-500/20',
      desc: 'System oversight, user management, and global settings.',
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=800'
    },
    [Role.Staff]: {
      title: 'College Staff',
      icon: <UserCircle className="w-10 h-10 text-white" />,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      shadowColor: 'shadow-blue-500/20',
      desc: 'Bin monitoring, pickup requests, and AI assistance.',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800'
    },
    [Role.Recycler]: {
      title: 'Recycler Partner',
      icon: <Recycle className="w-10 h-10 text-white" />,
      color: 'bg-amber-500',
      hoverColor: 'hover:bg-amber-600',
      shadowColor: 'shadow-amber-500/20',
      desc: 'Route optimization, inventory, and earnings tracking.',
      image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800'
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl relative z-10"
      >
        <AnimatePresence mode="wait">
          {!selectedRole ? (
            /* Step 1: Role Selection */
            <motion.div
              key="role-selection"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <motion.div 
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="inline-flex items-center space-x-3 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20 mb-4"
                >
                  <LogoIcon className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Sustainability First</span>
                </motion.div>
                <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white tracking-tight font-heading leading-tight">
                  Welcome to <span className="text-emerald-600">EcoConnect</span>
                </h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg sm:text-xl">
                  The intelligent e-waste management portal for modern campuses. Select your role to begin.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {(Object.keys(roleInfo) as Role[]).map((role, index) => (
                  <motion.div
                    key={role}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <button
                      onClick={() => setSelectedRole(role)}
                      className="group relative w-full text-left bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                    >
                      {/* Role Image */}
                      <div className="h-48 relative overflow-hidden">
                        <img 
                          src={roleInfo[role].image} 
                          alt={roleInfo[role].title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        <div className={`absolute bottom-4 left-6 p-3 ${roleInfo[role].color} rounded-2xl shadow-lg`}>
                          {roleInfo[role].icon}
                        </div>
                      </div>

                      {/* Role Content */}
                      <div className="p-8 space-y-3">
                        <h4 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                          {roleInfo[role].title}
                        </h4>
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                          {roleInfo[role].desc}
                        </p>
                        <div className="pt-4 flex items-center text-emerald-600 font-bold text-sm">
                          <span>Enter Portal</span>
                          <LogIn className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            /* Step 2: Manual Login Form */
            <motion.div
              key="login-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-5xl mx-auto flex flex-col md:flex-row bg-white dark:bg-gray-900 rounded-[3rem] overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800"
            >
              {/* Left Side: Visual */}
              <div className="hidden md:block md:w-1/2 relative">
                <img 
                  src={roleInfo[selectedRole].image} 
                  alt="Login Visual"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${selectedRole === Role.Admin ? 'from-emerald-600/80' : selectedRole === Role.Staff ? 'from-blue-600/80' : 'from-amber-600/80'} to-transparent mix-blend-multiply`} />
                <div className="absolute inset-0 p-12 flex flex-col justify-end text-white">
                  <h3 className="text-4xl font-bold mb-4">{roleInfo[selectedRole].title}</h3>
                  <p className="text-lg opacity-90 leading-relaxed max-w-sm">
                    Access your specialized dashboard to manage e-waste efficiently and contribute to a greener campus.
                  </p>
                </div>
              </div>

              {/* Right Side: Form */}
              <div className="w-full md:w-1/2 p-8 sm:p-16 space-y-8">
                <button
                  onClick={resetSelection}
                  className="flex items-center text-sm font-bold text-gray-400 hover:text-emerald-600 transition-colors group"
                >
                  <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                  Back to Selection
                </button>

                <div className="space-y-2">
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                    Sign In
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">Please enter your details to continue.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative group">
                      <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Zeeshan"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Password</label>
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-500 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl flex items-center text-red-600 dark:text-red-400 text-sm"
                    >
                      <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0" />
                      {error}
                    </motion.div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-5 ${roleInfo[selectedRole].color} text-white font-bold rounded-2xl ${roleInfo[selectedRole].hoverColor} shadow-xl ${roleInfo[selectedRole].shadowColor} transition-all flex items-center justify-center space-x-3 disabled:opacity-70 text-lg`}
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Access Portal</span>
                        <LogIn className="w-6 h-6" />
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Login;
