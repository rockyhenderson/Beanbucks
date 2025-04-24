import React, { useState, useEffect } from "react";

const EditStoreHoursModal = ({
  open_time,
  close_time,
  store_id,
  onSave,
  onCancel,
}) => {
  const [openTime, setOpenTime] = useState(open_time);
  const [closeTime, setCloseTime] = useState(close_time);

  // 🔍 Log what you're getting
  console.log("Modal received:", { open_time, close_time });

  useEffect(() => {
    setOpenTime(open_time);
    setCloseTime(close_time);
  }, [open_time, close_time]);

  return (
    <div className="modal-overlay">
      <div className="profile__logout-modal">
        <h2>Edit Store Hours</h2>

        <div style={{ marginBottom: "1rem" }}>
          <label>Open Time:</label>
          <input
            type="time"
            value={openTime}
            onChange={(e) => setOpenTime(e.target.value)}
            style={{ width: "100%", padding: "8px", margin: "5px 0" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Close Time:</label>
          <input
            type="time"
            value={closeTime}
            onChange={(e) => setCloseTime(e.target.value)}
            style={{ width: "100%", padding: "8px", margin: "5px 0" }}
          />
        </div>

        <div className="profile__logout-actions" style={{ marginTop: "20px" }}>
          <button
            className="btn btn--primary"
            onClick={() => onSave(store_id, openTime, closeTime)}
          >
            Save
          </button>
          <button className="btn btn--outline" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditStoreHoursModal;
