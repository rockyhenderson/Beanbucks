import React, { useState } from "react";
import useFetchWithRetry from "../utils/useFetchWithRetry";
import RetryFallback from "../components/RetryFallback";
import DrinkCard from "../components/DrinkCard";
import CategoryCard from "../components/CategoryCard"; 
import "../Order_Style.css";

function Order() {
  const { data: drinks, error, retry } = useFetchWithRetry("http://localhost:3001/api/drinks");
  const [activeCategory, setActiveCategory] = useState(null);

  if (error) return <RetryFallback onRetry={retry} />;
  if (!drinks) return <p>Loading drinks...</p>;

  const filteredDrinks = activeCategory
    ? drinks.filter((drink) => drink.template_id === activeCategory)
    : [];

  return (
    <div className="orders">
      <h1>Menu</h1>

      {/* Fixed category layout */}
      <CategoryCard onSelect={setActiveCategory} />

      {/* Drinks shown after selecting a category */}
      {activeCategory && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-4">
          {filteredDrinks.map((drink) => (
            <DrinkCard key={drink.name} drink={drink} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Order;
