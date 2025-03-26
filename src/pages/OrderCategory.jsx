import React from "react";
import { useParams } from "react-router-dom";

const categoryMap = {
  hot: "Hot Drinks",
  cold: "Cold Drinks",
  food: "Food",
  seasonal: "Seasonal",
  all: "All Items",
};

function OrderCatagoery() {
  const { type } = useParams();
  const label = categoryMap[type];

  if (!label) return <p>Category not found.</p>;

  return (
    <div className="main-page-content">
      <h1>{label} here ☕</h1>
    </div>
  );
}

export default OrderCatagoery;
