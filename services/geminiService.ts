
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const CACHE_KEY_INSPIRATION = 'cached_inspiration_v1';
const CACHE_KEY_CHALLENGE = 'cached_challenge_v1';
const CACHE_KEY_DATE = 'cached_gemini_date';

const isToday = (dateString: string | null) => {
  if (!dateString) return false;
  const today = new Date().toISOString().split('T')[0];
  return dateString === today;
};

export const getDailyInspiration = async () => {
  const cachedDate = localStorage.getItem(CACHE_KEY_DATE);
  const cachedData = localStorage.getItem(CACHE_KEY_INSPIRATION);

  if (isToday(cachedDate) && cachedData) {
    return cachedData;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "أعطني رسالة إيمانية محفزة قصيرة جداً وبسيطة لليوم، بأسلوب مباشر وهادئ، باللغة العربية، بدون زخرفة زائدة أو رموز تعبيرية كثيرة.",
      config: {
        systemInstruction: "أنت مساعد إيماني في تطبيق 'رحلتي إلى الجنة'. هدفك نشر التفاؤل والسكينة بكلمات بسيطة وقريبة من القلب وغير معقدة.",
        temperature: 0.7,
      },
    });
    
    const text = response.text?.trim() || "استعن بالله ولا تعجز. سَيَجْعَلُ اللَّهُ بَعْدَ عُسْرٍ يُسْرًا.";
    localStorage.setItem(CACHE_KEY_INSPIRATION, text);
    localStorage.setItem(CACHE_KEY_DATE, new Date().toISOString().split('T')[0]);
    return text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return cachedData || "استعن بالله ولا تعجز. سَيَجْعَلُ اللَّهُ بَعْدَ عُسْرٍ يُسْرًا.";
  }
};

export const generateDailyChallenge = async (userPoints: number) => {
  const cachedDate = localStorage.getItem(CACHE_KEY_DATE);
  const cachedData = localStorage.getItem(CACHE_KEY_CHALLENGE);

  if (isToday(cachedDate) && cachedData) {
    try {
      return JSON.parse(cachedData);
    } catch (e) {
      console.error("Error parsing cached challenge");
    }
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `اقترح تحدي عبادة يومي بسيط (مثل سنة مهجورة، عمل صالح، ذكر محدد) لمستخدم رصيده ${userPoints} نقطة. التحدي يجب أن يكون محدداً وقابلاً للتنفيذ اليوم.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            points: { type: Type.NUMBER },
          },
          required: ["title", "description", "points"],
        },
      }
    });
    
    const jsonStr = response.text?.trim() || "{}";
    const data = JSON.parse(jsonStr);
    localStorage.setItem(CACHE_KEY_CHALLENGE, jsonStr);
    localStorage.setItem(CACHE_KEY_DATE, new Date().toISOString().split('T')[0]);
    return data;
  } catch (error) {
    console.error("Gemini Daily Challenge Error:", error);
    if (cachedData) return JSON.parse(cachedData);
    return {
      title: "إفشاء السلام",
      description: "سلم على 10 أشخاص اليوم من معارفك أو الغرباء بنية السنة.",
      points: 100
    };
  }
};
