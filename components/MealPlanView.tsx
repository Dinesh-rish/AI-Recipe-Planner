
import React from 'react';
import { MealPlan, Recipe } from '../types';
import { FlameIcon } from './icons';

interface MealPlanViewProps {
  mealPlan: MealPlan;
  onViewRecipe: (recipe: Recipe) => void;
}

const MealCard: React.FC<{ mealType: string; recipe: Recipe; onViewRecipe: (recipe: Recipe) => void }> = ({ mealType, recipe, onViewRecipe }) => {
  return (
    <div 
      className="bg-white p-3 rounded-lg shadow-sm border border-base-200 cursor-pointer hover:shadow-md hover:border-primary transition-all transform hover:-translate-y-1"
      onClick={() => onViewRecipe(recipe)}
    >
      <h4 className="font-bold text-gray-600 text-sm">{mealType}</h4>
      <p className="text-gray-800 font-semibold truncate" title={recipe.name}>{recipe.name}</p>
      <div className="flex items-center text-xs text-gray-500 mt-1">
        <FlameIcon className="h-4 w-4 text-secondary mr-1"/>
        <span>{recipe.calories} kcal</span>
      </div>
    </div>
  );
};

const MealPlanView: React.FC<MealPlanViewProps> = ({ mealPlan, onViewRecipe }) => {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const sortedMealPlan = mealPlan.sort((a, b) => daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
      {sortedMealPlan.map((dayPlan) => (
        <div key={dayPlan.day} className="bg-base-200/50 rounded-xl p-4 flex flex-col gap-3">
          <div className="text-center pb-2">
            <h3 className="font-bold text-lg text-gray-700">{dayPlan.day}</h3>
            <p className="text-sm text-gray-500">{dayPlan.dailyTotals.calories} kcal</p>
          </div>
          <div className="space-y-3 flex-grow">
            {dayPlan.meals.map((meal) => (
              <MealCard key={`${dayPlan.day}-${meal.mealType}`} mealType={meal.mealType} recipe={meal.recipe} onViewRecipe={onViewRecipe} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MealPlanView;
