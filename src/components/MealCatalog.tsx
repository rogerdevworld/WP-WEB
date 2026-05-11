import React from 'react';
import MealCard from './MealCard';

export default function MealCatalog({ meals, lang, limit, sizeMultiplier }: { meals: any[], lang: string, limit?: number, sizeMultiplier?: number }) {
  const visibleMeals = limit ? meals.slice(0, limit) : meals;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {visibleMeals.map((meal) => (
        <MealCard 
          key={meal.id_code} 
          meal={meal} 
          lang={lang} 
          sizeMultiplier={sizeMultiplier}
        />
      ))}
    </div>
  );
}
