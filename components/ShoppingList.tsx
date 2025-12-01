import React from 'react';
import { ShoppingListItem } from '../types';
import { ShoppingCartIcon } from './icons';

interface ShoppingListProps {
  items: ShoppingListItem[];
}

const ShoppingList: React.FC<ShoppingListProps> = ({ items }) => {
  // FIX: Used a type assertion on the initial value of `reduce` for robust type inference.
  // This resolves the error where the `items` variable in the `.map()` function below was of type `unknown`.
  const groupedItems = items.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, ShoppingListItem[]>);

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-md border border-base-200">
      <div className="flex items-center gap-4 border-b border-base-200 pb-4 mb-6">
        <ShoppingCartIcon className="h-8 w-8 text-primary"/>
        <h2 className="text-3xl font-bold text-gray-800">Weekly Shopping List</h2>
      </div>
      
      {Object.keys(groupedItems).length === 0 ? (
        <p className="text-center text-gray-500 py-8">Your shopping list is empty.</p>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedItems).sort(([catA], [catB]) => catA.localeCompare(catB)).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-xl font-semibold text-gray-700 mb-3 capitalize border-b-2 border-primary pb-1">{category}</h3>
              <ul className="space-y-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
                {items.map((item, index) => (
                  <li key={`${item.name}-${index}`} className="flex items-center">
                    <input id={`${item.name}-${index}`} type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mr-3"/>
                    <label htmlFor={`${item.name}-${index}`} className="text-gray-600 flex-grow cursor-pointer">
                      {item.name} <span className="text-gray-400 text-sm">({item.quantity})</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShoppingList;
