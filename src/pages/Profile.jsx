import React from 'react';
import "../Profile_Style.css";

function Profile() {
    return (
        <div className="profile">
            <h1 className="profile__title">Welcome to Your BeanBucks Profile ☕</h1>

            {/* Profile Settings Section */}
            <div className="profile__card">
                <h2 className="profile__card-title">Your Profile</h2>
                <ul className="profile__list">
                    <li><a href="#">Change Email</a></li>
                    <li><a href="#">Change Password</a></li>
                    <li><a href="#">Edit Birthday</a></li>
                    <li><a href="#">Order History</a></li>
                    <li><a href="#">Allergen Preferences</a></li>
                </ul>
            </div>

            {/* Contact Preferences */}
            <div className="profile__card">
                <h2 className="profile__card-title">Contact Preferences</h2>
                <ul className="profile__list">
                    <li><a href="#">Notification Settings</a></li>
                    <li><a href="#">Promotional Emails</a></li>
                </ul>
            </div>

            {/* Store & Payment Info */}
            <div className="profile__card">
                <h2 className="profile__card-title">Account Settings</h2>
                <ul className="profile__list">
                    <li><a href="#">Preferred Store</a></li>
                    <li><a href="#">Payment Methods</a></li>
                </ul>
            </div>

            {/* Legal */}
            <div className="profile__card">
                <h2 className="profile__card-title">Support & Legal</h2>
                <ul className="profile__list">
                    <li><a href="#">Terms and Conditions</a></li>
                    <li><a href="#">Cookie Policy</a></li>
                    <li><a href="#">Privacy Policy</a></li>
                </ul>
            </div>
        </div>
    );
}

export default Profile;
