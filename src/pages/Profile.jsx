import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../Profile_Style.css";
import Toast from "../components/Toast";
import "../Toast_Style.css";

function Profile() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [toast, setToast] = useState(null);
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user"); // Clear user session
    navigate("/login"); // Redirect to login page
  };

  return (
    <>
      <div className="profile">
        <h1 className="profile__title">Profile</h1>

        {/* Profile Settings Section */}
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
              <a href="#">Change Password</a>
            </li>
            <li>
              <a href="#">Order History</a>
            </li>
            <li>
              <a href="#">Allergen Preferences</a>
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

        {/* Contact Preferences */}
        <div className="profile__card">
          <h2 className="profile__card-title">Contact Preferences</h2>
          <ul className="profile__list">
            <li>
              <a href="#">Notification Settings</a>
            </li>
            <li>
              <a href="#">Promotional Emails</a>
            </li>
          </ul>
        </div>

        {/* Store & Payment Info */}
        <div className="profile__card">
          <h2 className="profile__card-title">Account Settings</h2>
          <ul className="profile__list">
            <li>
              <a href="#">Preferred Store</a>
            </li>
            <li>
              <a href="#">Payment Methods</a>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div className="profile__card">
          <h2 className="profile__card-title">Support & Legal</h2>
          <ul className="profile__list">
            <li>
              <a href="#">Terms and Conditions</a>
            </li>
            <li>
              <a href="#">Cookie Policy</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
          </ul>
        </div>
        {showModal && (
          <div className="modal-overlay">
            <div className="profile__logout-modal">
              <h2>Are you sure you want to log out?</h2>
              <div className="profile__logout-actions">
                <button
                  className="btn btn--primary"
                  onClick={() => {
                    sessionStorage.removeItem("user");
                    setShowModal(false);
                    navigate("/login");
                  }}
                >
                  Yes, log me out
                </button>
                <button
                  className="btn btn--outline"
                  onClick={() => setShowModal(false)}
                >
                  No, stay logged in
                </button>
              </div>
            </div>
          </div>
        )}
        {showEmailModal && (
          <div className="modal-overlay">
            <div className="profile__logout-modal">
              <h2>Change Your Email</h2>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder={
                  JSON.parse(sessionStorage.getItem("user"))?.email ||
                  "Enter new email"
                }
                className="profile__input"
              />

              <div className="profile__logout-actions">
                <button
                  className="btn btn--primary"
                  onClick={() => {
                    const user = JSON.parse(sessionStorage.getItem("user"));
                    if (!user || !newEmail) return;

                    const trimmedNewEmail = newEmail.trim().toLowerCase();
                    const currentEmail = user.email.trim().toLowerCase();

                    // ✅ Check: is it the same email?
                    if (trimmedNewEmail === currentEmail) {
                      setToast({
                        type: "warning",
                        title: "No Change Detected",
                        message: "That’s already your current email.",
                      });
                      return;
                    }

                    // ✅ Check: is it a valid email format?
                    const isValidEmail = (email) =>
                      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

                    if (!isValidEmail(trimmedNewEmail)) {
                        setToast({
                          type: "warning",
                          title: "Invalid Email",
                          message: "That doesn't look like a proper email address.",
                        });
                        return;
                      }
                      

                    // ✅ Now it's safe to fire the request
                    fetch(
                      "http://ec2-52-31-217-246.eu-west-1.compute.amazonaws.com/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/public/update_email.php",
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          id: user.id,
                          new_email: trimmedNewEmail,
                        }),
                      }
                    )
                      .then((res) => res.json())
                      .then((data) => {
                        if (data.success) {
                          setShowEmailModal(false);
                          setNewEmail("");

                          const updatedUser = {
                            ...user,
                            email: trimmedNewEmail,
                          };
                          sessionStorage.setItem(
                            "user",
                            JSON.stringify(updatedUser)
                          );

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
                          message:
                            "Couldn't reach the server. Please try again.",
                        });
                      });
                  }}
                >
                  Save
                </button>

                <button
                  className="btn btn--outline"
                  onClick={() => {
                    setShowEmailModal(false);
                    setNewEmail("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
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
