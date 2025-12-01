
import React from 'react';
import { Recipe } from '../types';
import { XIcon, ClockIcon, FlameIcon } from './icons';

interface RecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white p-6 border-b border-base-200 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{recipe.name}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
              <span className="flex items-center gap-1"><ClockIcon className="h-4 w-4"/> {recipe.cookTime}</span>
              <span className="flex items-center gap-1"><FlameIcon className="h-4 w-4"/> {recipe.calories} kcal</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-base-200 hover:text-gray-600">
            <XIcon className="h-6 w-6"/>
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 text-center">
            <div className="bg-blue-50 p-3 rounded-lg"><span className="font-bold text-blue-800">{recipe.protein}g</span> Protein</div>
            <div className="bg-yellow-50 p-3 rounded-lg"><span className="font-bold text-yellow-800">{recipe.carbs}g</span> Carbs</div>
            <div className="bg-red-50 p-3 rounded-lg"><span className="font-bold text-red-800">{recipe.fats}g</span> Fats</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Ingredients</h3>
              <ul className="space-y-2 list-disc list-inside text-gray-600">
                {recipe.ingredients.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Instructions</h3>
              <ol className="space-y-3 text-gray-600">
                {recipe.instructions.map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 bg-primary text-white h-6 w-6 flex items-center justify-center rounded-full font-bold text-sm">{index + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;
