import React from "react";
import CloseIcon from "@mui/icons-material/Close";

const ExpiredJettisonModal = ({ open, onClose, onConfirm, expiredItems }) => {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
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
          maxWidth: "600px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)",
          color: "var(--text)",
        }}
      >
        {/* Close Button */}
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
          Jettison Expired Ingredients
        </h2>

        <p style={{ marginBottom: "1rem", fontSize: "1rem" }}>
          The following ingredients are expired and will be set to <strong>stock 0</strong>. This cannot be undone.
        </p>

        <ul
          style={{
            listStyleType: "disc",
            paddingLeft: "1.5rem",
            marginBottom: "2rem",
            color: "var(--list-text)",
          }}
        >
          {expiredItems.map((item, index) => (
            <li key={index}>
              {item.name} — {new Date(item.expiry_date).toLocaleDateString()}
            </li>
          ))}
        </ul>

        <div className="profile__logout-actions">
          <button className="btn btn--primary" onClick={onConfirm}>
            Yes, Jettison All
          </button>
          <button className="btn btn--outline" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpiredJettisonModal;
