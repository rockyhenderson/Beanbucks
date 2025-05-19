import React, { useState, useEffect } from 'react';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "../DrinkModal.css";
import noImage from '../../public/img/Fallback.png'
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
import TwoChoicesModal from "../components/TwoChoices";





const storeId = sessionStorage.getItem("selectedStoreId");

const DrinkModal = ({ drink, onClose, setToast, setCartItemCount, getCartItemCount }) => {

  

  const [showOptions, setShowOptions] = useState(false);
  const [allergenWarning, setAllergenWarning] = useState(null);
  const [showAllergenModal, setShowAllergenModal] = useState(false);
  const [matchedAllergenNames, setMatchedAllergenNames] = useState([]);
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
  const allergenMap = {
    1: "Milk",
    2: "Eggs",
    3: "Peanuts",
    4: "Soy",
    5: "Gluten",
    6: "Sesame",
    7: "Coconut",
    8: "Oats",
    9: "Chocolate",
    10: "Corn",
    11: "Cinnamon",
    12: "Caffeine",
  };

  const allergenNameToId = Object.entries(allergenMap).reduce((acc, [id, name]) => {
    acc[name] = id;
    return acc;
  }, {});

  useEffect(() => {
    if (!drink?.allergen) return;

    const user = JSON.parse(sessionStorage.getItem("user"));
    const userAllergens = (user?.allergens || []).map((val) => {
      const entry = typeof val === "string" ? val : String(val);
      return allergenNameToId[entry] || entry;
    });

    const drinkAllergens = drink.allergen.split(",").map((id) => id.trim());

    const matched = drinkAllergens.filter((id) => userAllergens.includes(id));
    if (matched.length > 0) {
      const matchedNames = matched.map((id) => allergenMap[id]).filter(Boolean);
      setMatchedAllergenNames(matchedNames);
      setShowAllergenModal(true);
    }
  }, [drink]);



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
  const handleAddToCart = () => {
    const isFood = drink.category?.toLowerCase() === "food";
  
    const cartItem = {
      id: crypto.randomUUID(),
      drinkId: drink.id,
      name: drink.name,
      description: drink.description,
      price: drink.price || null,
      category: drink.category?.toLowerCase() || "drink",
      timeAdded: Date.now(),
      ...(isFood
        ? {} // No custom options for food
        : {
            size: selectedSize,
            milk: selectedMilk,
            beans: selectedBean,
            shots,
            syrups: syrupCounts,
            toppings: selectedToppings,
          }),
    };
  
    const storedCart = localStorage.getItem("beanbucks_cart");
    const cart = storedCart ? JSON.parse(storedCart) : [];
  
    cart.push(cartItem);
    localStorage.setItem("beanbucks_cart", JSON.stringify(cart));
  
    console.log("Cart item added:", cartItem);
    setCartItemCount(getCartItemCount());
    onClose();
  };
  




  useEffect(() => {
    if (drink) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drink]);

  if (!drink) return null;
  const editable = parseInt(drink.editable ?? 0); // force convert

  return (
    <div className="drink-modal-overlay" onClick={showAllergenModal ? undefined : onClose}>
      {showAllergenModal && (
        <TwoChoicesModal
          title="Allergen Warning"
          text={`This drink contains: ${matchedAllergenNames.join(", ")}. Are you sure you want to continue?`}
          confirmLabel="Yes, continue"
          cancelLabel="Cancel"
          onConfirm={() => {
            setShowAllergenModal(false); // ✅ keep DrinkModal open
          }}
          onCancel={() => {
            setShowAllergenModal(false);
            onClose(); // ❌ user chooses to back out completely
          }}
        />
      )}


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
            {drink.image ? (
              <img
                src={drink.image}
                alt={drink.name}
                onError={(e) => { e.target.onerror = null; e.target.src = noImage; }}
              />
            ) : (
              <img src={noImage} alt="Fallback drink image" />
            )}

          </div>

          <div className="modal-right">
            <div className="drink-info-container">
              <h2 className="drink-title">{drink.name}</h2>
              <div className="tag-container" style={{ marginBottom: "1rem" }}>
                {editable === 1 && <span className="tag">Customizable</span>}

                {(() => {
                  if (drink.allergen) {
                    const ids = drink.allergen.split(",").map((id) => id.trim());
                    const names = ids.map((id) => allergenMap[id]).filter(Boolean);
                    console.log("Parsed allergen IDs:", ids);
                    console.log("Mapped allergen names:", names);
                    return names.map((name, index) => (
                      <span className="tag" key={index}>{name}</span>
                    ));
                  }
                  return null;
                })()}
              </div>


              {drink.description && (
                <p className="drink-description">{drink.description}</p>
              )}

            </div>
            {editable === 1 && (
              <>
                {customizationsError ? (
                  <RetryFallback
                    onRetry={retryCustomizations}
                    isLoading={isLoadingCustomizations}
                    message="Failed to load customization options. Please try again!"
                  />
                ) : (
                  <>
                    {/* Size */}
                    <div className="option-group" style={{ paddingLeft: "1.5rem" }}>
                      <h3>Size</h3>
                      <div className="size-options">
                        {[
                          { label: "Small", backendName: "Small Cup", size: "1.5rem" },
                          { label: "Medium", backendName: "Medium Cup", size: "2.2rem" },
                          { label: "Large", backendName: "Large Cup", size: "3rem" },
                        ].map(({ label, backendName, size }) => {
                          const disabled = !isOptionEnabled("size", backendName);
                          return (
                            <button
                              key={label}
                              className={`size-btn ${selectedSize === label ? "selected" : ""} ${disabled ? "disabled" : ""}`}
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
                        })
                        }
                      </div>
                    </div>
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

                          {/* Milk */}
                          <div className="option-group">
                            <h3>Milk</h3>
                            <div className="milk-options">
                              {[
                                { label: "Whole", backendName: "Whole Milk", Icon: AgricultureIcon },
                                { label: "Oat", backendName: "Oat Milk", Icon: SpaIcon },
                                { label: "Soy", backendName: "Soy Milk", Icon: SpaIcon },
                                { label: "Almond", backendName: "Almond Milk", Icon: EmojiNatureIcon },
                              ].map(({ label, Icon, backendName }) => {
                                const disabled = !isOptionEnabled("milk", backendName);
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
                                { label: "Normal", backendName: "Coffee Beans", Icon: CoffeeIcon },
                                { label: "Decaf", backendName: "Decaf Coffee Beans", Icon: LocalCafeIcon },

                              ].map(({ label, Icon, backendName }) => {
                                const disabled = !isOptionEnabled("beans", backendName);
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
                                {[
                                  { label: "Vanilla", backendName: "Vanilla Syrup" },
                                  { label: "Caramel", backendName: "Caramel Syrup" },
                                  { label: "Hazelnut", backendName: "Hazelnut Syrup" },
                                  { label: "Mocha", backendName: "Mocha Syrup" },
                                  { label: "Pumpkin Spice", backendName: "Pumpkin Spice" },
                                ].map(({ label, backendName }) =>
                                  isOptionEnabled("syrup", backendName) && (
                                    <div key={label} className="syrup-stepper-item">
                                      <span>{label}</span>
                                      <div className="stepper">
                                        <button onClick={() => decreaseSyrup(label)}>-</button>
                                        <span>{syrupCounts[label]}</span>
                                        <button onClick={() => increaseSyrup(label)}>+</button>
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
                                  { label: "Whipped Cream", backendName: "Whipped Cream", Icon: IcecreamIcon },
                                  { label: "Flakes", backendName: "Flakes", Icon: AcUnitIcon },
                                  { label: "Marshmallows", backendName: "Marshmallows", Icon: EmojiEmotionsIcon },
                                  { label: "Cinnamon", backendName: "Cinnamon", Icon: SpaIcon },
                                  { label: "Chocolate Chips", backendName: "Java Chips", Icon: CookieIcon },

                                ].map(({ label, Icon, backendName }) => {
                                  const disabled = !isOptionEnabled("topping", backendName);
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
              </>
            )}
          </div>
        </div>

        <button className="add-to-cart-btn" onClick={handleAddToCart}>Add to Cart</button>

      </div>

    </div>
  );
}

export default DrinkModal;
