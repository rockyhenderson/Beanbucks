import React from "react";
import "../Catagory_Style.css";
import { useNavigate } from "react-router-dom";

const categories = [
  { id: "hot", label: "Hot Drinks", layout: "tall" },
  { id: "cold", label: "Cold Drinks", layout: "tall" },
  { id: "food", label: "Food", layout: "tall" },
  { id: "seasonal", label: "Seasonal", layout: "half" },
  { id: "all", label: "All Items", layout: "half" },
];

const CategoryCard = () => {
  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`/order/${id}`);
  };

  return (
    <div className="category-grid">
      {categories.map((cat) => (
        <div
          key={cat.id}
          className={`category-box ${cat.layout}`}
          onClick={() => handleClick(cat.id)}
        >
          <h3>{cat.label}</h3>
        </div>
      ))}
    </div>
  );
};

export default CategoryCard;
