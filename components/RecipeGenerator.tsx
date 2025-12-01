
import React, { useState } from 'react';
import { generateRecipeFromIngredients } from '../services/geminiService';
import { Recipe } from '../types';
import { SparklesIcon } from './icons';

interface RecipeGeneratorProps {
    onRecipeGenerated: (recipe: Recipe) => void;
}

const RecipeGenerator: React.FC<RecipeGeneratorProps> = ({ onRecipeGenerated }) => {
    const [ingredients, setIngredients] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ingredients.trim()) {
            setError('Please enter some ingredients.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const recipe = await generateRecipeFromIngredients(ingredients);
            onRecipeGenerated(recipe);
            setIngredients('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-md border border-base-200">
            <div className="flex items-center gap-4 border-b border-base-200 pb-4 mb-6">
                <SparklesIcon className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold text-gray-800">Recipe Generator</h2>
            </div>
            <p className="text-gray-600 mb-6">
                Have some ingredients but not sure what to make? Enter them below (comma-separated) and let the AI create a recipe for you!
            </p>

            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <textarea
                        value={ingredients}
                        onChange={(e) => setIngredients(e.target.value)}
                        placeholder="e.g., chicken breast, rice, broccoli, soy sauce"
                        className="w-full p-3 border border-base-300 rounded-md focus:ring-primary focus:border-primary min-h-[100px]"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary hover:bg-primary-focus text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                           <>
                             <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                             Generating...
                           </>
                        ) : (
                            'Generate Recipe'
                        )}
                    </button>
                </div>
            </form>

            {error && (
                <div className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
};

export default RecipeGenerator;
