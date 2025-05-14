import React, { useState } from "react";
import { useEffect } from "react";
const EditExpiryModal = ({ open, onClose, rule, onSave, setToast }) => {
  const [expiryDays, setExpiryDays] = useState(rule?.default_expiry || 0);
  const [loading, setLoading] = useState(false);

  // Calculate expiry date based on expiry days
  const calculateExpiryDate = (days) => {
    const today = new Date();
    const expiryDate = new Date(today);
    expiryDate.setDate(today.getDate() + parseInt(days, 10));
    return expiryDate.toDateString();
  };

  const handleSave = async () => {
    if (expiryDays <= 0) {
      // Using existing toast system to show the error message
      setToast({
        type: "danger",
        title: "Error",
        message: "Expiry days must be greater than 0.",
      });
      return;
    }

    setLoading(true); // Start loading
    try {
      const response = await fetch(
        "http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/admin/stock/update_stock_rule.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rule_id: rule.rule_id,
            default_expiry: expiryDays,
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        // Success toast
        setToast({
          type: "success",
          title: "Success",
          message: "Stock rule updated successfully.",
        });
        const updatedRule = { ...rule, default_expiry: expiryDays };
        onSave(updatedRule);
        onClose(); // Close modal
      } else {
        throw new Error(result.error || "Failed to update stock rule.");
      }
    } catch (error) {
      // Error toast
      setToast({
        type: "danger",
        title: "Error",
        message: error.message || "An error occurred while updating the stock rule.",
      });
    } finally {
      setLoading(false); // Stop loading
    }
  };
useEffect(() => {
  if (rule) {
    setExpiryDays(rule.default_expiry || 0); // Set expiryDays to the rule's default_expiry
  }
}, [rule]); // This will run whenever 'rule' changes

  if (!open) return null; // Don't render if modal is closed

  return (
    <div className="modal-overlay">
      <div className="profile__logout-modal">
        <h2>Edit Expiry Days</h2>
        <p style={{ marginBottom: "1rem", color: "var(--text)", fontSize: "0.95rem" }}>
          Edit the expiry days for <strong>{rule?.ingredient_group}</strong>.
        </p>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="expiryDays" style={{ display: "block", marginBottom: "0.5rem", color: "var(--text)" }}>
            Default Expiry (Days)
          </label>
          <input
            id="expiryDays"
            type="number"
            value={expiryDays}
            onChange={(e) => setExpiryDays(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid var(--component-border)",
              borderRadius: "4px",
              fontSize: "0.95rem",
            }}
          />
        </div>

        <p style={{ marginBottom: "1rem", color: "var(--text)", fontSize: "0.95rem" }}>
          Example: If you order today ({new Date().toDateString()}), it will expire on{" "}
          <strong>{calculateExpiryDate(expiryDays)}</strong>.
        </p>

        <div className="profile__logout-actions">
          <button
            className="btn btn--outline"
            onClick={onClose}
            disabled={loading}
            style={{ textTransform: "none", flex: 1 }}
          >
            Cancel
          </button>
          <button
            className="btn btn--primary"
            onClick={handleSave}
            disabled={loading}
            style={{ textTransform: "none", flex: 1 }}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditExpiryModal;
