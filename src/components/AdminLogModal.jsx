import React, { useEffect } from "react";

function AdminLogModal({ open, onClose, log }) {

  // Prevent background scroll and close modal on Escape key
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);
// Don't render anything if modal isn't open or log is missing
  if (!open || !log) return null;

// Overlay and modal container for viewing full admin log details
return (
  <div
    className="modal-overlay"

      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div
        className="profile__logout-modal"
        style={{
          backgroundColor: "var(--card)",
          padding: "2rem",
          borderRadius: "12px",
          maxWidth: "500px",
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Admin Log Details</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
// Render each log detail with label + value
<LogDetail label="ID" value={log.id} />

          <LogDetail label="Admin Email" value={log.admin_email} />
          <LogDetail label="Action Type" value={log.action_type} />
          <LogDetail label="Description" value={log.description} />
          <LogDetail label="Status" value={log.status} />
          <LogDetail label="Timestamp" value={log.created_at} />
        </div>

        <div className="profile__logout-actions" style={{ marginTop: "1.5rem" }}>
          <button className="btn btn--outline" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Small reusable component for displaying a single log field
function LogDetail({ label, value }) {

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span style={{ fontWeight: "bold", fontSize: "0.95rem", color: "var(--accent)" }}>
        {label}
      </span>
      <span style={{ fontSize: "1rem", color: "var(--text)", whiteSpace: "pre-wrap" }}>
        {value || "—"}
      </span>
    </div>
  );
}

export default AdminLogModal;
