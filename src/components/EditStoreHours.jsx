import React, { useState, useEffect } from "react";

const EditStoreHoursModal = ({
  store_id,
  open_time,
  close_time,
  open,
  onCancel,
  onSave,
}) => {
  const [openTime, setOpenTime] = useState(open_time || "");
  const [closeTime, setCloseTime] = useState(close_time || "");
  const [error, setError] = useState("");

  useEffect(() => {
    setOpenTime(open_time || "");
    setCloseTime(close_time || "");
    setError(""); // Clear errors when new times are passed in
  }, [open_time, close_time]);

  const isValidTime = (value) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);

  const handleSave = () => {
    if (!openTime || !closeTime) {
      setError("Both times are required.");
      return;
    }

    if (!isValidTime(openTime) || !isValidTime(closeTime)) {
      setError("Please enter valid times in HH:MM format.");
      return;
    }

    setError("");
    onSave(store_id, openTime, closeTime);
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="profile__logout-modal" style={{ maxWidth: "450px" }}>
        <h2>Edit Store Hours</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
          <div>
            <label style={labelStyle}>Open Time</label>
            <input
              type="time"
              value={openTime}
              onChange={(e) => setOpenTime(e.target.value)}
              className="profile__input"
            />
          </div>

          <div>
            <label style={labelStyle}>Close Time</label>
            <input
              type="time"
              value={closeTime}
              onChange={(e) => setCloseTime(e.target.value)}
              className="profile__input"
            />
          </div>

          {error && (
            <p style={{ color: "var(--danger)", fontSize: "0.9rem", marginTop: "-0.5rem" }}>
              ⚠️ {error}
            </p>
          )}
        </div>

        <div className="profile__logout-actions" style={{ marginTop: "24px" }}>
          <button className="btn btn--primary" onClick={handleSave}>
            Save Changes
          </button>
          <button className="btn btn--outline" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const labelStyle = {
  fontWeight: "bold",
  fontSize: "1.1rem",
  marginBottom: "0.3rem",
  display: "block",
  textAlign: "left",
};

export default EditStoreHoursModal;
