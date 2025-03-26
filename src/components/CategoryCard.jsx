import React from "react";
import "../Catagory_Style.css";

const categories = [
  { id: "hot", label: "Hot Drinks", layout: "tall" },
  { id: "cold", label: "Cold Drinks", layout: "tall" },
  { id: "food", label: "Food", layout: "tall" },
  { id: "seasonal", label: "Seasonal", layout: "wide" },
];

const CategoryCard = ({ onSelect }) => {
  return (
    <div className="category-grid">
      {categories.map((cat) => (
        <div
          key={cat.id}
          className={`category-box ${cat.layout}`}
          onClick={() => onSelect?.(cat.id)}
        >
          <h3>{cat.label}</h3>
        </div>
      ))}
    </div>
  );
};

export default CategoryCard;
