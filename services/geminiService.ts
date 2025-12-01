import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, GeminiResponse, Recipe } from '../types';

// FIX: Per @google/genai guidelines, use process.env.API_KEY directly and remove manual checks.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const recipeSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING },
        ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
        instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
        cookTime: { type: Type.STRING, description: "e.g., 30 minutes" },
        calories: { type: Type.NUMBER },
        protein: { type: Type.NUMBER },
        carbs: { type: Type.NUMBER },
        fats: { type: Type.NUMBER },
    },
    required: ["name", "ingredients", "instructions", "cookTime", "calories", "protein", "carbs", "fats"]
};

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        mealPlan: {
            type: Type.ARRAY,
            description: "A 7-day meal plan.",
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.STRING, description: "Day of the week." },
                    meals: {
                        type: Type.ARRAY,
                        description: "List of meals for the day.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                mealType: { type: Type.STRING, description: "e.g., Breakfast, Lunch, Dinner, Snack" },
                                recipe: recipeSchema,
                            },
                            required: ["mealType", "recipe"]
                        }
                    },
                    dailyTotals: {
                        type: Type.OBJECT,
                        properties: {
                            calories: { type: Type.NUMBER },
                            protein: { type: Type.NUMBER },
                            carbs: { type: Type.NUMBER },
                            fats: { type: Type.NUMBER },
                        },
                        required: ["calories", "protein", "carbs", "fats"]
                    },
                },
                required: ["day", "meals", "dailyTotals"]
            }
        },
        shoppingList: {
            type: Type.ARRAY,
            description: "A consolidated weekly shopping list.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    quantity: { type: Type.STRING, description: "e.g., 200g, 3 units" },
                    category: { type: Type.STRING, description: "e.g., Dairy, Produce, Meat" },
                },
                required: ["name", "quantity", "category"]
            }
        },
        agentLogs: {
            type: Type.ARRAY,
            description: "Logs of the AI agents' decision-making process.",
            items: {
                type: Type.OBJECT,
                properties: {
                    agentName: { type: Type.STRING, description: "e.g., Coordinator Agent, Nutritionist Agent" },
                    action: { type: Type.STRING, description: "Description of the action taken." },
                    timestamp: { type: Type.STRING, description: "ISO 8601 timestamp." },
                },
                required: ["agentName", "action", "timestamp"]
            }
        },
    },
    required: ["mealPlan", "shoppingList", "agentLogs"]
};

const callGemini = async (prompt: string, schema: any) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
                temperature: 0.7,
            },
        });

        const jsonText = response.text?.trim();
        if (!jsonText) {
            throw new Error("Received empty response from the model.");
        }
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get response from AI model. It may be temporarily unavailable or the request was invalid.");
    }
};

export const generateMealPlan = async (profile: UserProfile): Promise<GeminiResponse> => {
    const prompt = `
      You are an AI-powered Smart Meal Planner composed of a multi-agent system. Your persona is a friendly, informative, and accurate personal nutritionist. Your goal is to generate a personalized 7-day meal plan.
      
      **User Profile:**
      - User ID: ${profile.userId}
      - Primary Goal: ${profile.goal}
      - Weekly Budget Range: ${profile.budgetRange}
      - Dietary Type: ${profile.dietaryType}
      - Allergies: ${profile.allergies || 'None'}
      - Disliked Ingredients: ${profile.dislikedIngredients || 'None'}
      - Cuisine Preferences: ${profile.cuisinePreferences || 'Any'}
      - Daily Calorie Goal: ~${profile.calorieGoal} kcal
      - Daily Macronutrient Goals: Protein ~${profile.proteinGoal}g, Carbs ~${profile.carbsGoal}g, Fats ~${profile.fatsGoal}g

      **Your Multi-Agent System:**
      1.  **Coordinator Agent**: You are the main coordinator. You will manage the entire workflow.
      2.  **Recipe Expert Agent**: Find/generate healthy, delicious recipes matching user preferences, avoiding allergies/dislikes.
      3.  **Nutritionist Agent**: Ensure each day's meals collectively meet calorie/macro goals (+/- 10% tolerance). Calculate all nutritional values.
      4.  **Budgeting Agent**: Ensure ingredients are suitable for the user's budget range.
      5.  **Shopping Agent**: After planning, create a consolidated, categorized shopping list.
      6.  **Critic Agent**: Review the entire plan. Does it meet ALL constraints (goal, budget, allergies, etc.)? Is it varied and appealing? If not, send for revision.
      7.  **Memory Agent**: Use the provided user profile to inform all decisions.

      **Your Task:**
      Go through the entire agent workflow to generate a complete 7-day meal plan (Breakfast, Lunch, Dinner, one Snack per day), a weekly shopping list, and a log of your agent actions.
      
      **Output Format:**
      Provide your response as a single JSON object that strictly adheres to the provided schema. Do not include any other text or markdown. The entire response must be a valid JSON.
    `;

    return callGemini(prompt, responseSchema);
};

export const generateRecipeFromIngredients = async (ingredients: string): Promise<Recipe> => {
    const prompt = `
      You are a Recipe Generation AI. Your task is to create a single, delicious, and easy-to-follow recipe based on the ingredients provided by the user.
      
      **Provided Ingredients:**
      ${ingredients}

      **Your Task:**
      1.  Create a suitable name for the recipe.
      2.  List all necessary ingredients (you can add common pantry staples like oil, salt, pepper if needed).
      3.  Provide clear, step-by-step instructions.
      4.  Estimate the cook time.
      5.  Provide an approximate nutritional breakdown (calories, protein, carbs, fats).

      **Output Format:**
      You MUST provide your response as a single JSON object that strictly adheres to the provided recipe schema. Do not include any other text or markdown formatting.
    `;
    return callGemini(prompt, recipeSchema);
};

export const getFoodInfo = async (query: string): Promise<string> => {
    const prompt = `
      You are a friendly, informative, and accurate personal nutritionist AI. A user has a question about food. 
      Please provide a clear, helpful, and easy-to-understand explanation.

      **User's Question:**
      "${query}"

      **Your Task:**
      Answer the user's question. If it's about a specific food, explain its protein content, key nutrients, and overall health benefits. Be encouraging and professional.
      
      **Output Format:**
      Respond in plain text or simple markdown. Do not respond in JSON.
    `;
    
     try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const text = response.text?.trim();
        if (!text) {
            throw new Error("Received empty response from the model.");
        }
        return text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get response from AI model. It may be temporarily unavailable or the request was invalid.");
    }
};