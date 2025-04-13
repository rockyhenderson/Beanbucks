import React, { useEffect } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "../DrinkModal.css";
import fillerImage from "../assets/no_image_found.png";

const DrinkModal = ({ drink, onClose }) => {
  useEffect(() => {
    // Only lock scroll if the modal is open
    if (drink) {
      document.body.classList.add("modal-open");
    }

    return () => {
      // Always remove scroll lock when modal is unmounted
      document.body.classList.remove("modal-open");
    };
  }, [drink]);

  if (!drink) return null;

  return (
    <div className="drink-modal-overlay" onClick={onClose}>
      <div className="drink-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="back-button btn" onClick={onClose}>
          <ArrowBackIcon fontSize="large" />
        </button>

        <div className="modal-body">
          <div className="modal-left">
            <img src={fillerImage} alt={drink.name} />
          </div>
          <div className="modal-right">
            <h2>{drink.name}</h2>
            <ul style={{ marginTop: "1rem", lineHeight: "1.6" }}>
              <li>
                <strong>Size</strong> – Small / Medium / Large
              </li>
              <li>
                <strong>Milk</strong> – Whole, Oat, Soy, Almond, etc.
              </li>
              <li>
                <strong>Syrup</strong> – Vanilla, Caramel, Hazelnut, etc.
              </li>
              <li>
                <strong>Shot Amount</strong> – Single / Double / Triple
              </li>
              <li>
                <strong>Beans</strong> – Normal / Decaf / Extra Strong
              </li>
              <li>
                <strong>Toppings</strong> – Whipped Cream, Flakes, Marshmallows
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrinkModal;
