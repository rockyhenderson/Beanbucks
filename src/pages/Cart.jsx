import React, { useEffect, useState } from "react";
import TwoChoicesModal from "../components/TwoChoices";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("beanbucks_cart");
    if (stored) {
      setCartItems(JSON.parse(stored));
    }
  }, []);

  const updateQuantity = (id, delta) => {
    const updated = cartItems.map((item) => {
      if (item.id === id) {
        const newQty = (item.qty || 1) + delta;
        return newQty < 1 ? null : { ...item, qty: newQty };
      }
      return item;
    }).filter(Boolean);

    setCartItems(updated);
    localStorage.setItem("beanbucks_cart", JSON.stringify(updated));
  };

  const handleRemove = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    localStorage.setItem("beanbucks_cart", JSON.stringify(updated));
  };

  const handleClearCart = () => {
    setCartItems([]);
    localStorage.removeItem("beanbucks_cart");
    setShowClearConfirm(false);
  };

  const getItemTotal = (item) => {
    const base = parseFloat(item.price) || 2.5;
    const shotCost = 0.5 * (item.shots - 1);
    const syrupCount = Object.values(item.syrups || {}).reduce((sum, n) => sum + n, 0);
    const syrupCost = 0.3 * syrupCount;
    const toppingCost = 0.4 * (item.toppings?.length || 0);
    const unitPrice = base + shotCost + syrupCost + toppingCost;
    return (unitPrice * (item.qty || 1)).toFixed(2);
  };

  const total = cartItems.reduce((sum, item) => sum + parseFloat(getItemTotal(item)), 0).toFixed(2);

  const qtyBtnStyle = {
    width: "32px",
    height: "32px",
    border: "1px solid var(--component-border)",
    background: "transparent",
    color: "var(--text)",
    fontSize: "1.1rem",
    fontWeight: "bold",
    borderRadius: "6px",
    cursor: "pointer"
  };

  return (
<div className="main-page-content" style={{ padding: "1rem", paddingTop: "2rem", maxWidth: "600px", margin: "1rem auto 0", fontFamily: "monospace", background: "var(--card)", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>

      <h1 style={{ textAlign: "center", borderBottom: "2px dashed var(--component-border)", paddingBottom: "1rem", }}>Cart</h1>

      {cartItems.length === 0 ? (
        <p style={{ textAlign: "center" }}>No items in cart.</p>
      ) : (
        <>
          <div className="receipt-items">
            {cartItems.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: "0.75rem 0",
                  borderBottom: "1px dotted var(--component-border)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.3rem"
                }}
              >
                <div style={{ fontSize: "1.1rem", fontWeight: "bold", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>{item.name}</span>
                  <button
                    onClick={() => handleRemove(item.id)}
                    style={{
                      border: "none",
                      background: "none",
                      color: "var(--danger)",
                      fontWeight: "bold",
                      fontSize: "1.4rem",
                      cursor: "pointer"
                    }}
                  >
                    ✕
                  </button>
                </div>
                <div>Size: {item.size} | Milk: {item.milk} | Beans: {item.beans}</div>
                <div>Shots: {item.shots}</div>
                {Object.entries(item.syrups || {}).some(([_, count]) => count > 0) && (
                  <div>Syrups: {Object.entries(item.syrups).filter(([_, count]) => count > 0).map(([syrup, count]) => `${syrup}(${count})`).join(", ")}</div>
                )}
                {item.toppings?.length > 0 && (
                  <div>Toppings: {item.toppings.join(", ")}</div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <button onClick={() => updateQuantity(item.id, -1)} style={qtyBtnStyle}>-</button>
                    <span>{item.qty || 1}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} style={qtyBtnStyle}>+</button>
                  </div>
                  <div style={{ fontWeight: "bold" }}>£{getItemTotal(item)}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "1.5rem", borderTop: "2px dashed var(--component-border)", paddingTop: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem", fontWeight: "bold" }}>
              <span>Total:</span>
              <span>£{total}</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "2rem" }}>
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
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--button-text)",
                border: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                fontWeight: 600,
              }}
              onClick={() => alert("Checkout coming soon!")}
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
