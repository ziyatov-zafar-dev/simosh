
import React, { useState, useRef, useEffect, useContext } from 'react';
import { Send, Sparkles, User, Bot, X, Camera, Loader2 } from 'lucide-react';
import { getAIResponse } from '../services/gemini';
import { Product } from '../types';
import { LanguageContext } from '../App';

interface Message {
  role: 'user' | 'ai';
  content: string;
  image?: string;
}

export default function SimoshAI({ products }: { products: Product[] }) {
  const { lang, t } = useContext(LanguageContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMessages([{ role: 'ai', content: t.ai.welcome }]);
  }, [t]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return;
    const userMsg: Message = { role: 'user', content: input, image: selectedImage || undefined };
    setMessages(prev => [...prev, userMsg]);
    const prompt = input;
    const img = selectedImage;
    setInput('');
    setSelectedImage(null);
    setLoading(true);

    const res = await getAIResponse(prompt || "Ushbu mahsulot haqida ma'lumot bering", products, lang, img || undefined);
    setMessages(prev => [...prev, { role: 'ai', content: res }]);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto h-[75vh] flex flex-col p-4">
      <div className="bg-brand-dark rounded-t-[2.5rem] p-6 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 gradient-mint rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="text-white">
            <h2 className="text-2xl font-black leading-none uppercase">Simosh AI</h2>
            <p className="text-brand-mint text-[10px] font-black uppercase tracking-widest mt-1">Aqlli Botanika Maslahatchisi</p>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 bg-white dark:bg-white/5 overflow-y-auto p-6 space-y-6 border-x border-gray-100 dark:border-white/5">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md ${msg.role === 'user' ? 'bg-brand-dark text-white' : 'gradient-mint text-white'}`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-5 rounded-[2rem] text-sm font-bold leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-gray-100 dark:bg-brand-dark/50 text-brand-dark dark:text-white rounded-tr-none' : 'bg-brand-mint/10 text-brand-dark dark:text-white rounded-tl-none border border-brand-mint/20'}`}>
                {msg.image && <img src={msg.image} className="w-full max-h-64 object-cover rounded-2xl mb-4 shadow-lg" alt="AI Context" />}
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-brand-mint font-black animate-pulse uppercase tracking-widest text-xs">
            <Loader2 className="animate-spin" size={14} /> O'ylayapman...
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-white/5 p-6 rounded-b-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl">
        <div className="flex items-center gap-4 bg-gray-100 dark:bg-white/5 p-2 rounded-2xl relative">
          <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => setSelectedImage(reader.result as string);
              reader.readAsDataURL(file);
            }
          }} />
          
          <button onClick={() => fileRef.current?.click()} className={`p-4 rounded-xl transition-all shrink-0 ${selectedImage ? 'bg-brand-mint text-white' : 'text-gray-400 hover:text-brand-mint'}`}>
            <Camera size={24} />
          </button>

          {selectedImage && (
            <div className="absolute -top-16 left-4 flex items-center gap-2 bg-white dark:bg-brand-dark p-2 rounded-lg shadow-xl border border-brand-mint/30 z-10 animate-in slide-in-from-bottom-5">
              <img src={selectedImage} className="w-10 h-10 object-cover rounded-md" />
              <button onClick={() => setSelectedImage(null)} className="text-red-500 p-1"><X size={14} /></button>
            </div>
          )}

          <input 
            className="flex-1 bg-transparent px-4 py-3 outline-none font-bold text-brand-dark dark:text-white" 
            placeholder="Savolingizni yozing..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />

          <button 
            onClick={handleSend}
            disabled={loading || (!input && !selectedImage)}
            className="gradient-mint text-white p-4 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-20 shrink-0"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
