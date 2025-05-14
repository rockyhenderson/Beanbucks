import React, { useState, useEffect } from "react";
import TwoChoicesModal from "./TwoChoices";
const EditStockModal = ({ open, onClose, onSave, item }) => {
  const [stock, setStock] = useState(0);
  const [threshold, setThreshold] = useState(0);
  const [expiryDate, setExpiryDate] = useState("");
  const [isOutOfStock, setIsOutOfStock] = useState(false);
  const [showExpiryConfirm, setShowExpiryConfirm] = useState(false);
  const [originalExpiry, setOriginalExpiry] = useState("");
  const [warningAccepted, setWarningAccepted] = useState(() => {
    return sessionStorage.getItem("stock_warning_ack") === "true";
  });

  const handleSave = () => {
    // If expiry changed and the warning has been accepted, show confirm modal
    if (expiryDate !== originalExpiry && warningAccepted) {
      setShowExpiryConfirm(true);
      return;
    }

    // Otherwise, proceed
    onSave({
      ...item,
      stock,
      threshold,
      expiry_date: expiryDate || null,
      is_out_of_stock: isOutOfStock ? 1 : 0,
    });
  };

  useEffect(() => {
    if (item) {
      setStock(item.stock);
      setThreshold(item.threshold);

      if (item.expiry_date instanceof Date) {
        const formatted = item.expiry_date.toISOString().split("T")[0];
        setExpiryDate(formatted);
        setOriginalExpiry(formatted);
      } else if (typeof item.expiry_date === "string") {
        const parts = item.expiry_date.split("/");
        if (parts.length === 3) {
          const [day, month, year] = parts;
          const formatted = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
          setExpiryDate(formatted);
          setOriginalExpiry(formatted);
        } else {
          setExpiryDate(item.expiry_date);
          setOriginalExpiry(item.expiry_date);
        }
      }


      setIsOutOfStock(item.is_out_of_stock === "1" || item.is_out_of_stock === true);
      const stored = sessionStorage.getItem("stock_warning_ack");
      setWarningAccepted(stored === "true");
    }
  }, [item]);



  const isExpiredAndActive = !isOutOfStock && expiryDate && new Date(expiryDate) < new Date();

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "var(--card)",
          padding: "2rem",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        }}
      >
        <h2 style={{ marginBottom: "1rem", color: "var(--heading-color)" }}>
          Edit "{item?.name}"
        </h2>



        {/* Show a red alert if the item is marked as out of stock */}
        {isOutOfStock && (
          <div
            style={{
              backgroundColor: "#f8d7da",
              color: "#721c24",
              padding: "0.75rem 1rem",
              borderRadius: "6px",
              fontSize: "0.95rem",
              marginBottom: "1rem",
              border: "1px solid #f5c6cb",
              fontWeight: "bold",
            }}
          >
            ❌ This item is currently marked as <strong>out of stock</strong>. It will not be available for any drink orders.
          </div>
        )}

        {/* Show a yellow warning if it's expired and still active */}
        {!isOutOfStock && expiryDate && new Date(expiryDate) < new Date() && (
          <div
            style={{
              backgroundColor: "#fff3cd",
              color: "#856404",
              padding: "0.75rem 1rem",
              borderRadius: "6px",
              fontSize: "0.95rem",
              marginBottom: "1rem",
              border: "1px solid #ffeeba",
              fontWeight: "bold",
            }}
          >
            ⚠️ This item is <strong>expired</strong> but still active. Please mark it as out of stock to avoid order issues.
          </div>
        )}


        {!warningAccepted && (
          <div
            style={{
              backgroundColor: "#fff3cd",
              color: "#856404",
              padding: "0.75rem 1rem",
              borderRadius: "6px",
              fontSize: "0.92rem",
              marginBottom: "1.5rem",
              border: "1px solid #ffeeba",
            }}
          >
            ⚠️ Do not manually change the stock or expiry date unless instructed to do so by a manager.
            <div style={{ textAlign: "right", marginTop: "0.75rem" }}>
              <button
                onClick={() => {
                  sessionStorage.setItem("stock_warning_ack", "true");
                  setWarningAccepted(true);
                }}
                style={{
                  backgroundColor: "#856404",
                  color: "white",
                  padding: "0.6rem 1rem",
                  fontSize: "0.95rem",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                I Understand
              </button>

            </div>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={{ fontSize: "0.9rem", color: "var(--text)" }}>Stock Quantity</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(parseInt(e.target.value) || 0)}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                fontSize: "1rem",
                border: "1px solid var(--primary)",
                borderRadius: "6px",
                backgroundColor: "var(--input-bg)",
                color: "var(--text)",
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.9rem", color: "var(--text)" }}>Minimum Threshold</label>
            <input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(parseInt(e.target.value) || 0)}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                fontSize: "1rem",
                border: "1px solid var(--primary)",
                borderRadius: "6px",
                backgroundColor: "var(--input-bg)",
                color: "var(--text)",
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.9rem", color: "var(--text)" }}>Expiry Date</label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                fontSize: "1rem",
                border: "1px solid var(--primary)",
                borderRadius: "6px",
                backgroundColor: "var(--input-bg)",
                color: "var(--text)",
              }}
            />
          </div>

          {/* Modern Toggle Switch */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <label style={{ fontSize: "0.9rem", color: "var(--text)", flex: 1 }}>
              Mark as Out of Stock
            </label>
            <label style={{ position: "relative", display: "inline-block", width: "50px", height: "28px" }}>
              <input
                type="checkbox"
                checked={isOutOfStock}
                onChange={(e) => setIsOutOfStock(e.target.checked)}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span
                style={{
                  position: "absolute",
                  cursor: "pointer",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: isOutOfStock ? "#dc3545" : "#ccc",
                  transition: "0.4s",
                  borderRadius: "34px",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  height: "20px",
                  width: "20px",
                  left: isOutOfStock ? "26px" : "4px",
                  bottom: "4px",
                  backgroundColor: "white",
                  transition: "0.4s",
                  borderRadius: "50%",
                }}
              />
            </label>
          </div>
        </div>

        <div className="profile__logout-actions" style={{ marginTop: "2rem" }}>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => handleSave({ ...item, stock, threshold, expiry_date: expiryDate })}
            style={{ marginRight: "0.5rem" }}
          >
            Save Changes
          </button>

          <button
            type="button"
            className="btn btn--outline"
            onClick={onClose}
          >
            Cancel
          </button>

        </div>
      </div>
      {showExpiryConfirm && (
        <TwoChoicesModal
          title="Change Expiry Date?"
          text="Are you sure you want to change the expiry date? Only do this if a manager has explicitly instructed you to."
          confirmLabel="Yes, Change It"
          cancelLabel="Cancel"
          onConfirm={() => {
            setShowExpiryConfirm(false);
            onSave({
              ...item,
              stock,
              threshold,
              expiry_date: expiryDate || null,
              is_out_of_stock: isOutOfStock ? 1 : 0,
            });
          }}
          onCancel={() => setShowExpiryConfirm(false)}
        />
      )}

    </div>
  );
};

export default EditStockModal;
