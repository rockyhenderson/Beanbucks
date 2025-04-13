import React from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  { id: "hot", label: "Hot Drinks" },
  { id: "cold", label: "Cold Drinks" },
  { id: "food", label: "Food" },
];

const CategoryCard = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "2rem",
        // alignItems: "center",
      }}
    >
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => navigate(`/order/${cat.id}`)}
          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "1.5rem",
            fontSize: "1.25rem",
            fontWeight: "500",
            border: "2px solid black",
            borderRadius: "0.5rem",
            backgroundColor: "white",
            color: "black",
            textAlign: "left",
            cursor: "pointer",
          }}
        >
          • {cat.label}
        </button>
      ))}
    </div>
  );
};

export default CategoryCard;
