
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, ChevronLeft, ChevronRight, Layout, Recycle, Globe, Zap, 
  Map, Monitor, Cpu, TrendingUp, Users, ShieldCheck, Bot
} from 'lucide-react';

const slides = [
  {
    id: 1,
    title: "EcoConnect",
    subtitle: "Advanced Smart E-Waste Management & Analytics System",
    content: "An enterprise-grade platform transforming the way educational institutions manage electronic waste.",
    icon: <Globe className="w-20 h-20 text-emerald-500 mb-6" />,
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=1200",
    points: ["Modern UI/UX", "Real-time Tracking", "AI-Powered Assistance"]
  },
  {
    id: 2,
    title: "Part 1: The Problem",
    subtitle: "The Growing E-Waste Crisis",
    content: "Campuses produce massive amounts of electronic waste every year—old laptops, chargers, and batteries. Without a tracking system, this waste often ends up in general landfills.",
    icon: <Zap className="w-16 h-16 text-amber-500 mb-4" />,
    image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=1200",
    points: ["Environmental Toxicity", "Resource Depletion", "Lack of Disposition Awareness"]
  },
  {
    id: 3,
    title: "Part 2: The Solution",
    subtitle: "EcoConnect - A Smart Lifecycle Manager",
    content: "We bridge the gap between waste generators (Colleges) and waste collectors (Recyclers) through a centralized, intelligent portal.",
    icon: <Recycle className="w-16 h-16 text-emerald-500 mb-4" />,
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1200",
    points: ["Live Bin Monitoring", "Direct Recycler Communication", "Transparency & Accountability"]
  },
  {
    id: 4,
    title: "Key Stakeholders",
    subtitle: "One Platform, Three Crucial Roles",
    content: "EcoConnect is designed with specialized interfaces for all participants in the recycling chain.",
    icon: <Users className="w-16 h-16 text-blue-500 mb-4" />,
    points: [
      "Administration: System oversight and policy management.",
      "College Staff: Real-time reporting and day-to-day handling.",
      "Recyclers: Logistics optimization and inventory processing."
    ]
  },
  {
    id: 5,
    title: "The Staff Experience",
    subtitle: "Fast, Reliable, and AI-Guided",
    content: "Staff members can report full bins or request pickups with a single click. No more phone calls or paper trails.",
    icon: <Layout className="w-16 h-16 text-blue-400 mb-4" />,
    points: ["Real-time Bin Status Updates", "Pickup Order Tracking", "Integrated Staff Chat"]
  },
  {
    id: 6,
    title: "AI Disposal Assistant",
    subtitle: "Built with Google Gemini API",
    content: "Unsure if an item is hazardous? Our AI assistant provides instant guidance on how to safely dispose of complex electronics.",
    icon: <Bot className="w-16 h-16 text-purple-500 mb-4" />,
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd05a?auto=format&fit=crop&q=80&w=1200",
    points: ["Instant Waste Classification", "Safety Protocols Advisor", "Item-specific Recycling Tips"]
  },
  {
    id: 7,
    title: "The Recycler Portal",
    subtitle: "Efficiency through Optimization",
    content: "Partners can manage their entire fleet, track earnings, and see exactly what waste is waiting to be collected.",
    icon: <TruckIcon className="w-16 h-16 text-amber-500 mb-4" />,
    points: ["Inventory Management", "Earnings Analytics", "Live Request Feed"]
  },
  {
    id: 8,
    title: "Route Optimization",
    subtitle: "Reducing Carbon Footprint in Logistics",
    content: "Our system calculates the most efficient route for collectors, saving time and reducing fuel emissions.",
    icon: <Map className="w-16 h-16 text-blue-600 mb-4" />,
    image: "https://images.unsplash.com/photo-1526725359915-5fb69e235d24?auto=format&fit=crop&q=80&w=1200",
    points: ["Live Geo-tracking", "Time & Distance Estimation", "Optimized Fleet Dispatch"]
  },
  {
    id: 9,
    title: "Environmental Analytics",
    subtitle: "Measuring Real Impact",
    content: "We don't just recycle; we measure. EcoConnect tracks every kilogram and converts it into environmental impact metrics.",
    icon: <TrendingUp className="w-16 h-16 text-emerald-600 mb-4" />,
    points: ["CO2 Offset Calculation", "Water Conserved", "Energy Savings tracking"]
  },
  {
    id: 10,
    title: "Administrative Oversight",
    subtitle: "Control and Transparency",
    content: "College administrators gain a bird's-eye view of all sustainability efforts across multiple departments or campuses.",
    icon: <ShieldCheck className="w-16 h-16 text-emerald-700 mb-4" />,
    points: ["User Role Management", "Global Bin Distribution", "Verified Recycling Certificates"]
  },
  {
    id: 11,
    title: "System Architecture",
    subtitle: "Use Case Workflow",
    content: "1. Staff reports bin full. 2. Admin verifies or Auto-approves. 3. Recycler accepts. 4. Collection happens with live tracking.",
    icon: <Monitor className="w-16 h-16 text-gray-700 mb-4" />,
    points: ["Decentralized Reporting", "Centralized Management", "End-to-End Encryption"]
  },
  {
    id: 12,
    title: "Technical Stack",
    subtitle: "Modern Technologies for Modern Challenges",
    content: "Built with speed, security, and scalability in mind.",
    icon: <Cpu className="w-16 h-16 text-indigo-500 mb-4" />,
    points: [
      "Frontend: React 18 & Vite (Type-safe TS)",
      "Styling: Tailwind CSS V4 (Utility-first)",
      "Backend: Firebase (Real-time NoSQL)",
      "AI: Google Gemini API (LLM Integration)"
    ]
  },
  {
    id: 13,
    title: "Future Roadmap",
    subtitle: "Scaling Beyond the Campus",
    content: "The story doesn't end here. We aim to integrate hardware and rewards.",
    icon: <Zap className="w-16 h-16 text-amber-600 mb-4" />,
    points: ["IoT Load Sensors in Bins", "Mobile App for Student Rewards", "Blockchain-based Waste Auditing"]
  },
  {
    id: 14,
    title: "Conclusion",
    subtitle: "Building a Greener Future, One Bit at a Time",
    content: "EcoConnect is more than a tool; it's a commitment to sustainability through technology.",
    icon: <Globe className="w-20 h-20 text-emerald-500 mb-6" />,
    points: ["Sustainable Growth", "Zero Waste Commitment", "Questions & Feedback?"]
  }
];

function TruckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="1" y="3" width="15" height="13"></rect>
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
      <circle cx="5.5" cy="18.5" r="2.5"></circle>
      <circle cx="18.5" cy="18.5" r="2.5"></circle>
    </svg>
  );
}

export default function PresentationMode({ onClose }: { onClose: () => void }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) setCurrentSlide(prev => prev + 1);
  };

  const prevSlide = () => {
    if (currentSlide > 0) setCurrentSlide(prev => prev - 1);
  };

  const slide = slides[currentSlide];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-white dark:bg-gray-950 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b dark:border-gray-800">
        <div className="flex items-center space-x-3">
          <Recycle className="w-6 h-6 text-emerald-500" />
          <span className="font-bold text-lg tracking-tight">EcoConnect Presentation</span>
        </div>
        <div className="flex items-center space-x-6">
          <div className="text-sm font-bold text-gray-400">
            Slide {currentSlide + 1} of {slides.length}
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Slide Content */}
      <div className="flex-1 overflow-hidden relative flex items-center justify-center bg-gray-50 dark:bg-gray-900/30">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-full max-w-6xl p-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            {/* Slide Text Content */}
            <div className="space-y-8">
              <div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {slide.icon}
                </motion.div>
                <h3 className="text-emerald-500 font-bold uppercase tracking-[0.2em] text-sm mb-4">
                  {slide.subtitle}
                </h3>
                <h2 className="text-5xl sm:text-7xl font-bold text-gray-900 dark:text-white leading-tight font-heading">
                  {slide.title}
                </h2>
              </div>
              
              <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed font-light">
                {slide.content}
              </p>

              <div className="space-y-4 pt-6">
                {slide.points.map((point, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + (i * 0.1) }}
                    key={i} 
                    className="flex items-center space-x-4 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm"
                  >
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <span className="font-bold text-gray-700 dark:text-gray-200">{point}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Slide Visual Content */}
            <div className="hidden lg:block">
              {slide.image ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="relative rounded-[3rem] overflow-hidden shadow-2xl aspect-[4/3] border-8 border-white dark:border-gray-800"
                >
                  <img 
                    src={slide.image} 
                    alt="Visual" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 to-transparent" />
                </motion.div>
              ) : (
                <div className="grid grid-cols-2 gap-6 scale-110">
                  {[1, 2, 3, 4].map(n => (
                    <div key={n} className={`aspect-square rounded-3xl ${n % 2 === 0 ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-blue-500/10 border border-blue-500/20'} flex items-center justify-center`}>
                      <Layout className={`w-12 h-12 ${n % 2 === 0 ? 'text-emerald-500' : 'text-blue-500'} opacity-20`} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div className="p-8 border-t dark:border-gray-800 bg-white dark:bg-gray-950 flex items-center justify-between">
        <div className="flex space-x-2">
          {slides.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-12 bg-emerald-500' : 'w-3 bg-gray-200 dark:bg-gray-800'}`}
            />
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="flex items-center space-x-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-200 disabled:opacity-30 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>
          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="flex items-center space-x-2 px-10 py-3 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 shadow-xl shadow-emerald-500/20 disabled:opacity-30 transition-all active:scale-95"
          >
            <span>{currentSlide === slides.length - 1 ? 'End Presentation' : 'Next'}</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
