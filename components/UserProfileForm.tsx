
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { LogoIcon, UserIcon, TargetIcon, FoodIcon, CheckIcon } from './icons';

interface UserProfileFormProps {
  onSave: (profile: UserProfile) => void;
}

const budgetOptions = {
    'weight-loss': {
        'Budget: ₹630 – ₹850': '₹630–₹850',
        'Costly: ₹1.5k – ₹1.7k': '₹1.5k–₹1.7k'
    },
    'weight-gain': {
        'Budget: ₹180 – ₹220': '₹180–₹220',
        'Costly: ₹2.8k – ₹4.2k': '₹2.8k–₹4.2k'
    }
};

const UserProfileForm: React.FC<UserProfileFormProps> = ({ onSave }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>({
    userId: '',
    goal: 'weight-loss',
    budgetRange: budgetOptions['weight-loss']['Budget: ₹630 – ₹850'],
    dietaryType: 'any',
    allergies: '',
    dislikedIngredients: '',
    cuisinePreferences: '',
    calorieGoal: 2000,
    proteinGoal: 120,
    carbsGoal: 250,
    fatsGoal: 65,
  });

  const handleGoalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newGoal = e.target.value as 'weight-loss' | 'weight-gain';
    const newBudgetOptions = budgetOptions[newGoal];
    // Set the budget to the first available option for the new goal
    const defaultBudget = Object.values(newBudgetOptions)[0];

    setProfile(prev => ({
        ...prev,
        goal: newGoal,
        budgetRange: defaultBudget
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Special handling for goal change to update dependent fields
    if (name === 'goal') {
        handleGoalChange(e as React.ChangeEvent<HTMLSelectElement>);
    } else {
        setProfile(prev => ({ ...prev, [name]: name.includes('Goal') ? Number(value) : value }));
    }
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(profile);
  };
  
  const progress = (step / 3) * 100;
  // Dynamically get budget options based on the current goal
  const currentBudgetOptions = budgetOptions[profile.goal];

  return (
    <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-base-200 overflow-hidden">
        <div className="p-8 border-b border-base-200">
           <div className="flex items-center gap-4 mb-4">
            <LogoIcon className="h-12 w-12 text-primary"/>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Welcome!</h1>
              <p className="text-gray-500">Let's create your personalized meal plan profile.</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-6">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.3s ease-in-out' }}></div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8">
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-3">
                <UserIcon className="h-6 w-6 text-primary"/>
                <h2 className="text-2xl font-semibold text-gray-700">Basics</h2>
              </div>
              <div>
                <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                <input type="text" name="userId" id="userId" value={profile.userId} onChange={handleChange} className="w-full p-2 border border-base-300 rounded-md focus:ring-primary focus:border-primary" placeholder="e.g., JaneDoe123" required />
              </div>
              <div>
                <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">What is your primary goal?</label>
                <select name="goal" id="goal" value={profile.goal} onChange={handleChange} className="w-full p-2 border border-base-300 rounded-md focus:ring-primary focus:border-primary">
                  <option value="weight-loss">Weight Loss</option>
                  <option value="weight-gain">Weight Gain</option>
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
             <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-3">
                <TargetIcon className="h-6 w-6 text-primary"/>
                <h2 className="text-2xl font-semibold text-gray-700">Health & Goals</h2>
              </div>
              <div>
                <label htmlFor="dietaryType" className="block text-sm font-medium text-gray-700 mb-1">Dietary Type</label>
                <select name="dietaryType" id="dietaryType" value={profile.dietaryType} onChange={handleChange} className="w-full p-2 border border-base-300 rounded-md focus:ring-primary focus:border-primary">
                  <option value="any">Any</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="non-vegetarian">Non-Vegetarian</option>
                </select>
              </div>
               <div>
                 <label htmlFor="calorieGoal" className="block text-sm font-medium text-gray-700 mb-1">Daily Calorie Goal (kcal)</label>
                 <input type="number" name="calorieGoal" id="calorieGoal" value={profile.calorieGoal} onChange={handleChange} className="w-full p-2 border border-base-300 rounded-md focus:ring-primary focus:border-primary" />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="proteinGoal" className="block text-sm font-medium text-gray-700 mb-1">Protein (g)</label>
                    <input type="number" name="proteinGoal" id="proteinGoal" value={profile.proteinGoal} onChange={handleChange} className="w-full p-2 border border-base-300 rounded-md focus:ring-primary focus:border-primary" />
                  </div>
                  <div>
                    <label htmlFor="carbsGoal" className="block text-sm font-medium text-gray-700 mb-1">Carbs (g)</label>
                    <input type="number" name="carbsGoal" id="carbsGoal" value={profile.carbsGoal} onChange={handleChange} className="w-full p-2 border border-base-300 rounded-md focus:ring-primary focus:border-primary" />
                  </div>
                  <div>
                    <label htmlFor="fatsGoal" className="block text-sm font-medium text-gray-700 mb-1">Fats (g)</label>
                    <input type="number" name="fatsGoal" id="fatsGoal" value={profile.fatsGoal} onChange={handleChange} className="w-full p-2 border border-base-300 rounded-md focus:ring-primary focus:border-primary" />
                  </div>
               </div>
             </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-3">
                <FoodIcon className="h-6 w-6 text-primary"/>
                <h2 className="text-2xl font-semibold text-gray-700">Preferences</h2>
              </div>
              <div>
                <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-1">Allergies (comma-separated)</label>
                <input type="text" name="allergies" id="allergies" value={profile.allergies} onChange={handleChange} className="w-full p-2 border border-base-300 rounded-md focus:ring-primary focus:border-primary" placeholder="e.g., Peanuts, Shellfish" />
              </div>
              <div>
                <label htmlFor="dislikedIngredients" className="block text-sm font-medium text-gray-700 mb-1">Disliked Ingredients (comma-separated)</label>
                <input type="text" name="dislikedIngredients" id="dislikedIngredients" value={profile.dislikedIngredients} onChange={handleChange} className="w-full p-2 border border-base-300 rounded-md focus:ring-primary focus:border-primary" placeholder="e.g., Cilantro, Olives" />
              </div>
               <div>
                <label htmlFor="cuisinePreferences" className="block text-sm font-medium text-gray-700 mb-1">Cuisine Preferences (comma-separated)</label>
                <input type="text" name="cuisinePreferences" id="cuisinePreferences" value={profile.cuisinePreferences} onChange={handleChange} className="w-full p-2 border border-base-300 rounded-md focus:ring-primary focus:border-primary" placeholder="e.g., Italian, Mexican, Thai" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weekly Budget</label>
                <div className="space-y-2">
                  {Object.entries(currentBudgetOptions).map(([label, value]) => (
                    <label key={value} className="flex items-center p-3 border border-base-300 rounded-md has-[:checked]:bg-primary/10 has-[:checked]:border-primary transition-colors">
                      <input type="radio" name="budgetRange" value={value} checked={profile.budgetRange === value} onChange={handleChange} className="h-4 w-4 text-primary focus:ring-primary border-gray-300" />
                      <span className="ml-3 text-sm font-medium text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-base-200 flex justify-between items-center">
            <button type="button" onClick={prevStep} disabled={step === 1} className="text-gray-600 font-semibold py-2 px-4 rounded-md hover:bg-base-200 disabled:opacity-50 disabled:cursor-not-allowed">
              Back
            </button>
            {step < 3 && (
              <button type="button" onClick={nextStep} className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-focus transition-colors">
                Next
              </button>
            )}
            {step === 3 && (
              <button type="submit" className="bg-success text-white font-bold py-2 px-6 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2">
                <CheckIcon className="h-5 w-5"/>
                Save Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfileForm;
