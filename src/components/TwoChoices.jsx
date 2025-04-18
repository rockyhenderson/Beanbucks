import React from "react";

const TwoChoicesModal = ({
  title,
  text, // 👈 Optional paragraph text
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="modal-overlay">
      <div className="profile__logout-modal">
        <h2>{title}</h2>

        {text && (
          <p style={{ marginBottom: "1rem", color: "var(--text)", fontSize: "0.95rem" }}>
            {text}
          </p>
        )}

        <div className="profile__logout-actions">
          <button className="btn btn--primary" onClick={onConfirm}>
            {confirmLabel}
          </button>
          <button className="btn btn--outline" onClick={onCancel}>
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwoChoicesModal;
