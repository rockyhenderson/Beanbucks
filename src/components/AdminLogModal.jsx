import React from "react";

function AdminLogModal({ open, onClose, log }) {
  if (!open || !log) return null;

  return (
    <div className="modal-overlay">
      <div className="profile__logout-modal" style={{ maxWidth: 500 }}>
        <h2>Admin Log Details</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
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

function LogDetail({ label, value }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span style={{ fontWeight: "bold", fontSize: "0.95rem", color: "var(--accent)" }}>
        {label}
      </span>
      <span style={{ fontSize: "1rem", color: "var(--text)" }}>
        {value || "—"}
      </span>
    </div>
  );
}

export default AdminLogModal;
