
import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { Send, Bot, User, Loader2, Trash2 } from 'lucide-react';
import Markdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AIDisposalAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your AI Disposal Assistant. Ask me anything about e-waste categories, safety guidelines, or how to handle specific items." }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: 'user', parts: [{ text: userMessage }] }
        ],
        config: {
          systemInstruction: "You are an expert E-Waste Disposal Assistant for a college campus. Provide safe, accurate, and concise advice on how to categorize, handle, and recycle electronic waste. If an item is hazardous (like bloated batteries), emphasize safety first. Keep responses professional and helpful.",
        }
      });

      const responseText = response.text || "I'm sorry, I couldn't generate a response. Please try again.";
      setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] glass-card overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b dark:border-gray-700 flex items-center justify-between bg-white/50 dark:bg-gray-900/50 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">AI Disposal Assistant</h3>
            <div className="flex items-center text-[10px] text-emerald-500 font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
              Online & Ready
            </div>
          </div>
        </div>
        <button 
          onClick={() => setMessages([messages[0]])}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          title="Clear Chat"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-6 space-y-6 scroll-smooth">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[80%] space-x-3 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm
                ${msg.role === 'user' ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'bg-emerald-500 text-white'}`}
              >
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed
                ${msg.role === 'user' 
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-tr-none' 
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm border dark:border-gray-700 rounded-tl-none'}`}
              >
                <div className="markdown-body">
                  <Markdown>{msg.content}</Markdown>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-tl-none shadow-sm border dark:border-gray-700">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 bg-white/50 dark:bg-gray-900/50 border-t dark:border-gray-700 backdrop-blur-md">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about e-waste disposal..."
            className="w-full pl-6 pr-14 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-inner"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/20"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-4 flex items-center justify-center space-x-4">
          <button 
            onClick={() => setInput("How to handle a bloated battery?")}
            className="text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-emerald-500 transition-colors"
          >
            Bloated Battery?
          </button>
          <span className="text-gray-300">|</span>
          <button 
            onClick={() => setInput("What is hazardous e-waste?")}
            className="text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-emerald-500 transition-colors"
          >
            Hazardous Waste?
          </button>
          <span className="text-gray-300">|</span>
          <button 
            onClick={() => setInput("Recycling CRT monitors?")}
            className="text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-emerald-500 transition-colors"
          >
            CRT Monitors?
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIDisposalAssistant;
