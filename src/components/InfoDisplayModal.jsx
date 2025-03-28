import React from "react";
import CloseIcon from "@mui/icons-material/Close";

const InfoDisplayModal = ({ title, children, onClose, onConfirm, confirmLabel = "Confirm" }) => {
  return (
    <div className="modal-overlay">
      <div
        className="profile__logout-modal"
        style={{
          maxHeight: "80vh",
          overflowY: "auto",
          position: "relative",
        }}
      >
        {/* Header with X on the left and title next to it */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text)",
              opacity: 0.7,
              padding: 0,
            }}
            aria-label="Close"
          >
            <CloseIcon />
          </button>
          <h2 style={{ margin: 0 }}>{title}</h2>
        </div>

        {/* Modal Body */}
        <div
          style={{
            fontSize: "1rem",
            color: "var(--text)",
            lineHeight: "1.5",
          }}
        >
          {children}
        </div>

        {/* Confirm button if provided */}
        {onConfirm && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "1.5rem",
            }}
          >
            <button
              className="btn btn--primary"
              onClick={onConfirm}
            >
              {confirmLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoDisplayModal;
