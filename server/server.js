import expressPkg from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config({ path: '.env.local' });

const app = expressPkg();
app.use(cors());
app.use(expressPkg.json({ limit: '1mb' }));

const port = process.env.PORT || 4000;

if (!process.env.GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY not set. Set it in .env.local');
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const extractJsonFromText = (text) => {
  if (!text || typeof text !== 'string') return null;
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenced?.[1]) { try { return JSON.parse(fenced[1].trim()); } catch {} }
  const first = text.indexOf('{'); const last = text.lastIndexOf('}');
  if (first !== -1 && last !== -1 && last > first) {
    try { return JSON.parse(text.slice(first, last + 1)); } catch {}
  }
  try { return JSON.parse(text); } catch { return null; }
};

const callGemini = async (prompt, schema = null) => {
  const config = { temperature: 0.7 };
  if (schema) { config.responseMimeType = 'application/json'; config.responseSchema = schema; }
  const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt, config });
  const text = (response?.text ?? '').toString().trim();
  const parsed = extractJsonFromText(text);
  return { text, parsed };
};

app.post('/api/generate-meal-plan', async (req, res) => {
  try {
    const profile = req.body ?? {};
    const prompt = `You are an AI nutrition assistant. Return ONLY one JSON object with keys: mealPlan(7-day array), shoppingList(array), agentLogs(array). No markdown. User profile: ${JSON.stringify(profile)}`;
    const { text, parsed } = await callGemini(prompt, null);
    if (parsed) return res.json(parsed);
    return res.status(502).json({ error: 'Failed to generate meal plan', raw: text });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to generate meal plan', details: String(err) });
  }
});

app.post('/api/generate-recipe', async (req, res) => {
  try {
    const { ingredients } = req.body ?? {};
    const prompt = `Return ONLY one JSON object: name, ingredients[], instructions[], cookTime, calories, protein, carbs, fats. Ingredients: ${JSON.stringify(ingredients)}`;
    const { text, parsed } = await callGemini(prompt, null);
    if (parsed) return res.json(parsed);
    return res.status(502).json({ error: 'Failed to generate recipe', raw: text });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to generate recipe', details: String(err) });
  }
});

app.post('/api/get-food-info', async (req, res) => {
  try {
    const { query } = req.body ?? {};
    const prompt = `Answer the user's question about food concisely: ${String(query ?? '')}`;
    const { text } = await callGemini(prompt, null);
    return res.json({ text });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to get food info', details: String(err) });
  }
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
