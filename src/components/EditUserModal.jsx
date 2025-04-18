import React, { useState } from "react";

function EditUserModal({ user, onCancel, onSubmit }) {
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    loyaltyPoints: user.loyaltyPoints || 0,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = () => {
    const newErrors = {};

    if (formData.firstName.trim().length < 2) newErrors.firstName = "First name too short.";
    if (formData.lastName.trim().length < 2) newErrors.lastName = "Last name too short.";
    if (!formData.email.includes("@")) newErrors.email = "Invalid email address.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData); // replace this with actual API later
  };

  return (
    <div className="modal-overlay">
      <div className="profile__logout-modal">
        <h2>Edit User</h2>

        <div className="profile__form-group">
          <label>First Name</label>
          <input
            value={formData.firstName}
            onChange={handleChange("firstName")}
            placeholder="Enter first name"
            className="profile__input"
            style={{
                zIndex: 1001,
              width: "100%",
              padding: "0.75rem 1rem",
              fontSize: "1rem",
              borderRadius: "6px",
              border: errors.firstName ? "2px solid #E51A3C" : "2px solid #FD6100",
              outline: "none",
              backgroundColor: "#fefaf7",
              color: "var(--text)",
              fontFamily: "inherit",
              boxSizing: "border-box",
              transition: "border 0.2s ease, box-shadow 0.2s ease",
            }}
            onFocus={(e) => (e.target.style.boxShadow = "0 0 0 3px rgba(253, 97, 0, 0.2)")}
            onBlur={(e) => (e.target.style.boxShadow = "none")}
          />
          {errors.firstName && <p className="error" style={{ color: "red", fontSize: "0.9rem", marginTop: "0.5rem" }}>{errors.firstName}</p>}
        </div>

        <div className="profile__form-group">
          <label>Last Name</label>
          <input
            value={formData.lastName}
            onChange={handleChange("lastName")}
            placeholder="Enter last name"
            className="profile__input"
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              fontSize: "1rem",
              borderRadius: "6px",
              border: errors.lastName ? "2px solid #E51A3C" : "2px solid #FD6100",
              outline: "none",
              backgroundColor: "#fefaf7",
              color: "var(--text)",
              fontFamily: "inherit",
              boxSizing: "border-box",
              transition: "border 0.2s ease, box-shadow 0.2s ease",
            }}
            onFocus={(e) => (e.target.style.boxShadow = "0 0 0 3px rgba(253, 97, 0, 0.2)")}
            onBlur={(e) => (e.target.style.boxShadow = "none")}
          />
          {errors.lastName && <p className="error" style={{ color: "red", fontSize: "0.9rem", marginTop: "0.5rem" }}>{errors.lastName}</p>}
        </div>

        <div className="profile__form-group">
          <label>Email</label>
          <input
            value={formData.email}
            onChange={handleChange("email")}
            placeholder="Enter email"
            className="profile__input"
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              fontSize: "1rem",
              borderRadius: "6px",
              border: errors.email ? "2px solid #E51A3C" : "2px solid #FD6100",
              outline: "none",
              backgroundColor: "#fefaf7",
              color: "var(--text)",
              fontFamily: "inherit",
              boxSizing: "border-box",
              transition: "border 0.2s ease, box-shadow 0.2s ease",
            }}
            onFocus={(e) => (e.target.style.boxShadow = "0 0 0 3px rgba(253, 97, 0, 0.2)")}
            onBlur={(e) => (e.target.style.boxShadow = "none")}
          />
          {errors.email && <p className="error" style={{ color: "red", fontSize: "0.9rem", marginTop: "0.5rem" }}>{errors.email}</p>}
        </div>

        <div className="profile__form-group">
          <label>Loyalty Points</label>
          <input
            type="number"
            value={formData.loyaltyPoints}
            onChange={handleChange("loyaltyPoints")}
            placeholder="Enter loyalty points"
            className="profile__input"
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              fontSize: "1rem",
              borderRadius: "6px",
              border: "2px solid #FD6100",
              outline: "none",
              backgroundColor: "#fefaf7",
              color: "var(--text)",
              fontFamily: "inherit",
              boxSizing: "border-box",
              transition: "border 0.2s ease, box-shadow 0.2s ease",
            }}
            onFocus={(e) => (e.target.style.boxShadow = "0 0 0 3px rgba(253, 97, 0, 0.2)")}
            onBlur={(e) => (e.target.style.boxShadow = "none")}
          />
        </div>

        <div className="profile__logout-actions">
          <button className="btn btn--primary" onClick={handleSave}>
            Save
          </button>
          <button className="btn btn--outline" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditUserModal;