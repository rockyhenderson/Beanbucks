import React from "react";
import heroImage from "../assets/HeroImg.png"; // rename the file you downloaded to this
// ⬆️ make sure this matches the actual filename in your /assets folder

const HomepageCTA = ({
  drink = {
    name: "Caramel Cold Brew Bliss",
    tagline: "Smooth. Sweet. Iced to perfection.",
  },
  onCTAClick = () => console.log("Order Now clicked"),
}) => {
  return (
    <section
      style={{
        position: "relative",
        width: "calc(100% + 2rem)",
        minHeight: "70vh",
        backgroundImage: `url(${heroImage})`,
        backgroundSize: "cover",
        backgroundPosition: "top", // ← CHANGE THIS TO CHANGE THE POSITION OF THE IMAGE
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        boxSizing: "border-box",
        margin: "-1rem",
        padding: "2rem",
        color: "white",
        textShadow: "0 1px 4px rgba(0,0,0,0.6)",
      }}
    >
      <div
        style={{
          maxWidth: "500px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "1.5rem",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            color: "#FFFFFF",
            textShadow: "0 2px 6px rgba(0,0,0,0.5)",
          }}
        >
          {drink.tagline}
        </h1>

        <button
          onClick={onCTAClick}
          style={{
            backgroundColor: "var(--primary)",
            color: "var(--button-text)",
            border: "none",
            padding: "1rem 2.25rem",
            borderRadius: "999px",
            fontSize: "1.25rem",
            fontWeight: "600",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
        >
          Order Now
        </button>
      </div>
    </section>
  );
};

export default HomepageCTA;
