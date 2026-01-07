import React, { useState, useRef, useEffect, useContext } from 'react';
import { Send, ImageIcon, Sparkles, User, Bot, Loader2, X, Camera } from 'lucide-react';
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
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
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

    const res = await getAIResponse(prompt || t.ai.analyzeImage, products, lang, img || undefined);
    setMessages(prev => [...prev, { role: 'ai', content: res }]);
    setLoading(false);
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 h-[80vh] flex flex-col pt-10">
      <div className="gradient-mint p-8 rounded-t-[3rem] flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-mint shadow-lg">
            <Sparkles size={24} />
          </div>
          <div className="text-white">
            <h2 className="text-2xl font-black leading-none">Simosh AI</h2>
            <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mt-1">Sizning yordamchingiz</p>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 bg-white dark:bg-brand-dark/30 overflow-y-auto p-8 space-y-8 border-x border-gray-100 dark:border-white/5">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md ${msg.role === 'user' ? 'bg-brand-dark text-white' : 'bg-brand-mint text-white'}`}>
                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div className={`p-6 rounded-[2rem] text-lg font-bold ${msg.role === 'user' ? 'bg-gray-100 dark:bg-white/10 text-brand-dark dark:text-white rounded-tr-none' : 'bg-brand-mint/10 text-brand-dark dark:text-white rounded-tl-none'}`}>
                {msg.image && <img src={msg.image} className="w-full max-h-64 object-cover rounded-2xl mb-4" />}
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {loading && <div className="text-brand-mint font-black animate-pulse uppercase tracking-widest text-xs">{t.ai.thinking}</div>}
      </div>

      <div className="bg-white dark:bg-brand-dark/50 p-6 rounded-b-[3rem] border border-gray-100 dark:border-white/5 shadow-2xl">
        <div className="flex items-center gap-4 bg-gray-100 dark:bg-white/10 p-2 rounded-full">
          <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleImage} />
          <button onClick={() => fileRef.current?.click()} className="p-4 text-gray-500 hover:text-brand-mint transition-colors">
            <Camera size={24} />
          </button>
          
          <div className="flex-1 relative">
            {selectedImage && (
              <div className="absolute -top-16 left-0 flex items-center gap-2 bg-white p-2 rounded-xl shadow-xl">
                <img src={selectedImage} className="w-10 h-10 object-cover rounded-lg" />
                <button onClick={() => setSelectedImage(null)} className="text-red-500"><X size={16} /></button>
              </div>
            )}
            <input 
              className="w-full bg-transparent px-4 py-3 outline-none font-bold text-gray-700 dark:text-white" 
              placeholder={t.ai.placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
          </div>

          <button 
            onClick={handleSend}
            disabled={loading || (!input && !selectedImage)}
            className="gradient-mint text-white p-4 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all disabled:opacity-20"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}