import React, { useEffect, useState } from "react";
import TwoChoicesModal from "../components/TwoChoices";
import { useNavigate } from "react-router-dom";

const MAX_QUANTITY = 10;

const priceModifiers = {
  size: { Small: 0, Medium: 0.5, Large: 1.0 },
  milk: { Whole: 0, Oat: 0.4, Soy: 0.4, Almond: 0.4 },
  beans: { Normal: 0, Decaf: 0.3 },
  shot: 0.5,
  syrup: 0.3,
  topping: 0.4,
};

function Cart({ cartItemCount, setCartItemCount }) {
  const [cartItems, setCartItems] = useState([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("beanbucks_cart");
    if (stored) setCartItems(JSON.parse(stored));
    if (stored) {
      const parsed = JSON.parse(stored);
      const patched = parsed.map((item) => ({
        size: item.size || "",
        milk: item.milk || "",
        beans: item.beans || "",
        shots: item.shots ?? 1,
        syrups: item.syrups || {},
        toppings: item.toppings || [],
        qty: item.qty || 1,
        ...item,
      }));
      setCartItems(patched);
    }
    
  }, []);

  const updateQuantity = (id, delta) => {
    const updated = cartItems.map((item) => {
      if (item.id === id) {
        const newQty = (item.qty || 1) + delta;
        return { ...item, qty: Math.max(1, Math.min(MAX_QUANTITY, newQty)) };
      }
      return item;
    });
    syncCart(updated);
  };


  const handleRemove = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    syncCart(updated);
  };


  const handleClearCart = () => {
    syncCart([]);
    setShowClearConfirm(false);
  };


  const getItemTotal = (item) => {
    const base = Number.isFinite(parseFloat(item.price)) ? parseFloat(item.price) : 2.5;
    const size = priceModifiers.size[item.size] || 0;
    const milk = priceModifiers.milk[item.milk] || 0;
    const beans = priceModifiers.beans[item.beans] || 0;
    const shots = Math.max(0, (item.shots || 1) - 1) * priceModifiers.shot;
    const syrups =
      Object.values(item.syrups || {}).reduce((sum, c) => sum + c, 0) *
      priceModifiers.syrup;
    const toppings = (item.toppings?.length || 0) * priceModifiers.topping;
  
    const unitPrice = base + size + milk + beans + shots + syrups + toppings;
    return (unitPrice * (item.qty || 1)).toFixed(2);
  };
  

  const total = cartItems
    .reduce((sum, item) => sum + parseFloat(getItemTotal(item)), 0)
    .toFixed(2);

  const qtyBtnStyle = {
    width: "32px",
    height: "32px",
    border: "1px solid var(--component-border)",
    background: "transparent",
    color: "var(--text)",
    fontSize: "1.1rem",
    fontWeight: "bold",
    borderRadius: "6px",
    cursor: "pointer",
  };
  const syncCart = (newCart) => {
    setCartItems(newCart);
    localStorage.setItem("beanbucks_cart", JSON.stringify(newCart));
    if (setCartItemCount) {
      const count = newCart.reduce((sum, item) => sum + (item.qty || 1), 0);
      setCartItemCount(count);
    }
  };

  return (
    <div
      className="main-page-content"
      style={{
        padding: "1rem",
        paddingTop: "2rem",
        maxWidth: "600px",
        margin: "1rem auto 0",
        fontFamily: "monospace",
        background: "var(--card)",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          borderBottom: "2px dashed var(--component-border)",
          paddingBottom: "1rem",
        }}
      >
        Cart
      </h1>

      {cartItems.length === 0 ? (
        <p style={{ textAlign: "center" }}>No items in cart.</p>
      ) : (
        <>
          <div className="receipt-items">
            {cartItems.map((item) => {
              const syrupCount = Object.values(item.syrups || {}).reduce(
                (sum, n) => sum + n,
                0
              );
              return (
                <div
                  key={item.id}
                  style={{
                    padding: "0.75rem 0",
                    borderBottom: "1px dotted var(--component-border)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.3rem",
                  }}
                >
                  <div
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>{item.name}</span>
                    <button
                      onClick={() => handleRemove(item.id)}
                      style={{
                        border: "none",
                        background: "none",
                        color: "var(--danger)",
                        fontWeight: "bold",
                        fontSize: "1.4rem",
                        cursor: "pointer",
                      }}
                    >
                      ✕
                    </button>
                  </div>

                  <div>
                    Size: {item.size}
                    {priceModifiers.size[item.size] > 0 &&
                      ` (+£${priceModifiers.size[item.size].toFixed(2)})`}
                    {" | "}Milk: {item.milk}
                    {priceModifiers.milk[item.milk] > 0 &&
                      ` (+£${priceModifiers.milk[item.milk].toFixed(2)})`}
                    {" | "}Beans: {item.beans}
                    {priceModifiers.beans[item.beans] > 0 &&
                      ` (+£${priceModifiers.beans[item.beans].toFixed(2)})`}
                  </div>

                  <div>
                    Shots: {item.shots}
                    {item.shots > 1 &&
                      ` (+£${((item.shots - 1) * priceModifiers.shot).toFixed(
                        2
                      )})`}
                  </div>

                  {syrupCount > 0 && (
                    <div>
                      Syrups:{" "}
                      {Object.entries(item.syrups)
                        .filter(([_, c]) => c > 0)
                        .map(([s, c]) => `${s}(${c})`)
                        .join(", ")}{" "}
                      (+£{(syrupCount * priceModifiers.syrup).toFixed(2)})
                    </div>
                  )}

                  {item.toppings?.length > 0 && (
                    <div>
                      Toppings: {item.toppings.join(", ")} (+£
                      {(item.toppings.length * priceModifiers.topping).toFixed(
                        2
                      )}
                      )
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "0.5rem",
                    }}
                  >
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        style={qtyBtnStyle}
                      >
                        −
                      </button>
                      <span>{item.qty || 1}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        style={qtyBtnStyle}
                      >
                        +
                      </button>
                    </div>
                    <strong>£{getItemTotal(item)}</strong>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              marginTop: "1.5rem",
              borderTop: "2px dashed var(--component-border)",
              paddingTop: "1rem",
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "bold",
              fontSize: "1.2rem",
            }}
          >
            <span>Total:</span>
            <span>£{total}</span>
          </div>

          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <button
              className="btn"
              style={{
                backgroundColor: "var(--danger)",
                color: "white",
                border: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                fontWeight: 600,
              }}
              onClick={() => setShowClearConfirm(true)}
            >
              Clear Cart
            </button>

            <button
              className="btn"
              disabled={!!sessionStorage.getItem("activeOrder")}
              style={{
                backgroundColor: sessionStorage.getItem("activeOrder")
                  ? "#ccc"
                  : "var(--primary)",
                color: "var(--button-text)",
                border: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                fontWeight: 600,
                cursor: sessionStorage.getItem("activeOrder")
                  ? "not-allowed"
                  : "pointer",
                opacity: sessionStorage.getItem("activeOrder") ? 0.6 : 1,
              }}
              onClick={() => {
                const activeOrder = sessionStorage.getItem("activeOrder");
                if (activeOrder) {
                  if (window?.showGlobalToast) {
                    window.showGlobalToast({
                      type: "info",
                      title: "Active Order",
                      message:
                        "You already have an order in progress. Please wait until it’s completed before placing another.",
                    });
                  }
                  return;
                }

                navigate("/confirm-order");
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}

      {showClearConfirm && (
        <TwoChoicesModal
          title="Clear Cart"
          text="Are you sure you want to remove all items from your cart?"
          confirmLabel="Yes, clear it"
          cancelLabel="Cancel"
          onConfirm={handleClearCart}
          onCancel={() => setShowClearConfirm(false)}
        />
      )}
    </div>
  );
}

export default Cart;
