# 🧠 Smart Nutrition & Meal Planner Agent
### Personalized AI Food & Health Assistant Powered by Multi-Agent Architecture and Google Gemini

---

## 📘 Project Overview

**Smart Nutrition & Meal Planner Agent** is an intelligent **multi-agent AI system** that automates healthy meal planning and personalized nutrition assistance.  
It creates **custom weekly meal plans**, **generates recipes from available ingredients**, and offers **AI-powered nutrition guidance** through an interactive chatbot built with **Google Gemini**.  
The system remembers each user’s dietary preferences, health goals, and previous chats — delivering a personalized, health-focused experience every time.

This project was built for the **Google × Kaggle AI Agents Intensive (2025)** under the **Concierge Agents Track**, demonstrating real-world use of multi-agent systems and large language models for daily wellness automation.

---

## 🎯 Objective

To design an AI-powered agent system that:
- Plans **balanced weekly meals** based on user goals and preferences.  
- Generates **recipes from the ingredients users already have**.  
- Provides **nutrition advice and food health analysis** through natural conversation.  
- Saves **user data and chat history** to maintain continuity across sessions.  
- Reduces food waste and promotes healthy eating using intelligent automation.

---

## 💡 Core Features

- 🍽️ **AI Meal Planning** – Automatically generates a 7-day personalized meal plan.  
- 🧂 **Ingredient-Based Recipes** – Suggests recipes using ingredients entered by the user.  
- 🤖 **Nutrition Chatbot (Gemini)** – Answers user queries about food, health, and nutrients.  
- 💾 **Persistent User Memory** – Stores preferences, goals, and history for returning users.  
- 🛒 **Smart Grocery Lists** – Builds optimized shopping lists excluding pantry items.  
- 🔁 **Healthy Substitution System** – Recommends alternatives for missing or unhealthy ingredients.  
- 🧩 **Multi-Agent Collaboration** – Planner, Recipe, Nutrition, Memory, Shopping, Swap, and Logger agents.  
- 📊 **Evaluation & Observability** – Logs every agent action and analyzes recipe diversity, prep time, and balance.  
- ☁️ **Optional Deployment** – Ready for deployment via FastAPI and Google Cloud Run.

---

## ⚙️ System Design

The system is structured using a **multi-agent architecture** developed with the **Agent Development Kit (ADK)**.  
Each agent performs a specialized function and communicates with others to complete tasks intelligently.

- **PlannerAgent** → Coordinates the entire planning workflow.  
- **RecipeAgent** → Filters and generates recipes based on user ingredients.  
- **NutritionAgent (Chatbot)** → Provides nutrition insights and advice using Gemini.  
- **MemoryAgent** → Stores user data, goals, and chat logs persistently.  
- **ShoppingAgent** → Creates a cost-efficient grocery list from the planned meals.  
- **SwapAgent** → Suggests healthy or affordable ingredient substitutions.  
- **LoggerAgent** → Records all interactions for traceability and debugging.

All data (recipes, preferences, logs) is stored in structured JSON files for simplicity, scalability, and reproducibility.

---

## 🧠 How It Works

1. The user enters dietary preferences, goals (weight loss/gain), and available ingredients.  
2. The system analyzes the data and generates a **custom 7-day meal plan**.  
3. The chatbot (Gemini) explains nutritional benefits and answers health questions.  
4. The system generates a **grocery list** and provides **healthy food suggestions**.  
5. All user data and history are saved for the next login.  
6. Logs and evaluation reports are created for performance and plan analysis.

---

## 🧩 Tech Stack

| Category | Technology |
|-----------|-------------|
| **Language** | Python 3.10+ |
| **Framework** | Agent Development Kit (ADK), FastAPI (optional) |
| **Model** | Google Gemini 1.5 Pro |
| **Environment** | Google Colab / Kaggle Notebook |
| **Deployment** | Google Cloud Run (optional) |
| **Data Storage** | JSON (recipes, memory, logs) |

---

## 🌱 Impact & Future Improvements

- Reduce food waste by prioritizing recipes using available ingredients.  
- Educate users on nutrition and health through conversational AI.  
- Future goals include integrating fitness tracking, calorie tracking APIs, and recipe image generation.

---
