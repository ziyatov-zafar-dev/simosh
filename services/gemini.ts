
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Product, Language } from "../types";

export const getAIResponse = async (prompt: string, products: Product[], lang: Language, imageBase64?: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Create a localized products context
  const productsList = products.map(p => 
    `${p.name[lang]}: ${p.description[lang]} - Narxi: ${p.price} UZS`
  ).join('\n');
  
  const systemInstructions: Record<Language, string> = {
    uz: `Siz "Simosh" botanika atelyesining aqlli maslahatchisisiz. Faqat ushbu tabiiy mahsulotlar haqida gapiring: ${productsList}. Maqsad teringizni parvarish qilish bo'yicha eng yaxshi maslahatlarni berish. Faqat o'zbek tilida, nafis va professional tarzda javob bering.`,
    ru: `Вы интеллектуальный консультант ботанического ателье "Simosh". Говорите только об этих натуральных продуктах: ${productsList}. Ваша цель — дать лучшие советы по уходу за кожей. Отвечайте только на русском языке в изысканном и профессиональном стиле.`,
    en: `You are the smart advisor of "Simosh" botanical atelier. Speak only about these natural products: ${productsList}. Your goal is to provide the best skin care advice. Respond only in English in a sophisticated and professional tone.`,
    tr: `Siz "Simosh" botanik atölyesinin akıllı danışmanısınız. Sadece şu doğal ürünler hakkında konuşun: ${productsList}. Amacınız en iyi cilt bakımı tavsiyelerini vermektir. Sadece Türkçe, sofistike ve profesyonel bir üslupla cevap verin.`
  };

  try {
    const parts: any[] = [{ text: prompt }];
    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: imageBase64.split(',')[1]
        }
      });
    }

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts },
      config: {
        systemInstruction: systemInstructions[lang],
        temperature: 0.6,
      },
    });

    return response.text || "I am currently meditating on your request. Please try again shortly.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Uzr, xatolik yuz berdi. Iltimos, bir ozdan so'ng qayta urinib ko'ring.";
  }
};
