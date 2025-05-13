import React from "react";

const BaristaSettingsModal = ({
  open,
  onClose,
  theme,
  onToggleTheme,
  soundEnabled,
  onToggleSound,
  focusMode,
  onToggleFocus,
}) => {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
      }}
    >
      <div
        style={{
          backgroundColor: "var(--card)",
          padding: "2rem",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        <h2 style={{ marginBottom: "1.5rem", color: "var(--text)" }}>
          Settings
        </h2>

        {/* Toggle: Dark Mode */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <span style={{ fontWeight: 500, color: "var(--text)" }}>
            Dark Mode
          </span>
          <input
            type="checkbox"
            checked={theme === "dark"}
            onChange={onToggleTheme}
            style={{
              width: "40px",
              height: "20px",
              cursor: "pointer",
              accentColor: "var(--primary)",
            }}
          />
        </div>

        {/* Toggle: Focus Mode */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.25rem",
          }}
        >
          <span style={{ fontWeight: 500, color: "var(--text)" }}>
            Focus Mode
          </span>
          <input
            type="checkbox"
            checked={focusMode}
            onChange={onToggleFocus}
            style={{
              width: "40px",
              height: "20px",
              cursor: "pointer",
              accentColor: "var(--primary)",
            }}
          />
        </div>
        <p
          style={{
            fontSize: "0.85rem",
            fontStyle: "italic",
            color: "var(--text)",
            marginBottom: "1rem",
            marginTop: 0,
          }}
        >
          Press Ctrl+F to toggle quickly
        </p>

        {/* Toggle: Notification Sounds */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <span style={{ fontWeight: 500, color: "var(--text)" }}>
            Notification Sounds
          </span>
          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={onToggleSound}
            style={{
              width: "40px",
              height: "20px",
              cursor: "pointer",
              accentColor: "var(--primary)",
            }}
          />
        </div>

        {/* Close Button */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button className="btn btn--outline" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BaristaSettingsModal;
