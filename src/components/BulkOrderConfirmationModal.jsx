import React from "react";

const BulkOrderConfirmationModal = ({
  title,
  text, // Optional paragraph text
  confirmLabel,
  cancelLabel,
  ingredients, // List of ingredients being ordered
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="modal-overlay" style={styles.overlay}>
      <div className="bulk-order-modal" style={styles.modal}>
        <h2 style={styles.title}>{title}</h2>

        {text && <p style={styles.text}>{text}</p>}

        {ingredients && ingredients.length > 0 && (
          <div style={styles.ingredientsList}>
            <h3 style={styles.ingredientsTitle}>Ingredients to be Ordered:</h3>
            <ul style={styles.ingredients}>
              {ingredients.map((ingredient, index) => (
                <li key={index} style={styles.ingredientItem}>
                  {ingredient.name} - {ingredient.quantity} {ingredient.unit}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div style={styles.actions}>
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

// Styles for the modal (only custom styles for the modal, not the buttons)
const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    padding: "10px", // Ensure some space for mobile screens
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "2rem",
    width: "90%", // Make modal take most of the screen on mobile
    maxWidth: "400px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "auto", // Allow modal to adjust based on content
    maxHeight: "80vh", // Prevent modal from overflowing the screen
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    textAlign: "center",
    color: "var(--heading-color)",
  },
  text: {
    marginBottom: "1.5rem",
    fontSize: "1rem",
    color: "var(--text)",
    textAlign: "center",
  },
  ingredientsList: {
    marginBottom: "1.5rem",
    width: "100%", // Ensure the list stretches on mobile
    overflowY: "auto", // Enable vertical scrolling
    maxHeight: "300px", // Set a max height for the ingredients list
  },
  ingredientsTitle: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: "var(--heading-color)",
    marginBottom: "0.5rem",
  },
  ingredients: {
    listStyleType: "none",
    paddingLeft: 0,
    margin: 0,
    fontSize: "1rem",
    color: "var(--text)",
  },
  ingredientItem: {
    marginBottom: "0.5rem",
    padding: "0.5rem",
    borderBottom: "1px solid #eee",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    gap: "1rem",
    width: "100%",
    marginTop: "auto", // Ensure the buttons stay at the bottom of the modal
  },
};

export default BulkOrderConfirmationModal;
