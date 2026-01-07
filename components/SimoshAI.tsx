
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
    <div className="pt-40 pb-20 max-w-5xl mx-auto px-6 h-screen flex flex-col">
      <div className="bg-atelier-accent p-10 rounded-t-[50px] flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-atelier-light rounded-2xl flex items-center justify-center text-atelier-accent">
            <Sparkles size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-atelier-light serif-italic italic">Simosh AI</h2>
            <p className="text-atelier-light/60 text-xs font-bold uppercase tracking-widest">Botanical Consultant</p>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 bg-atelier-paper dark:bg-atelier-dark/40 overflow-y-auto p-8 sm:p-12 space-y-10 border-x border-atelier-accent/5">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-6 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${msg.role === 'user' ? 'bg-atelier-accent text-white' : 'bg-atelier-paper dark:bg-atelier-accent/20 text-atelier-accent'}`}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={`space-y-4 ${msg.role === 'user' ? 'text-right' : ''}`}>
                <div className={`p-8 rounded-[32px] text-lg leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-atelier-accent text-white rounded-tr-none' : 'bg-white dark:bg-atelier-accent/10 border border-atelier-accent/5 rounded-tl-none font-serif'}`}>
                  {msg.image && <img src={msg.image} className="w-full max-h-64 object-cover rounded-2xl mb-4 border border-atelier-accent/10" />}
                  {msg.content}
                </div>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-4 items-center opacity-40 italic">
            <Loader2 className="animate-spin" size={18} /> {t.ai.thinking}
          </div>
        )}
      </div>

      <div className="bg-atelier-paper dark:bg-atelier-dark p-6 rounded-b-[50px] border border-atelier-accent/5 shadow-2xl">
        <div className="relative flex items-center gap-4 bg-white dark:bg-atelier-accent/10 p-3 rounded-full border border-atelier-accent/10 shadow-inner">
          <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleImage} />
          <button onClick={() => fileRef.current?.click()} className="p-4 hover:bg-atelier-paper dark:hover:bg-atelier-dark rounded-full transition-all text-atelier-accent">
            <Camera size={24} />
          </button>
          
          <div className="flex-1 relative">
            {selectedImage && (
              <div className="absolute -top-20 left-0 animate-in zoom-in-75">
                <img src={selectedImage} className="w-16 h-16 object-cover rounded-xl border-4 border-white shadow-xl" />
                <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"><X size={10} /></button>
              </div>
            )}
            <input 
              className="w-full bg-transparent px-4 py-3 outline-none font-bold text-lg" 
              placeholder={t.ai.placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
          </div>

          <button 
            onClick={handleSend}
            disabled={loading || (!input && !selectedImage)}
            className="bg-atelier-accent text-white p-4 rounded-full hover:scale-110 active:scale-95 transition-all shadow-xl disabled:opacity-20"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
