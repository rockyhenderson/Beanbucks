import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../Profile_Style.css";
import Toast from "../components/Toast";
import "../Toast_Style.css";
import SingleInputModal from "../components/SingleInputModal";
import TwoChoicesModal from "../components/TwoChoices";

function Profile() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [confirmPasswordChange, setConfirmPasswordChange] = useState(false);
  const [toast, setToast] = useState(null);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [ShowPaymentModal, setShowPaymentModal] = useState(false);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/login");
  };
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  return (
    <>
      <div className="profile">
        <h1 className="profile__title">Profile</h1>

        {/* Profile Sections */}
        <div className="profile__card">
          <h2 className="profile__card-title">Your Profile</h2>
          <ul className="profile__list">
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowEmailModal(true);
                }}
              >
                Change Email
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowPasswordModal(true);
                  setConfirmPasswordChange(false);
                }}
              >
                Change Password
              </a>
            </li>
            <li>
              <a href="#">Order History ❌</a>
            </li>
            <li>
              <a href="#">Allergen Preferences ❌</a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowModal(true);
                }}
              >
                Log Out
              </a>
            </li>
          </ul>
        </div>

        {/* Other Cards */}
        <div className="profile__card">
          <h2 className="profile__card-title">Contact Preferences</h2>
          <ul className="profile__list">
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowNotificationModal(true);
                  setToast({
                    type: "info",
                    title: "Heads up!",
                    message: "Notifications aren’t implemented yet.",
                  });
                }}
              >
                Notification Settings
              </a>
            </li>

            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowPromoModal(true);
                  setToast({
                    type: "info",
                    title: "Just so you know...",
                    message: "Promotional emails aren’t implemented yet.",
                  });
                }}
              >
                Promotional Emails
              </a>
            </li>
          </ul>
        </div>

        <div className="profile__card">
          <h2 className="profile__card-title">Account Settings</h2>
          <ul className="profile__list">
            <li>
              <a href="#">Preferred Store ❌</a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowPaymentModal(true);
                  setToast({
                    type: "info",
                    title: "Just so you know...",
                    message:
                      "You litteraly cant pay here as its a mock website.",
                  });
                }}
              >
                Payment Methods
              </a>
            </li>
          </ul>
        </div>

        <div className="profile__card">
          <h2 className="profile__card-title">Support & Legal</h2>
          <ul className="profile__list">
            <li>
              <a href="#">Terms and Conditions ❌</a>
            </li>
            <li>
              <a href="#">Cookie Policy ❌</a>
            </li>
            <li>
              <a href="#">Privacy Policy ❌</a>
            </li>
          </ul>
        </div>

        {/* Logout Modal */}
        {showModal && (
          <TwoChoicesModal
            title="Are you sure you want to log out?"
            confirmLabel="Yes, log me out"
            cancelLabel="No, stay logged in"
            onConfirm={handleLogout}
            onCancel={() => setShowModal(false)}
          />
        )}

        {/* Email Modal */}
        {showEmailModal && (
          <SingleInputModal
            title="Change Your Email"
            inputType="email"
            placeholder={
              JSON.parse(sessionStorage.getItem("user"))?.email ||
              "Enter new email"
            }
            validate={isValidEmail}
            errorMessage="That doesn't look like a proper email address."
            onCancel={() => {
              setShowEmailModal(false);
            }}
            onSubmit={(trimmedEmail) => {
              const user = JSON.parse(sessionStorage.getItem("user"));
              const currentEmail = user.email.trim().toLowerCase();

              if (trimmedEmail === currentEmail) {
                setToast({
                  type: "warning",
                  title: "No Change Detected",
                  message: "That’s already your current email.",
                });
                return;
              }

              fetch(
                "http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/public/update_email.php",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    id: user.id,
                    new_email: trimmedEmail,
                  }),
                }
              )
                .then((res) => res.json())
                .then((data) => {
                  if (data.success) {
                    const updatedUser = { ...user, email: trimmedEmail };
                    sessionStorage.setItem("user", JSON.stringify(updatedUser));
                    setShowEmailModal(false);
                    setToast({
                      type: "success",
                      title: "Email Updated",
                      message: "Your email was successfully changed.",
                    });
                  } else {
                    setToast({
                      type: "error",
                      title: "Update Failed",
                      message:
                        data.error ||
                        "Something went wrong while updating your email.",
                    });
                  }
                })
                .catch((err) => {
                  console.error("Email update error:", err);
                  setToast({
                    type: "error",
                    title: "Network Error",
                    message: "Couldn't reach the server. Please try again.",
                  });
                });
            }}
          />
        )}

        {/* Password Modal */}
        {showPasswordModal && (
          <SingleInputModal
            title="Change Your Password"
            inputType="password"
            placeholder="Enter new password"
            validate={(val) => val.length >= 6}
            errorMessage="Password must be at least 6 characters."
            onCancel={() => {
              setShowPasswordModal(false);
              setConfirmPasswordChange(false);
            }}
            onSubmit={(newPassword) => {
              const user = JSON.parse(sessionStorage.getItem("user"));

              if (!confirmPasswordChange) {
                setConfirmPasswordChange(true);
                setToast({
                  type: "warning",
                  title: "Are You Sure?",
                  message:
                    "This change is permanent. Click save again to confirm.",
                });
                return;
              }

              fetch(
                "http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/public/update_password.php",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    id: user.id,
                    new_password: newPassword,
                  }),
                }
              )
                .then((res) => res.json())
                .then((data) => {
                  if (data.success) {
                    setShowPasswordModal(false);
                    setConfirmPasswordChange(false);
                    setToast({
                      type: "success",
                      title: "Password Updated",
                      message: "Your password has been successfully changed.",
                    });
                  } else {
                    setToast({
                      type: "error",
                      title: "Update Failed",
                      message:
                        data.error ||
                        "Something went wrong while updating your password.",
                    });
                  }
                })
                .catch((err) => {
                  console.error("Password update error:", err);
                  setToast({
                    type: "error",
                    title: "Network Error",
                    message: "Couldn't reach the server. Please try again.",
                  });
                });
            }}
          />
        )}
        {/* Notificatoins Modal */}
        {showNotificationModal && (
          <TwoChoicesModal
            title="Notification Settings"
            confirmLabel="Subscribe to Notifications"
            cancelLabel="Unsubscribe"
            onConfirm={() => {
              setShowNotificationModal(false);
            }}
            onCancel={() => {
              setShowNotificationModal(false);
            }}
          />
        )}
        {/* Promotions Modal */}
        {showPromoModal && (
          <TwoChoicesModal
            title={`Subscribe with ${
              JSON.parse(sessionStorage.getItem("user"))?.email || "your email"
            }`}
            confirmLabel="Subscribe"
            cancelLabel="Unsubscribe"
            onConfirm={() => {
              setShowPromoModal(false);
            }}
            onCancel={() => {
              setShowPromoModal(false);
            }}
          />
        )}
        {ShowPaymentModal && (
          <TwoChoicesModal
            title="Payment Modal"
            confirmLabel="I do somthing important"
            cancelLabel="I dont do anything important"
            onConfirm={() => {
              setShowPaymentModal(false);
            }}
            onCancel={() => {
              setShowPaymentModal(false);
            }}
          />
        )}

        {/* Toast */}
        {toast && (
          <div
            style={{
              position: "fixed",
              top: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 9999,
              animation: "slideDown 0.3s ease-out",
            }}
          >
            <Toast
              type={toast.type}
              title={toast.title}
              message={toast.message}
              onClose={() => setToast(null)}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default Profile;
