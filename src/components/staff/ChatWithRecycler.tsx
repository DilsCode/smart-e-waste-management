
import { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { MessageSquare, Send, Recycle, Clock } from 'lucide-react';

const ChatWithRecycler = () => {
  const { state, sendMessage } = useData();
  const { pickups = [], messages = [], currentUser = null, users = [] } = state || {};
  
  const [selectedPickupId, setSelectedPickupId] = useState<string | null>(null);
  const [input, setInput] = useState('');

  const activePickups = useMemo(() => {
    if (!currentUser) return [];
    return pickups.filter(p => p.requester_id === currentUser.id && (p.status === 'accepted' || p.status === 'pending'));
  }, [pickups, currentUser]);

  const currentMessages = useMemo(() => {
    if (!selectedPickupId) return [];
    return messages
      .filter(m => m.pickup_id === selectedPickupId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [messages, selectedPickupId]);

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

  const getRecyclerName = (pickupId: string) => {
    const pickup = pickups.find(p => p.id === pickupId);
    if (!pickup) return 'Recycler';
    const recycler = users.find(u => u.id === pickup.recycler_id);
    return recycler?.name || 'Recycler Partner';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Pickup List */}
      <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col">
        <div className="p-6 border-b dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center">
            <Clock className="w-5 h-5 mr-2 text-emerald-500" />
            Active Pickups
          </h3>
        </div>
        <div className="flex-grow overflow-y-auto p-4 space-y-3">
          {activePickups.length > 0 ? activePickups.map(pickup => (
            <button
              key={pickup.id}
              onClick={() => setSelectedPickupId(pickup.id)}
              className={`w-full p-4 rounded-2xl text-left transition-all border ${
                selectedPickupId === pickup.id 
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20' 
                  : 'bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 border-transparent hover:bg-gray-100'
              }`}
            >
              <div className="font-bold truncate">{getRecyclerName(pickup.id)}</div>
              <div className="text-[10px] opacity-70 uppercase tracking-widest mt-1">ID: {pickup.id}</div>
              <div className={`mt-2 inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                pickup.status === 'accepted' ? 'bg-white/20' : 'bg-amber-500/20 text-amber-500'
              }`}>
                {pickup.status}
              </div>
            </button>
          )) : (
            <div className="text-center py-10 text-gray-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-sm">No active pickups to chat about.</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col">
        {selectedPickupId ? (
          <>
            <div className="p-6 border-b dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                  <Recycle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{getRecyclerName(selectedPickupId)}</h3>
                  <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Recycler Partner</p>
                </div>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {currentMessages.map((msg) => {
                const isMe = msg.sender_id === currentUser?.id;
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl ${
                      isMe 
                        ? 'bg-emerald-500 text-white rounded-tr-none shadow-lg shadow-emerald-500/10' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none'
                    }`}>
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-[9px] mt-1 opacity-50 ${isMe ? 'text-right' : 'text-left'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSend} className="p-6 border-t dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full pl-6 pr-14 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="absolute right-2 p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/20"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-gray-400 p-10 text-center">
            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900/50 rounded-3xl flex items-center justify-center mb-6">
              <MessageSquare className="w-10 h-10 opacity-20" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Your Messages</h3>
            <p className="max-w-xs">Select an active pickup from the list to start chatting with the recycler partner.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWithRecycler;
