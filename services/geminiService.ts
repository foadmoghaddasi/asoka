import { GoogleGenAI, Modality, Type } from "@google/genai";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to decode base64 string to Uint8Array
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Text Generation: Daily Tips
export const generateDailyTip = async (): Promise<{ title: string; content: string }> => {
  try {
    // Fix: Using gemini-3-flash-preview for basic text tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: 'Generate a short, calming, and practical stress-reduction tip in Farsi (Persian) for an office employee. Return the result as a JSON object with "title" and "content" keys. Keep the content under 50 words.',
      config: {
        responseMimeType: 'application/json',
        // Fix: Configured responseSchema for more reliable JSON output
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: 'The title of the tip.',
            },
            content: {
              type: Type.STRING,
              description: 'The content of the tip.',
            },
          },
          required: ['title', 'content'],
        },
      }
    });

    const text = response.text;
    if (!text) throw new Error("No content generated");
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating tip:", error);
    return {
      title: "نفس عمیق بکشید",
      content: "لحظه‌ای مکث کنید. ۴ ثانیه دم عمیق، ۴ ثانیه حبس و ۴ ثانیه بازدم. ذهن خود را آرام کنید."
    };
  }
};

// TTS Generation: Guided Meditation
export const generateGuidedMeditation = async (topic: string, durationMinutes: number): Promise<Uint8Array> => {
  const prompt = `Generate a guided meditation script in Farsi (Persian) for an employee focusing on "${topic}". 
  The meditation should last approximately ${durationMinutes} minutes. 
  Speak slowly, calmly, and with a soothing tone. 
  Do not include introductory text like "Here is your meditation", just start the script directly.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // Calming voice
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error("No audio data returned");
    }

    // Fix: Using shared decode helper
    return decode(base64Audio);
  } catch (error) {
    console.error("Error generating audio:", error);
    throw error;
  }
};

/**
 * Decodes raw PCM audio data returned by the Gemini TTS API.
 * Fix: Replaced native decodeAudioData with custom PCM decoding as per guidelines.
 */
export const decodeAudioData = async (
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1
): Promise<AudioBuffer> => {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
};
