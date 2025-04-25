import React, { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "../DrinkModal.css";
import fillerImage from "../assets/no_image_found.png";
import CoffeeIcon from "@mui/icons-material/Coffee";
import AgricultureIcon from "@mui/icons-material/Agriculture"; // for Whole
import SpaIcon from "@mui/icons-material/Spa"; // for Oat
import EmojiNatureIcon from "@mui/icons-material/EmojiNature"; // for Soy or Almond
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import IcecreamIcon from "@mui/icons-material/Icecream"; // Whipped Cream
import AcUnitIcon from "@mui/icons-material/AcUnit"; // Flakes
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions"; // Marshmallows
import CookieIcon from "@mui/icons-material/Cookie"; // Chocolate Chips

const DrinkModal = ({ drink, onClose }) => {
  const [shots, setShots] = useState(1);
  const [selectedSize, setSelectedSize] = useState("Medium");
  const [selectedMilk, setSelectedMilk] = useState("Whole");
  const [selectedBean, setSelectedBean] = useState("Normal");
  const [syrupCounts, setSyrupCounts] = useState({
    Vanilla: 0,
    Caramel: 0,
    Hazelnut: 0,
    Mocha: 0,
    "Pumpkin Spice": 0,
  });
  const [selectedToppings, setSelectedToppings] = useState([]);
  const handleToppingToggle = (topping) => {
    if (selectedToppings.includes(topping)) {
      setSelectedToppings(selectedToppings.filter((t) => t !== topping));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const getTotalSyrups = () => {
    return Object.values(syrupCounts).reduce(
      (total, count) => total + count,
      0
    );
  };

  const increaseSyrup = (syrup) => {
    if (getTotalSyrups() < 5) {
      setSyrupCounts((prev) => ({
        ...prev,
        [syrup]: prev[syrup] + 1,
      }));
    }
  };

  const decreaseSyrup = (syrup) => {
    if (syrupCounts[syrup] > 0) {
      setSyrupCounts((prev) => ({
        ...prev,
        [syrup]: prev[syrup] - 1,
      }));
    }
  };

  useEffect(() => {
    if (drink) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drink]);

  if (!drink) return null;

  return (
    <div className="drink-modal-overlay" onClick={onClose}>
      <div
        className="drink-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ overflowY: "auto", maxHeight: "100vh" }}
      >
        <button className="back-button btn" onClick={onClose}>
          <ArrowBackIcon fontSize="large" />
        </button>

        <div className="modal-body">
          <div className="modal-left">
            <img src={fillerImage} alt={drink.name} />
          </div>

          <div className="modal-right">
            <h2>{drink.name}</h2>
            <div className="drink-options">
              {/*MAIN OPTIONS*/}
              <div className="main-options">
                {/* Size */}
                <div className="option-group">
                  <h3>Size</h3>
                  <div className="size-options">
                    {[
                      { label: "Small", size: "1.5rem" },
                      { label: "Medium", size: "2.2rem" },
                      { label: "Large", size: "3rem" },
                    ].map(({ label, size }) => (
                      <button
                        key={label}
                        className={`size-btn ${
                          selectedSize === label ? "selected" : ""
                        }`}
                        onClick={() => setSelectedSize(label)}
                      >
                        <CoffeeIcon style={{ fontSize: size }} />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Milk */}
                <div className="option-group">
                  <h3>Milk</h3>
                  <div className="milk-options">
                    {[
                      { label: "Whole", Icon: AgricultureIcon },
                      { label: "Oat", Icon: SpaIcon },
                      { label: "Soy", Icon: SpaIcon },
                      { label: "Almond", Icon: EmojiNatureIcon },
                    ].map(({ label, Icon }) => (
                      <button
                        key={label}
                        className={`milk-btn ${
                          selectedMilk === label ? "selected" : ""
                        }`}
                        onClick={() => setSelectedMilk(label)}
                      >
                        <Icon style={{ fontSize: "2rem" }} />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                {/* Beans */}
                <div className="option-group">
                  <h3>Beans</h3>
                  <div className="bean-options">
                    {[
                      { label: "Normal", Icon: CoffeeIcon },
                      { label: "Decaf", Icon: LocalCafeIcon },
                    ].map(({ label, Icon }) => (
                      <button
                        key={label}
                        className={`bean-btn ${
                          selectedBean === label ? "selected" : ""
                        }`}
                        onClick={() => setSelectedBean(label)}
                      >
                        <Icon style={{ fontSize: "2rem" }} />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {/* ADVANCE DROPDOWN */}
              <div className="advanced-options">
                {/* Shot Amount */}
                <div className="option-group">
                  <h3>Shot Amount</h3>
                  <div className="stepper">
                    <button onClick={() => setShots(Math.max(1, shots - 1))}>
                      -
                    </button>
                    <span>{shots}</span>
                    <button onClick={() => setShots(Math.min(8, shots + 1))}>
                      +
                    </button>
                  </div>
                </div>
                {/* Syrup */}
                <div className="option-group">
                  <h3>Syrup</h3>
                  <div className="syrup-stepper-list">
                    {Object.keys(syrupCounts).map((syrup) => (
                      <div key={syrup} className="syrup-stepper-item">
                        <span>{syrup}</span>
                        <div className="stepper">
                          <button onClick={() => decreaseSyrup(syrup)}>
                            -
                          </button>
                          <span>{syrupCounts[syrup]}</span>
                          <button onClick={() => increaseSyrup(syrup)}>
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Toppings */}
                {/* Toppings */}
                <div className="option-group">
                  <h3>Toppings</h3>
                  <div className="topping-boxes">
                    {[
                      { label: "Whipped Cream", Icon: IcecreamIcon },
                      { label: "Flakes", Icon: AcUnitIcon },
                      { label: "Marshmallows", Icon: EmojiEmotionsIcon },
                      { label: "Cinnamon", Icon: SpaIcon },
                      { label: "Chocolate Chips", Icon: CookieIcon },
                    ].map(({ label, Icon }) => (
                      <button
                        key={label}
                        className={`topping-box ${
                          selectedToppings.includes(label) ? "selected" : ""
                        }`}
                        onClick={() => handleToppingToggle(label)}
                      >
                        <Icon className="topping-icon" />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button className="add-to-cart-btn">Add to Cart</button>
      </div>
    </div>
  );
};

export default DrinkModal;
