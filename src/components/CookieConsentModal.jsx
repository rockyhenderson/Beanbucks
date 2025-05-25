import React from "react";
import { Link } from "react-router-dom";

const CookieConsentModal = ({ onClose }) => {
  const handleAccept = () => {
    // Set a dummy cookie with a random string
    const randomId = Math.random().toString(36).substring(2);
    document.cookie = `beanbucks_dummy_cookie=${randomId}; path=/; max-age=31536000`; // valid for 1 year
    localStorage.setItem("cookieConsent", "true");

    if (typeof onClose === "function") onClose();
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "false");

    if (typeof onClose === "function") onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="profile__logout-modal">
        <h2>We Use Cookies 🍪</h2>

        <p style={{ marginBottom: "1rem", color: "var(--text)", fontSize: "0.95rem" }}>
          We use cookies to improve your experience and analyze site traffic.
          Read our{" "}
          <Link
            to="/cookies"
            onClick={(e) => e.stopPropagation()}
            style={{
              color: "var(--primary)",
              textDecoration: "underline",
              fontWeight: 500,
            }}
          >
            Cookie Policy
          </Link>{" "}
          for more information.
        </p>

        <div className="profile__logout-actions">
          <button className="btn btn--primary" onClick={handleAccept}>
            Yes, that's okay
          </button>
          <button className="btn btn--outline" onClick={handleDecline}>
            No, thanks
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentModal;
