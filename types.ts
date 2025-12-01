
export interface UserProfile {
  userId: string;
  goal: 'weight-loss' | 'weight-gain';
  budgetRange: string;
  dietaryType: 'vegetarian' | 'vegan' | 'non-vegetarian' | 'any';
  allergies: string;
  dislikedIngredients: string;
  cuisinePreferences: string;
  calorieGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatsGoal: number;
}

export interface Recipe {
  name: string;
  ingredients: string[];
  instructions: string[];
  cookTime: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface Meal {
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  recipe: Recipe;
}

export interface DayPlan {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  meals: Meal[];
  dailyTotals: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
}

export type MealPlan = DayPlan[];

export interface ShoppingListItem {
  name: string;
  quantity: string;
  category: string;
}

export interface AgentLog {
  agentName: string;
  action: string;
  timestamp: string;
}

export interface GeminiResponse {
  mealPlan: MealPlan;
  shoppingList: ShoppingListItem[];
  agentLogs: AgentLog[];
}
