
import React, { useState, useRef, useEffect, useContext } from 'react';
import { Send, Sparkles, User, Bot, X, Camera, Image as ImageIcon } from 'lucide-react';
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

    const res = await getAIResponse(prompt || "Analyze this image botanical context", products, lang, img || undefined);
    setMessages(prev => [...prev, { role: 'ai', content: res }]);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto h-[90vh] flex flex-col p-6 md:p-12">
      <div className="mb-10 flex items-end justify-between border-b-2 border-simosh-moss/10 pb-6">
        <div>
          <h1 className="serif-title text-7xl italic text-simosh-moss">Simosh <span className="text-simosh-clay">AI</span></h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mt-2">Botanical Assistant 01.A</p>
        </div>
        <div className="w-16 h-16 bg-simosh-moss rounded-full flex items-center justify-center text-simosh-paper shadow-2xl animate-pulse">
           <Sparkles size={24} />
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-10 pr-6 custom-scroll">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] space-y-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`flex items-center gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                 <span className="text-[10px] font-black uppercase tracking-widest opacity-30">{msg.role}</span>
                 <div className={`w-1.5 h-1.5 rounded-full ${msg.role === 'user' ? 'bg-simosh-clay' : 'bg-simosh-moss'}`} />
              </div>
              <div className={`p-8 rounded-[3rem] text-lg font-medium leading-relaxed ${msg.role === 'user' ? 'bg-simosh-ink text-white rounded-tr-none' : 'bg-white border border-black/5 text-simosh-moss rounded-tl-none shadow-sm'}`}>
                {msg.image && <img src={msg.image} className="w-full max-h-64 object-cover rounded-2xl mb-6 grayscale" alt="Uploaded" />}
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {loading && <div className="text-[10px] font-black uppercase tracking-[0.4em] text-simosh-clay animate-pulse">Connecting to botanical core...</div>}
      </div>

      <div className="mt-10 bg-white p-4 rounded-full shadow-2xl border border-black/5 flex items-center gap-4">
        <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setSelectedImage(reader.result as string);
            reader.readAsDataURL(file);
          }
        }} />
        
        <button onClick={() => fileRef.current?.click()} className={`p-4 rounded-full transition-all ${selectedImage ? 'bg-simosh-clay text-white' : 'hover:bg-gray-100'}`}>
          <Camera size={24} />
        </button>

        <div className="flex-1 relative">
           {selectedImage && (
             <div className="absolute -top-24 left-0 bg-white p-2 rounded-2xl shadow-2xl border border-black/5 flex items-center gap-2">
                <img src={selectedImage} className="w-12 h-12 object-cover rounded-lg" />
                <button onClick={() => setSelectedImage(null)} className="text-red-400 p-1"><X size={16} /></button>
             </div>
           )}
           <input 
             className="w-full bg-transparent px-4 outline-none font-bold text-lg" 
             placeholder={t.ai.placeholder}
             value={input}
             onChange={e => setInput(e.target.value)}
             onKeyDown={e => e.key === 'Enter' && handleSend()}
           />
        </div>

        <button onClick={handleSend} disabled={loading || (!input && !selectedImage)} className="bg-simosh-moss text-white p-5 rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-20">
          <Send size={24} />
        </button>
      </div>
    </div>
  );
}
