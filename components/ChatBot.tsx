'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, User, Loader2, Radio } from 'lucide-react';
import { getSecurityInsights } from '@/services/gemini';
import { ChatMessage } from '@/types';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Welcome to InFraX. I'm your Market Intelligence assistant. How can I help clarify your infrastructure strategy today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    const aiResponse = await getSecurityInsights(userMsg);
    
    setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    setIsLoading(false);
  };

  return (
    <div className={`fixed z-[100] transition-all duration-300 ${isOpen ? 'inset-0 sm:inset-auto sm:bottom-6 sm:right-6' : 'bottom-4 right-4 md:bottom-6 md:right-6'}`}>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 md:w-16 md:h-16 bg-[#000d1a] hover:bg-navy rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-105 border border-[#f37021]/30"
        >
          <Radio className="w-7 h-7 md:w-8 md:h-8 text-[#f37021]" />
        </button>
      )}

      {isOpen && (
        <div className="w-full h-full sm:w-[400px] sm:h-[600px] sm:max-h-[85vh] bg-white sm:rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 sm:zoom-in duration-200">
          {/* Header */}
          <div className="p-4 md:p-5 bg-navy flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <Radio className="w-6 h-6 text-[#f37021]" />
              </div>
              <div>
                <div className="text-sm md:text-base font-bold">InFraX Advisor</div>
                <div className="text-[10px] text-[#f37021] font-bold uppercase tracking-widest flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#f37021] animate-pulse" />
                  Signal Live
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 -mr-2 text-white/70 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] sm:max-w-[85%] flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-[#f37021]' : 'bg-navy'}`}>
                    {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                  </div>
                  <div className={`p-3 md:p-4 rounded-2xl text-sm md:text-base leading-relaxed ${msg.role === 'user' ? 'bg-[#f37021] text-white rounded-tr-none' : 'bg-white text-navy rounded-tl-none border border-slate-200 shadow-sm'}`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start items-center gap-2 px-2 text-slate-400 italic text-xs md:text-sm">
                <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin" />
                Processing signal...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 md:p-6 border-t border-slate-200 bg-white pb-safe">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Query market intelligence..."
                className="flex-1 border border-slate-200 rounded-lg px-4 py-3 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#f37021] transition-all"
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="w-12 h-12 md:w-auto md:px-6 bg-navy hover:bg-slate-800 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
              >
                <Send className="w-5 h-5 md:w-4 md:h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}