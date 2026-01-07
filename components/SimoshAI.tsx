
import React, { useState, useRef, useEffect, useContext } from 'react';
import { Send, Image as ImageIcon, Sparkles, User, Bot, Loader2, X, Leaf } from 'lucide-react';
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
  
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: t.ai.welcome }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return;

    const userMessage: Message = { role: 'user', content: input, image: selectedImage || undefined };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    const currentImage = selectedImage;
    setSelectedImage(null);
    setLoading(true);

    const response = await getAIResponse(input || t.ai.analyzeImage, products, lang, currentImage || undefined);
    
    setMessages(prev => [...prev, { role: 'ai', content: response }]);
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-32 h-[1000px] flex flex-col animate-in fade-in zoom-in-95 duration-1000">
      <div className="bg-atelier-900 p-16 rounded-t-[100px] shadow-luxury flex items-center justify-between border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="flex items-center gap-10 relative z-10">
          <div className="w-24 h-24 bg-accent-500 rounded-[40px] flex items-center justify-center text-atelier-900 shadow-luxury">
            <Sparkles size={40} className="animate-pulse" />
          </div>
          <div>
            <h2 className="text-5xl font-black text-white tracking-tighter font-serif italic">Atelier Core AI</h2>
            <div className="flex items-center gap-4 mt-2">
              <span className="w-3 h-3 bg-accent-500 rounded-full animate-ping" />
              <p className="text-[12px] text-accent-500 font-black uppercase tracking-[0.5em]">Cognitive Essence Ready</p>
            </div>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-4 bg-white/5 border border-white/10 px-8 py-4 rounded-full text-white/40 text-[11px] font-black uppercase tracking-[0.3em] relative z-10">
          <Leaf size={16} /> Neural Synthesis
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 bg-white dark:bg-atelier-950 border-x border-atelier-100 dark:border-atelier-800 overflow-y-auto p-12 sm:p-24 space-y-16 scroll-smooth"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-6 duration-700`}>
            <div className={`flex gap-8 max-w-[85%] sm:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-16 h-16 rounded-[28px] flex items-center justify-center shrink-0 shadow-premium ${
                msg.role === 'user' ? 'bg-atelier-900 text-white' : 'bg-atelier-100 dark:bg-atelier-800 text-accent-500'
              }`}>
                {msg.role === 'user' ? <User size={28} /> : <Bot size={28} />}
              </div>
              <div className={`space-y-6 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`p-10 rounded-[64px] shadow-premium ${
                  msg.role === 'user' 
                    ? 'bg-atelier-900 text-white rounded-tr-none' 
                    : 'bg-white dark:bg-atelier-800/40 text-atelier-900 dark:text-atelier-50 font-serif italic text-2xl leading-relaxed rounded-tl-none border border-atelier-100 dark:border-atelier-800'
                }`}>
                  {msg.image && (
                    <img src={msg.image} className="max-w-full h-80 object-cover rounded-[48px] mb-8 border border-white/10 shadow-luxury" alt="Visual Asset" />
                  )}
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-atelier-100 dark:bg-atelier-800 p-12 rounded-[64px] rounded-tl-none flex items-center gap-8 border border-atelier-200 dark:border-atelier-800 shadow-premium">
              <Loader2 className="animate-spin text-accent-500" size={40} />
              <span className="text-[14px] font-black text-atelier-900/20 dark:text-atelier-500 uppercase tracking-[0.5em]">{t.ai.thinking}</span>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-atelier-950 border border-atelier-100 dark:border-atelier-800 p-10 rounded-b-[100px] shadow-luxury transition-all">
        <div className="relative flex items-end gap-6 bg-atelier-50 dark:bg-atelier-800/60 p-6 rounded-[56px] border border-atelier-100 dark:border-atelier-800 focus-within:ring-4 focus-within:ring-atelier-900/10 transition-all duration-700">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/*" 
            className="hidden" 
          />
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-6 text-atelier-900/20 dark:text-atelier-500 hover:text-accent-500 hover:bg-white dark:hover:bg-atelier-800 rounded-[32px] transition-all shadow-glass"
          >
            <ImageIcon size={36} />
          </button>

          <div className="flex-1 min-h-[80px] flex flex-col justify-center px-4">
            {selectedImage && (
              <div className="mb-6 relative inline-block animate-in zoom-in-50 duration-500">
                <img src={selectedImage} className="w-28 h-28 object-cover rounded-[40px] border-4 border-white dark:border-atelier-800 shadow-luxury" alt="Upload Preview" />
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-4 -right-4 bg-atelier-900 text-white rounded-full p-2.5 shadow-luxury hover:scale-110 transition-transform"
                >
                  <X size={18} />
                </button>
              </div>
            )}
            <input 
              className="w-full bg-transparent outline-none font-bold text-2xl text-atelier-900 dark:text-atelier-50 placeholder:text-atelier-900/20 dark:placeholder:text-atelier-400/20"
              placeholder={t.ai.placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
          </div>

          <button 
            onClick={handleSend}
            disabled={loading || (!input && !selectedImage)}
            className="bg-atelier-900 dark:bg-accent-500 text-white dark:text-atelier-900 p-7 rounded-full hover:scale-110 transition-all disabled:opacity-20 shadow-luxury"
          >
            <Send size={36} />
          </button>
        </div>
      </div>
    </div>
  );
}
