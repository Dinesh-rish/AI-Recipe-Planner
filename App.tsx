import React, { useState, useEffect, useCallback } from 'react';
import { UserProfile, MealPlan, ShoppingListItem, AgentLog, Recipe } from './types';
import UserProfileForm from './components/UserProfileForm';
import MealPlanView from './components/MealPlanView';
import { generateMealPlan } from './services/geminiService';
import { LogoIcon } from './components/icons';
import ShoppingList from './components/ShoppingList';
import AgentLogView from './components/AgentLogView';
import RecipeGenerator from './components/RecipeGenerator';
import NutritionGuide from './components/NutritionGuide';
import { exportToPDF, exportToCSV, exportToICal } from './utils/export';
import RecipeModal from './components/RecipeModal';

type View = 'PLAN' | 'SHOPPING_LIST' | 'LOGS' | 'RECIPE_GENERATOR' | 'NUTRITION_GUIDE';

const App: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [agentLogs, setAgentLogs] = useState<AgentLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<View>('PLAN');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    try {
      const savedProfileString = localStorage.getItem('userProfile');
      if (savedProfileString) {
        const savedProfile = JSON.parse(savedProfileString);

        // Basic validation
        if (typeof savedProfile !== 'object' || savedProfile === null || !savedProfile.userId) {
          localStorage.removeItem('userProfile');
          return;
        }

        // Merge with defaults to ensure all keys are present, providing backward compatibility.
        const fullProfile: UserProfile = {
          userId: '',
          goal: 'weight-loss',
          budgetRange: '₹630–₹850', // Corresponds to default goal
          dietaryType: 'any',
          allergies: '',
          dislikedIngredients: '',
          cuisinePreferences: '',
          calorieGoal: 2000,
          proteinGoal: 120,
          carbsGoal: 250,
          fatsGoal: 65,
          ...savedProfile, // Overwrite defaults with saved data
        };

        // If an old profile has a 'goal' but no 'budgetRange', the budget might be mismatched.
        // This ensures the budget range is appropriate for the goal.
        if (!savedProfile.budgetRange) {
          if (fullProfile.goal === 'weight-gain') {
            fullProfile.budgetRange = '₹180–₹220';
          } else {
            fullProfile.budgetRange = '₹630–₹850';
          }
        }

        setUserProfile(fullProfile);
      }
    } catch (e) {
      console.error("Failed to parse or upgrade user profile from localStorage", e);
      localStorage.removeItem('userProfile');
    }
  }, []);

  const handleProfileSave = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('userProfile', JSON.stringify(profile));
    setMealPlan(null); // Clear old plan when profile changes
  };

  const handleGeneratePlan = useCallback(async () => {
    if (!userProfile) return;

    setIsLoading(true);
    setError(null);
    setMealPlan(null);
    setShoppingList([]);
    setAgentLogs([]);
    
    try {
      const result = await generateMealPlan(userProfile);
      if (result) {
        setMealPlan(result.mealPlan);
        setShoppingList(result.shoppingList);
        setAgentLogs(result.agentLogs);
        setActiveView('PLAN');
      } else {
        throw new Error("Received empty result from the meal planner agent.");
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [userProfile]);

  const resetProfile = () => {
    localStorage.removeItem('userProfile');
    setUserProfile(null);
    setMealPlan(null);
    setShoppingList([]);
    setAgentLogs([]);
    setError(null);
  };

  const handleViewRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleCloseModal = () => {
    setSelectedRecipe(null);
  };

  if (!userProfile) {
    return <UserProfileForm onSave={handleProfileSave} />;
  }

  return (
    <div className="min-h-screen bg-base-100 text-neutral font-sans">
      <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <LogoIcon className="h-10 w-10 text-primary" />
          <h1 className="text-2xl font-bold text-gray-800">AI Smart Meal Planner</h1>
        </div>
        <button onClick={resetProfile} className="text-sm text-gray-500 hover:text-primary transition-colors">
          Edit Profile
        </button>
      </header>
      
      <main className="p-4 md:p-8">
        {!mealPlan && !isLoading && (
          <div className="text-center max-w-2xl mx-auto">
             <div className="bg-white p-8 rounded-xl shadow-md border border-base-200">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">Welcome, {userProfile.userId}!</h2>
              <p className="text-gray-600 mb-6">Your profile is set up. Ready to generate a personalized meal plan for the week?</p>
              <button
                onClick={handleGeneratePlan}
                disabled={isLoading}
                className="bg-primary hover:bg-primary-focus text-white font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105 shadow-lg"
              >
                {isLoading ? 'Generating...' : 'Generate My Meal Plan'}
              </button>
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Or use our planning tools:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button onClick={() => setActiveView('RECIPE_GENERATOR')} className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md border border-base-200 text-left transition-all">
                      <h4 className="font-bold text-primary">Recipe Generator</h4>
                      <p className="text-sm text-gray-500">Create recipes from ingredients you have.</p>
                  </button>
                  <button onClick={() => setActiveView('NUTRITION_GUIDE')} className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md border border-base-200 text-left transition-all">
                      <h4 className="font-bold text-primary">Nutrition Guide</h4>
                      <p className="text-sm text-gray-500">Ask our AI nutritionist anything about food.</p>
                  </button>
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center text-center p-8">
             <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
             <p className="text-lg font-semibold text-primary">Your AI agents are planning your meals...</p>
             <p className="text-gray-500 mt-2">This might take a moment.</p>
          </div>
        )}
        
        {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md max-w-3xl mx-auto" role="alert">
                <p className="font-bold">An error occurred</p>
                <p>{error}</p>
                <button onClick={handleGeneratePlan} className="mt-2 text-sm font-semibold text-red-800 hover:underline">Try Again</button>
            </div>
        )}

        { (mealPlan || activeView === 'RECIPE_GENERATOR' || activeView === 'NUTRITION_GUIDE') && !isLoading && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div className="border-b-2 border-base-200 sm:border-none">
                <nav className="flex -mb-px space-x-2 sm:space-x-4 overflow-x-auto">
                  {(['PLAN', 'SHOPPING_LIST', 'LOGS', 'RECIPE_GENERATOR', 'NUTRITION_GUIDE'] as View[]).map(view => (
                     (!mealPlan && (view === 'PLAN' || view === 'SHOPPING_LIST' || view === 'LOGS')) ? null : (
                      <button
                        key={view}
                        onClick={() => setActiveView(view)}
                        className={`whitespace-nowrap pb-2 px-2 border-b-2 font-medium text-sm transition-colors ${activeView === view ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                      >
                        {view.replace(/_/g, ' ')}
                      </button>
                     )
                  ))}
                </nav>
              </div>
              <div className="flex items-center gap-2">
                { mealPlan && (
                  <>
                    <button onClick={() => exportToPDF(mealPlan, shoppingList, userProfile)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg text-sm">PDF</button>
                    <button onClick={() => exportToCSV(shoppingList)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg text-sm">CSV</button>
                    <button onClick={() => exportToICal(mealPlan)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg text-sm">iCal</button>
                    <button onClick={handleGeneratePlan} disabled={isLoading} className="bg-primary hover:bg-primary-focus text-white font-bold py-2 px-4 rounded-lg text-sm">
                      {isLoading ? '...' : 'Regenerate'}
                    </button>
                  </>
                )}
              </div>
            </div>

            {activeView === 'PLAN' && mealPlan && <MealPlanView mealPlan={mealPlan} onViewRecipe={handleViewRecipe} />}
            {activeView === 'SHOPPING_LIST' && mealPlan && <ShoppingList items={shoppingList} />}
            {activeView === 'LOGS' && mealPlan && <AgentLogView logs={agentLogs} />}
            {activeView === 'RECIPE_GENERATOR' && <RecipeGenerator onRecipeGenerated={handleViewRecipe}/>}
            {activeView === 'NUTRITION_GUIDE' && <NutritionGuide />}
          </div>
        )}

      </main>
       {selectedRecipe && <RecipeModal recipe={selectedRecipe} onClose={handleCloseModal} />}
    </div>
  );
};

export default App;