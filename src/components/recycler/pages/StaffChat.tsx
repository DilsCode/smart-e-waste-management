
import { useState, useMemo, useEffect, useRef } from 'react';
import { useData } from '../../../context/DataContext';
import { MessageSquare, Send, User, CheckCheck } from 'lucide-react';

const StaffChat = () => {
  const { state, sendMessage } = useData();
  const { pickups = [], messages = [], currentUser = null, users = [] } = state || {};
  
  const [selectedPickupId, setSelectedPickupId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getStaffName = (pickupId: string) => {
    if (pickupId === 'general_coordination') return 'General Support';
    const pickup = pickups.find(p => p.id === pickupId);
    if (!pickup) return 'Staff Member';
    
    if (pickup.requester_id) {
       const staff = users.find(u => u.id === pickup.requester_id);
       if (staff) return staff.name;
    }
    
    return 'Campus Staff';
  };

  const activePickups = useMemo(() => {
    if (!currentUser) return [];
    const list = pickups.filter(p => p.recycler_id === currentUser.id && (p.status === 'accepted' || p.status === 'pending'));
    
    // Add a virtual pickup for general coordination if it doesn't represent a real pickup id
    return list;
  }, [pickups, currentUser]);

  const chatList = useMemo(() => {
    const base = activePickups.map(p => ({
      id: p.id,
      name: getStaffName(p.id),
      subtext: `Pickup ID: ${p.id}`,
      type: 'pickup'
    }));

    return [
      { id: 'general_coordination', name: 'General Support', subtext: 'Campus Coordination', type: 'general' },
      ...base
    ];
  }, [activePickups]);

  const currentMessages = useMemo(() => {
    if (!selectedPickupId) return [];
    return messages
      .filter(m => m.pickup_id === selectedPickupId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [messages, selectedPickupId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedPickupId || !currentUser) return;

    await sendMessage({
      pickup_id: selectedPickupId,
      sender_id: currentUser.id,
      sender_role: currentUser.role,
      content: input.trim()
    });

    setInput('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[650px] bg-gray-50 dark:bg-gray-950 p-2 rounded-[2.5rem]">
      {/* Pickup List / Sidebar */}
      <div className="lg:col-span-1 bg-white dark:bg-gray-900 rounded-[2rem] shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col">
        <div className="p-6 border-b dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Messages</h3>
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500">Coordinate with campus staff</p>
        </div>

        <div className="flex-grow overflow-y-auto p-3 space-y-2 custom-scrollbar">
          {chatList.map(item => {
            const isSelected = selectedPickupId === item.id;
            const lastMsg = messages.filter(m => m.pickup_id === item.id).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
            
            return (
              <button
                key={item.id}
                onClick={() => setSelectedPickupId(item.id)}
                className={`w-full p-4 rounded-[1.5rem] text-left transition-all relative ${
                  isSelected 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-400'
                }`}
              >
                <div className="flex items-center justify-between space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold flex-shrink-0 ${
                    isSelected ? 'bg-white/20' : 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600'
                  }`}>
                    {item.name.charAt(0)}
                  </div>
                  <div className="flex-grow overflow-hidden">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm truncate">{item.name}</span>
                      {lastMsg && (
                        <span className={`text-[9px] ${isSelected ? 'text-white/70' : 'text-gray-400'}`}>
                          {new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <div className={`text-[10px] mt-0.5 truncate ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                      {lastMsg ? lastMsg.content : item.subtext}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
          {chatList.length === 0 && (
            <div className="text-center py-10 px-4">
              <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-xs text-gray-500 font-medium">No active pickups for chat. Accept a pickup to start communicating.</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-[2rem] shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col relative">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat"></div>
        
        {selectedPickupId ? (
          <>
            {/* Chat Header */}
            <div className="px-6 py-4 border-b dark:border-gray-800 flex items-center justify-between bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-10">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white leading-tight">{getStaffName(selectedPickupId)}</h3>
                  <div className="flex items-center mt-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-2"></div>
                    <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest leading-none">Campus Staff • Online</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar relative z-0" style={{ backgroundImage: 'url("https://w0.peakpx.com/wallpaper/818/148/HD-wallpaper-whatsapp-background-dark-pattern-thumbnail.jpg")', backgroundSize: '400px' }}>
              <div className="absolute inset-0 bg-gray-50/90 dark:bg-gray-950/95 pointer-events-none"></div>
              <div className="relative z-10 space-y-6">
                {currentMessages.length > 0 ? (
                  currentMessages.map((msg, idx) => {
                    const isMe = msg.sender_id === currentUser?.id;
                    const showDate = idx === 0 || new Date(currentMessages[idx-1].timestamp).toDateString() !== new Date(msg.timestamp).toDateString();
                    
                    return (
                      <div key={msg.id} className="space-y-4">
                        {showDate && (
                          <div className="flex justify-center my-4">
                            <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-[9px] font-bold text-gray-400 dark:text-gray-500 tracking-wider shadow-sm border border-gray-100 dark:border-gray-700">
                              {new Date(msg.timestamp).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        )}
                        <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                          <div className={`max-w-[85%] group ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                            <div className={`p-3 px-4 rounded-2xl shadow-md relative ${
                              isMe 
                                ? 'bg-[#005c4b] text-white rounded-tr-none' 
                                : 'bg-white dark:bg-[#202c33] text-gray-800 dark:text-[#e9edef] border border-gray-100 dark:border-gray-700/30 rounded-tl-none'
                            }`}>
                              {/* Bubble Tail */}
                              <div className={`absolute top-0 w-3 h-3 ${isMe ? '-right-1 bg-[#005c4b] transform rotate-45' : '-left-1 bg-white dark:bg-[#202c33] transform rotate-45'} -z-10`}></div>
                              
                              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                              <div className="flex items-center justify-end space-x-1 mt-1">
                                <span className={`text-[9px] opacity-70 ${isMe ? 'text-white' : 'text-gray-400'}`}>
                                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {isMe && <CheckCheck className="w-3 h-3 text-white/70" />}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-30 py-20">
                    <MessageSquare className="w-12 h-12 mb-4" />
                    <p className="text-sm font-medium">Start the conversation with campus staff</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 sm:p-6 border-t dark:border-gray-800 bg-white dark:bg-gray-900 z-10">
              <div className="relative flex items-center bg-gray-50 dark:bg-gray-800/50 rounded-[1.5rem] border border-gray-200 dark:border-gray-700 px-2 group focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 outline-none transition-all">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Message staff member..."
                  className="flex-grow bg-transparent px-4 py-4 dark:text-white outline-none text-sm"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all shadow-lg shadow-emerald-500/20"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center p-10 text-center bg-gray-50/30 dark:bg-gray-950/30">
            <div className="w-24 h-24 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-[2rem] flex items-center justify-center mb-6 animate-pulse">
              <MessageSquare className="w-10 h-10 text-emerald-500 opacity-60" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Connect with Campus Staff</h3>
            <p className="max-w-xs text-sm text-gray-500 leading-relaxed mb-8">
              Select a conversation from the sidebar to coordinate logistics, timing, and bin access with the campus management team.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
               <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 text-left">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-3">
                    <Send className="w-4 h-4 text-blue-600" />
                  </div>
                  <h4 className="text-xs font-bold mb-1">Direct Messaging</h4>
                  <p className="text-[10px] text-gray-400">Send real-time updates about your arrival or any delays.</p>
               </div>
               <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 text-left">
                  <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center mb-3">
                    <CheckCheck className="w-4 h-4 text-amber-600" />
                  </div>
                  <h4 className="text-xs font-bold mb-1">Pickup Confirmation</h4>
                  <p className="text-[10px] text-gray-400">Coordinate exactly where to meet and which bins to clear first.</p>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffChat;
