import React from 'react';
import MealCard from './MealCard';

export default function MealCatalog({ meals, lang, limit, sizeMultiplier, onViewDetails }: { meals: any[], lang: string, limit?: number, sizeMultiplier?: number, onViewDetails?: (meal: any) => void }) {
  const visibleMeals = limit ? meals.slice(0, limit) : meals;

  if (!visibleMeals || visibleMeals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-white/5 rounded-3xl bg-white/5">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6" />
        <p className="text-gray-500 font-mono text-sm tracking-widest uppercase animate-pulse">Sincronizando_Bio_Cargas...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {visibleMeals.map((meal) => (
        <MealCard 
          key={meal.id_code} 
          meal={meal} 
          lang={lang} 
          sizeMultiplier={sizeMultiplier}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}
