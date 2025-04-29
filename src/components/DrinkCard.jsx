import React from 'react';
import noImage from '../assets/no_image_found.png';
const DrinkCard = ({ drink, onClick }) => {
  const image = drink.image || noImage;

  return (
    <div className="drink-card" onClick={onClick}>
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
        <div className="drink-card-price">£{Number(drink.price).toFixed(2)}</div>
        <button>Add Now</button>
      </div>
    </div>
  );
};


export default DrinkCard;
