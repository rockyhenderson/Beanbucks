import React from 'react';
import fallbackImage from '../assets/no_image_found.png';

const HomepageCTA = ({
  drink = {
    name: "Caramel Cold Brew Bliss",
    tagline: "Smooth. Sweet. Iced to perfection.",
  },
  onCTAClick = () => console.log("Order Now clicked")
}) => {
  return (
    <section
      style={{
        position: 'relative',
        width: 'calc(100% + 2rem)',
        minHeight: '70vh',
        backgroundImage: `url(${fallbackImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        boxSizing: 'border-box',
        margin: '-1rem',
        padding: '2rem'
      }}
    >
      <div
        style={{
          color: 'white',
          maxWidth: '500px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '1.5rem'
        }}
      >
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700' }}>{drink.tagline}</h1>
        <button
          onClick={onCTAClick}
          style={{
            backgroundColor: 'var(--primary)',
            color: 'var(--button-text)',
            border: 'none',
            padding: '1rem 2.25rem',
            borderRadius: '999px',
            fontSize: '1.25rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
        >
          Order Now
        </button>
      </div>
    </section>
  );
};

export default HomepageCTA;
