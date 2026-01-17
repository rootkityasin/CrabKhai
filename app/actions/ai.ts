'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Helper to get cached model
const getModel = () => {
    return genAI.getGenerativeModel({ model: 'gemini-pro' });
};

/**
 * Generates a professional product description using Gemini.
 */
export async function generateDescriptionAI(name: string, category: string, weight: number, unit: string) {
    try {
        const model = getModel();
        const quantity = weight > 0 ? `(${unit === 'WEIGHT' ? weight + 'g' : weight + ' units'})` : '';

        const prompt = `Write a professional, appetizing product description for a food item named "${name}" which is a "${category}" ${quantity}. 
        Focus on freshness, quality, and culinary potential. 
        Keep it concise (2-3 sentences max). 
        Do not use hashtags.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Error:", error);
        return `Premium quality ${name}. Freshly sourced ${category}, processed with care.`;
    }
}

/**
 * Translates English text to Bangla (focused on ingredients).
 */
export async function translateToBanglaAI(text: string) {
    try {
        if (!text) return null;
        const model = getModel();
        const prompt = `Translate this English food ingredient name to Bangla: "${text}". 
        Return ONLY the Bangla text. No explanations.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("Gemini Translate Error:", error);
        return null;
    }
}

/**
 * Parses unstructured text into JSON using Gemini.
 */
export async function smartParseAI(text: string) {
    try {
        const model = getModel();
        const prompt = `Extract product details from this text: "${text}".
        Return a valid JSON object with these keys: 
        - name (string, remove weights/prices)
        - weight (number, in grams. Convert kg to g)
        - price (number)
        - pieces (number)
        
        Example Input: "Crab 500g 1200tk" -> {"name": "Crab", "weight": 500, "price": 1200, "pieces": 0}
        Return ONLY valid JSON. No markdown formatting.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const cleanText = response.text().replace(/```json|```/g, '').trim();
        return JSON.parse(cleanText);
    } catch (error) {
        console.error("Gemini Parse Error:", error);
        return { name: text, price: 0, weight: 0, pieces: 0 };
    }
}
