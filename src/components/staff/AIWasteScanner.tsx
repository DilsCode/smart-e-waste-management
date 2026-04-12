
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { Camera, Loader2, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

const AIWasteScanner = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const base64Data = image.split(',')[1];
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: [
          {
            inlineData: {
              data: base64Data,
              mimeType: "image/jpeg",
            },
          },
          {
            text: "Identify this e-waste item. Provide a JSON response with: 'name', 'category', 'estimated_weight_kg', 'recycling_value_estimate_in_rupees', 'disposal_instructions', and 'is_hazardous' (boolean). Be concise.",
          },
        ],
      });

      const resultText = response.text;
      if (!resultText) throw new Error("No response from AI");
      
      const jsonMatch = resultText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        setResult(JSON.parse(jsonMatch[0]));
      } else {
        throw new Error("Could not parse AI response");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to analyze image. Please try again with a clearer photo.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Sparkles className="w-6 h-6 text-emerald-500 mr-2" />
            AI Waste Scanner
          </h2>
          <p className="text-gray-500 dark:text-gray-400">Identify and categorize e-waste using AI Vision</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-4">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`relative aspect-video rounded-3xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center
              ${image ? 'border-emerald-500/50' : 'border-gray-300 dark:border-gray-700 hover:border-emerald-500/50 bg-gray-50 dark:bg-gray-900/50'}`}
          >
            {image ? (
              <>
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <p className="text-white font-bold flex items-center">
                    <Camera className="w-5 h-5 mr-2" />
                    Change Photo
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center space-y-4 p-8">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto">
                  <Camera className="w-8 h-8 text-emerald-500" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">Click to capture or upload</p>
                  <p className="text-sm text-gray-500">Take a clear photo of the e-waste item</p>
                </div>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
              capture="environment"
            />
          </div>

          <button
            disabled={!image || isAnalyzing}
            onClick={analyzeImage}
            className="w-full btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed py-4"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Analyze Waste Item
              </>
            )}
          </button>
        </div>

        {/* Results Section */}
        <div className="glass-card p-8 min-h-[300px] flex flex-col">
          <AnimatePresence mode="wait">
            {isAnalyzing ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-grow flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-emerald-500/20 rounded-full animate-ping"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-emerald-500 animate-pulse" />
                  </div>
                </div>
                <p className="text-gray-500 font-medium">Scanning pixels for e-waste signatures...</p>
              </motion.div>
            ) : result ? (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{result.name}</h3>
                    <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full uppercase tracking-wider">
                      {result.category}
                    </span>
                  </div>
                  {result.is_hazardous && (
                    <div className="flex items-center text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-lg">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      <span className="text-xs font-bold">Hazardous</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Est. Weight</p>
                    <p className="text-xl font-bold">{result.estimated_weight_kg} kg</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Recycling Value</p>
                    <p className="text-xl font-bold text-emerald-500">₹{result.recycling_value_estimate_in_rupees}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" />
                    Disposal Instructions
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {result.disposal_instructions}
                  </p>
                </div>

                <button 
                  onClick={() => setResult(null)}
                  className="w-full py-3 text-sm font-bold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Scan Another Item
                </button>
              </motion.div>
            ) : error ? (
              <motion.div 
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-grow flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <p className="text-red-500 font-bold">{error}</p>
                <button onClick={() => setError(null)} className="text-sm font-bold underline">Try Again</button>
              </motion.div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-center space-y-4 text-gray-400">
                <div className="w-16 h-16 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8" />
                </div>
                <p className="text-sm font-medium">Upload a photo to see AI analysis results here</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AIWasteScanner;
