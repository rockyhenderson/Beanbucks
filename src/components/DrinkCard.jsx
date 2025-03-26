import React from 'react';
import noImage from '../assets/no_image_found.png';
import '../Drink_style.css';

const DrinkCard = ({ drink }) => {
  const image = drink.image || noImage;

  return (
    <div className="drink-card">
      <img
        src={image}
        alt={drink.name}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = noImage;
        }}
      />
      <div className="drink-card-content">
        <div className="drink-card-title">{drink.name}</div>
        <div className="drink-card-price">£{drink.price.toFixed(2)}</div>
        <button>Add Now</button>
      </div>
    </div>
  );
};

export default DrinkCard;
