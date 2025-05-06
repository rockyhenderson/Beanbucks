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
import useFetchWithRetry from "../utils/useFetchWithRetry";
import RetryFallback from "../components/RetryFallback";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import Toast from "../components/Toast";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";



const storeId = sessionStorage.getItem("selectedStoreId");

const DrinkModal = ({ drink, onClose }) => {
  const [showOptions, setShowOptions] = useState(false);

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
  const {
    data: availableCustomizations,
    error: customizationsError,
    retry: retryCustomizations,
    isLoading: isLoadingCustomizations,
  } = useFetchWithRetry(
    storeId
      ? `http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/public/get_store_customizations.php?store_id=${storeId}`
      : null
  );
  const isOptionEnabled = (type, name) => {
    if (!availableCustomizations) return false;
    return availableCustomizations.some(
      (option) => option.type === type && option.name === name
    );
  };
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
            {fillerImage ? (
              <img src={fillerImage} alt={drink.name} />
            ) : (
              <div className="no-image-fallback">
                <CoffeeIcon className="no-image-icon" />
                <p>Image coming soon!</p>
              </div>
            )}
          </div>

          <div className="modal-right">
            <div className="drink-info-container">
              <h2 className="drink-title">{drink.name}</h2>
              <div className="tag-container" style={{ marginBottom: "1rem" }}>
                <span className="tag">Customizable</span>
                <span className="tag">Caffeinated</span>
              </div>
              {drink.description && (
                <p className="drink-description">{drink.description}</p>
              )}

            </div>

            {customizationsError ? (
              <RetryFallback
                onRetry={retryCustomizations}
                isLoading={isLoadingCustomizations}
                message="Failed to load customization options. Please try again!"
              />
            ) : (
              <>
                <div className="edit-options-wrapper">
                  <button
                    className="edit-options-toggle"
                    onClick={() => setShowOptions((prev) => !prev)}
                  >
                    <span>Edit Drink Options</span>
                    <span
                      className="toggle-arrow"
                      style={{
                        display: "inline-flex",
                        transition: "transform 0.3s ease",
                        transform: showOptions ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    >
                      <ExpandMoreIcon fontSize="medium" />
                    </span>
                  </button>
                </div>
                {showOptions && (
                  <div
                    className="drink-options"
                    style={{
                      maxHeight: showOptions ? "1000px" : "0",
                      transition: "max-height 0.4s ease",
                    }}
                  >
                    {/* MAIN OPTIONS */}
                    <div className="main-options">
                      {/* Size */}
                      <div className="option-group">
                        <h3>Size</h3>
                        <div className="size-options">
                          {[
                            { label: "Small", size: "1.5rem" },
                            { label: "Medium", size: "2.2rem" },
                            { label: "Large", size: "3rem" },
                          ].map(({ label, size }) => {
                            const disabled = !isOptionEnabled("size", label);
                            return (
                              <button
                                key={label}
                                className={`size-btn ${selectedSize === label ? "selected" : ""
                                  } ${disabled ? "disabled" : ""}`}
                                onClick={() => {
                                  if (!disabled) setSelectedSize(label);
                                }}
                              >
                                {disabled ? (
                                  <DoNotDisturbIcon style={{ fontSize: size }} />
                                ) : (
                                  <CoffeeIcon style={{ fontSize: size }} />
                                )}
                                <span>{label}</span>
                              </button>
                            );
                          })}
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
                          ].map(({ label, Icon }) => {
                            const disabled = !isOptionEnabled("milk", label);
                            return (
                              <button
                                key={label}
                                className={`milk-btn ${selectedMilk === label ? "selected" : ""
                                  } ${disabled ? "disabled" : ""}`}
                                onClick={() => {
                                  if (!disabled) setSelectedMilk(label);
                                }}
                              >
                                {disabled ? (
                                  <DoNotDisturbIcon style={{ fontSize: "4rem" }} />
                                ) : (
                                  <Icon style={{ fontSize: "2rem" }} />
                                )}
                                <span>{label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Beans */}
                      <div className="option-group">
                        <h3>Beans</h3>
                        <div className="bean-options">
                          {[
                            { label: "Normal", Icon: CoffeeIcon },
                            { label: "Decaf", Icon: LocalCafeIcon },
                          ].map(({ label, Icon }) => {
                            const disabled = !isOptionEnabled("beans", label);
                            return (
                              <button
                                key={label}
                                className={`bean-btn ${selectedBean === label ? "selected" : ""
                                  } ${disabled ? "disabled" : ""}`}
                                onClick={() => {
                                  if (!disabled) setSelectedBean(label);
                                }}
                              >
                                {disabled ? (
                                  <DoNotDisturbIcon style={{ fontSize: "4rem" }} />
                                ) : (
                                  <Icon style={{ fontSize: "2rem" }} />
                                )}
                                <span>{label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* ADVANCED OPTIONS */}
                    <div className="advanced-options">
                      {/* Shot Amount */}
                      <div className="option-group">
                        <h3>Shot Amount</h3>
                        <div className="stepper">
                          <button onClick={() => setShots(Math.max(1, shots - 1))}>-</button>
                          <span>{shots}</span>
                          <button onClick={() => setShots(Math.min(8, shots + 1))}>+</button>
                        </div>
                      </div>

                      {/* Syrup */}
                      {availableCustomizations?.some((c) => c.type === "syrup") && (
                        <div className="option-group">
                          <h3>Syrup</h3>
                          <div className="syrup-stepper-list">
                            {Object.keys(syrupCounts).map(
                              (syrup) =>
                                isOptionEnabled("syrup", syrup) && (
                                  <div key={syrup} className="syrup-stepper-item">
                                    <span>{syrup}</span>
                                    <div className="stepper">
                                      <button onClick={() => decreaseSyrup(syrup)}>-</button>
                                      <span>{syrupCounts[syrup]}</span>
                                      <button onClick={() => increaseSyrup(syrup)}>+</button>
                                    </div>
                                  </div>
                                )
                            )}
                          </div>
                        </div>
                      )}

                      {/* Toppings */}
                      {availableCustomizations?.some((c) => c.type === "topping") && (
                        <div className="option-group">
                          <h3>Toppings</h3>
                          <div className="topping-boxes">
                            {[
                              { label: "Whipped Cream", Icon: IcecreamIcon },
                              { label: "Flakes", Icon: AcUnitIcon },
                              { label: "Marshmallows", Icon: EmojiEmotionsIcon },
                              { label: "Cinnamon", Icon: SpaIcon },
                              { label: "Chocolate Chips", Icon: CookieIcon },
                            ].map(({ label, Icon }) => {
                              const disabled = !isOptionEnabled("topping", label);
                              return (
                                !disabled && (
                                  <button
                                    key={label}
                                    className={`topping-box ${selectedToppings.includes(label) ? "selected" : ""
                                      }`}
                                    onClick={() => handleToppingToggle(label)}
                                  >
                                    <Icon className="topping-icon" />
                                    <span>{label}</span>
                                  </button>
                                )
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <button className="add-to-cart-btn">Add to Cart</button>
      </div>
    </div>
  );
}

export default DrinkModal;
