import React, { useEffect, useState } from "react";
import { Close } from "@mui/icons-material";

function CreateUserModal({ onCancel, onSubmit, infoText, showToast }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    loyaltyPoints: 0,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    const newErrors = {};

    if (formData.firstName.trim().length < 2)
      newErrors.firstName = "First name too short.";
    if (formData.lastName.trim().length < 2)
      newErrors.lastName = "Last name too short.";
    if (!formData.email.includes("@"))
      newErrors.email = "Invalid email address.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast?.({
        type: "error",
        title: "Invalid Input",
        message: "Please fix the highlighted fields.",
      });
      return;
    }

    try {
      const message = await onSubmit(formData); // will throw if failed
      showToast?.({
        type: "success",
        title: "User Created",
        message: message,
      });
      onCancel(); // closes the modal
    } catch (err) {
      showToast?.({
        type: "error",
        title: "Create Failed",
        message: err.message || "Something went wrong.",
      });
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={getModalContainerStyle()}>
        <div style={modalContentStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2>Create User</h2>
            <Close
              onClick={onCancel}
              style={{
                cursor: "pointer",
                color: "var(--text)",
                fontSize: "1.5rem",
              }}
            />
          </div>

          {infoText && (
            <div
              style={{
                backgroundColor: "#fff3e5",
                padding: "0.75rem 1rem",
                borderRadius: "6px",
                marginBottom: "1rem",
                color: "#804500",
                fontSize: "0.95rem",
                lineHeight: 1.5,
              }}
            >
              {infoText}
            </div>
          )}

          <div className="profile__form-group" style={{ textAlign: "left" }}>
            <label style={labelStyle}>First Name</label>
            <input
              value={formData.firstName}
              onChange={handleChange("firstName")}
              placeholder="Enter first name"
              className="profile__input"
              style={getInputStyle(errors.firstName)}
              onFocus={focusStyle}
              onBlur={blurStyle}
            />
            {errors.firstName && <ErrorText message={errors.firstName} />}
          </div>

          <div className="profile__form-group" style={{ textAlign: "left" }}>
            <label style={labelStyle}>Last Name</label>
            <input
              value={formData.lastName}
              onChange={handleChange("lastName")}
              placeholder="Enter last name"
              className="profile__input"
              style={getInputStyle(errors.lastName)}
              onFocus={focusStyle}
              onBlur={blurStyle}
            />
            {errors.lastName && <ErrorText message={errors.lastName} />}
          </div>

          <div className="profile__form-group" style={{ textAlign: "left" }}>
            <label style={labelStyle}>Email</label>
            <input
              value={formData.email}
              onChange={handleChange("email")}
              placeholder="Enter email"
              className="profile__input"
              style={getInputStyle(errors.email)}
              onFocus={focusStyle}
              onBlur={blurStyle}
            />
            {errors.email && <ErrorText message={errors.email} />}
          </div>

          <div className="profile__form-group" style={{ textAlign: "left" }}>
            <label style={labelStyle}>Loyalty Points</label>
            <input
              type="number"
              value={formData.loyaltyPoints}
              onChange={handleChange("loyaltyPoints")}
              placeholder="Enter loyalty points"
              className="profile__input"
              style={getInputStyle()}
              onFocus={focusStyle}
              onBlur={blurStyle}
            />
          </div>

          <div
            className="profile__logout-actions"
            style={{ marginTop: "1.5rem" }}
          >
            <button
              className="btn btn--primary"
              onClick={handleSave}
            >
              Create
            </button>

            <button
              type="button"
              className="btn btn--outline"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// =======================
// STYLES
// =======================

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  zIndex: 9998,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const getModalContainerStyle = () => {
  const isMobile = window.innerWidth < 600;
  return {
    width: isMobile ? "100vw" : "100%",
    maxWidth: isMobile ? "100vw" : "600px",
    height: isMobile ? "100vh" : "90vh",
    backgroundColor: "var(--card)",
    borderRadius: isMobile ? "0" : "12px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
  };
};

const modalContentStyle = {
  padding: "1.5rem",
  overflowY: "auto",
  flexGrow: 1,
};

const labelStyle = {
  display: "block",
  marginBottom: "0.5rem",
  fontWeight: 500,
  color: "var(--text)",
};

function getInputStyle(error) {
  return {
    width: "100%",
    padding: "0.75rem 1rem",
    fontSize: "1rem",
    borderRadius: "6px",
    border: error ? "2px solid #E51A3C" : "2px solid #FD6100",
    outline: "none",
    backgroundColor: "#fefaf7",
    color: "var(--text)",
    fontFamily: "inherit",
    boxSizing: "border-box",
    transition: "border 0.2s ease, box-shadow 0.2s ease",
  };
}

function focusStyle(e) {
  e.target.style.boxShadow = "0 0 0 3px rgba(253, 97, 0, 0.2)";
}

function blurStyle(e) {
  e.target.style.boxShadow = "none";
}

function ErrorText({ message }) {
  return (
    <p
      className="error"
      style={{ color: "red", fontSize: "0.9rem", marginTop: "0.5rem" }}
    >
      {message}
    </p>
  );
}

export default CreateUserModal;
