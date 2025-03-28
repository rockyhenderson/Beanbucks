import React, { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function SingleInputModal({
  title,
  inputType = "text",
  initialValue = "",
  placeholder = "",
  onCancel,
  onSubmit,
  validate,
  errorMessage,
}) {
  const [inputValue, setInputValue] = useState(initialValue);
  const [showPassword, setShowPassword] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleSave = () => {
    const trimmedValue = inputValue.trim();

    if (validate && !validate(trimmedValue)) {
      setHasError(true);
      return;
    }

    setHasError(false);
    onSubmit(trimmedValue);
  };

  const isPassword = inputType === "password";

  return (
    <div className="modal-overlay">
      <div className="profile__logout-modal">
        <h2>{title}</h2>

        <div style={{ position: "relative" }}>
          <input
            type={isPassword && !showPassword ? "password" : "text"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            className="profile__input"
            style={{
              borderColor: hasError ? "red" : undefined,
            }}
          />
          {isPassword && (
            <div
              style={{
                position: "absolute",
                right: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "var(--text)",
                opacity: 0.6,
              }}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <VisibilityOff fontSize="small" />
              ) : (
                <Visibility fontSize="small" />
              )}
            </div>
          )}
        </div>

        {hasError && (
          <p style={{ color: "red", fontSize: "0.9rem", marginTop: "0.5rem" }}>
            {errorMessage || "Invalid input."}
          </p>
        )}

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

export default SingleInputModal;
