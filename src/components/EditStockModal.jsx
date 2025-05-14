import React, { useState, useEffect } from "react";
import TwoChoicesModal from "./TwoChoices";
import CloseIcon from "@mui/icons-material/Close";

const EditStockModal = ({ open, onClose, onSave, onDelete, item, setToast, retryStock }) => {
  const [stock, setStock] = useState(0);
  const [threshold, setThreshold] = useState(0);
  const [expiryDate, setExpiryDate] = useState("");
  const [isOutOfStock, setIsOutOfStock] = useState(false);
  const [showExpiryConfirm, setShowExpiryConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [originalExpiry, setOriginalExpiry] = useState("");
  const [showOutOfStockConfirm, setShowOutOfStockConfirm] = useState(false);
  const [pendingOutOfStock, setPendingOutOfStock] = useState(false);
  const [warningAccepted, setWarningAccepted] = useState(() => {
    return sessionStorage.getItem("stock_warning_ack") === "true";
  });

  useEffect(() => {
    if (item) {
      console.log("Item in modal:", item); // Check the item passed to the modal
      setStock(item.stock);
      setThreshold(item.threshold);

      // Ensure expiry_date and store_id are set
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
      setWarningAccepted(sessionStorage.getItem("stock_warning_ack") === "true");
    }
  }, [item]);


const handleSave = () => {
  if (stock < 1) {
    setToast("Stock quantity cannot be less than 1", "error"); // Display error if stock is less than 1
    return;
  }

  // Preventing stock increase of more than 49%
  if (stock > item.stock * 1.49) {
    setToast("Big stock changes must be done in the Bulk Update tab", "error"); // Display error if stock increase is more than 49%
    return;
  }

  if (expiryDate !== originalExpiry && warningAccepted) {
    setShowExpiryConfirm(true);
    return;
  }

  onSave({
    ...item,
    store_id: item.store_id,
    ingredients: item.ingredients,
    stock,
    threshold,
    expiry_date: expiryDate || null,
    is_out_of_stock: isOutOfStock ? 1 : 0,
  });
};

  const handleClose = () => {
    onClose();

  };










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
        overflow: "auto",
        padding: "1rem",
      }}
    >
      <div
        style={{
          position: "relative",
          backgroundColor: "var(--card)",
          padding: "2rem",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "500px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* Close X Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "var(--text)",
            fontSize: "1.2rem",
          }}
          aria-label="Close"
        >
          <CloseIcon />
        </button>

        <h2 style={{ marginBottom: "1rem", color: "var(--heading-color)" }}>
          Edit "{item?.name}"
        </h2>

        {isOutOfStock && (
          <div style={alertStyle("red")}>
            ❌ This item is currently marked as <strong>out of stock</strong>.
          </div>
        )}

        {!isOutOfStock && expiryDate && new Date(expiryDate) < new Date() && (
          <div style={alertStyle("yellow")}>
            ⚠️ This item is <strong>expired</strong> but still active.
          </div>
        )}

        {!warningAccepted && (
          <div style={alertStyle("yellow")}>
            ⚠️ Do not manually change the stock or expiry unless instructed by a manager.
            <div style={{ textAlign: "right", marginTop: "0.75rem" }}>
              <button
                onClick={() => {
                  sessionStorage.setItem("stock_warning_ack", "true");
                  setWarningAccepted(true);
                }}
                style={ackButtonStyle}
              >
                I Understand
              </button>
            </div>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <LabeledInput label="Stock Quantity" value={stock} onChange={setStock} />
          <LabeledInput label="Minimum Threshold" value={threshold} onChange={setThreshold} />
          <LabeledDate label="Expiry Date" value={expiryDate} onChange={setExpiryDate} />
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <label style={{ fontSize: "0.9rem", color: "var(--text)", flex: 1 }}>
              Mark as Out of Stock
            </label>
            <label style={{ position: "relative", display: "inline-block", width: "50px", height: "28px" }}>
              <input
                type="checkbox"
                checked={isOutOfStock}
                onChange={(e) => {
                  const checked = e.target.checked;
                  if (checked && !isOutOfStock) {
                    setPendingOutOfStock(true);
                    setShowOutOfStockConfirm(true);
                  } else {
                    setIsOutOfStock(checked);
                  }
                }}

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
        <div
          style={{
            marginTop: "2.5rem",
            padding: "1.25rem",
            borderRadius: "12px",
            backgroundColor: "rgba(255, 0, 0, 0.05)", // very light red
            border: "1px solid rgba(220, 53, 69, 0.4)", // darker red border

          }}
        >
          Please only click this if you have permission from a manager.
          This will set the stock to <strong>zero</strong> and mark the ingredient as <strong>out of stock</strong>.

          <button
            onClick={() => {
              setShowDeleteConfirm(true); // Show confirmation dialog first
            }}
            style={{
              width: "100%",
              padding: "0.9rem 1.5rem",
              fontSize: "1rem",
              fontWeight: "600",
              borderRadius: "10px",
              backgroundColor: "rgba(255, 0, 0, 0.1)", // light red background
              color: "#dc3545", // red text
              border: "2px solid #dc3545", // strong red border
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
              marginTop: "1rem",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 0, 0, 0.15)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 0, 0, 0.1)";
            }}
          >
            Jettison Ingredient
          </button>
        </div>


        <div style={{ marginTop: "2rem", display: "flex", justifyContent: "space-between" }}>
          <button className="btn btn--primary" onClick={handleSave}>
            Save Changes
          </button>
          <button className="btn btn--outline" onClick={onClose}>
            Cancel
          </button>

        </div>
      </div>
      {showOutOfStockConfirm && (
        <TwoChoicesModal
          title="Manual Out of Stock"
          text="This is a manual override. You must remember to remove this flag when the item is back in stock."
          confirmLabel="Understood"
          cancelLabel="Cancel"
          onConfirm={() => {
            setIsOutOfStock(true);
            setShowOutOfStockConfirm(false);
            setPendingOutOfStock(false);
          }}
          onCancel={() => {
            setShowOutOfStockConfirm(false);
            setPendingOutOfStock(false);
          }}
        />
      )}

      {/* Confirm Change Expiry */}
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

      {/* Confirm Delete */}
      {showDeleteConfirm && (
        <TwoChoicesModal
          title="Jettison Ingredient Stock?"
          text={`This will set the stock of "${item?.name}" to 0 for this store.`}
          confirmLabel="Yes, Set to Zero"
          cancelLabel="Cancel"
          onConfirm={() => {
            onDelete(item); // This will trigger handleJettisonStock
            setShowDeleteConfirm(false);
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

    </div>
  );
};

export default EditStockModal;

// Helper Components & Styles
const LabeledInput = ({ label, value, onChange, minValue = 1 }) => (
  <div>
    <label style={{ fontSize: "0.9rem", color: "var(--text)" }}>{label}</label>
    <input
      type="number"
      value={value}
      onChange={(e) => {
        // Ensure it's a whole number and no less than minValue
        const newValue = parseInt(e.target.value, 10);
        if (newValue >= minValue) {
          onChange(newValue);
        }
      }}
      min={minValue} // Prevents entering values less than 1
      style={inputStyle}
    />
  </div>
);

const LabeledDate = ({ label, value, onChange }) => (
  <div>
    <label style={{ fontSize: "0.9rem", color: "var(--text)" }}>{label}</label>
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={inputStyle}
    />
  </div>
);

const inputStyle = {
  width: "100%",
  padding: "0.75rem 1rem",
  fontSize: "1rem",
  border: "1px solid var(--primary)",
  borderRadius: "6px",
  backgroundColor: "var(--input-bg)",
  color: "var(--text)",
};

const alertStyle = (type) => {
  const colors = {
    red: { bg: "#f8d7da", border: "#f5c6cb", text: "#721c24" },
    yellow: { bg: "#fff3cd", border: "#ffeeba", text: "#856404" },
  };
  const { bg, border, text } = colors[type] || {};
  return {
    backgroundColor: bg,
    color: text,
    padding: "0.75rem 1rem",
    borderRadius: "6px",
    fontSize: "0.95rem",
    marginBottom: "1rem",
    border: `1px solid ${border}`,
    fontWeight: "bold",
  };
};

const ackButtonStyle = {
  backgroundColor: "#856404",
  color: "white",
  padding: "0.6rem 1rem",
  fontSize: "0.95rem",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};
