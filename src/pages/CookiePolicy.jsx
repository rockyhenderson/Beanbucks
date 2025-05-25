import React, { useState } from "react";
import CookieConsentModal from "../components/CookieConsentModal"; // Make sure the path is correct

function CookiePolicy() {
    const [showModal, setShowModal] = useState(false);

    return (
        <div style={{ padding: "2rem", maxWidth: "900px", margin: "auto" }}>
            <h1>Cookie Policy</h1>
             <button
                onClick={() => setShowModal(true)}
                style={{
                    marginTop: "2rem",
                    marginBottom: "2rem",
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "var(--primary)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "1rem",
                    cursor: "pointer",
                }}
            >
                Change Cookie Preferences
            </button>

            <p><strong>Last updated:</strong> May 19, 2025</p>

            <p>
                This Cookie Policy explains how BeanBucks (“we”, “us”, or “our”) uses cookies and similar technologies when you visit our website <strong>beanbucks.com</strong>.
            </p>

            <h2>What Are Cookies?</h2>
            <p>
                Cookies are small text files that are placed on your device to help websites function, improve user experience, and collect data about how you use the site.
            </p>

            <h2>How We Use Cookies</h2>
            <p>We use cookies to:</p>
            <ul>
                <li>Remember your preferences and login details</li>
                <li>Understand how users interact with our site (e.g., pages visited, time on site)</li>
                <li>Enable basic ordering and cart functionality</li>
                <li>Deliver promotions or reward offers</li>
            </ul>

            <h2>Types of Cookies We Use</h2>
            <ul>
                <li><strong>Essential Cookies:</strong> Required for core functionality like cart storage and login.</li>
                <li><strong>Performance Cookies:</strong> Help us understand site usage and improve experience (e.g. analytics).</li>
                <li><strong>Functional Cookies:</strong> Remember your choices (like store preference or allergen settings).</li>
            </ul>

            <h2>Third-Party Cookies</h2>
            <p>
                We may use third-party services like Google Analytics to collect usage data. These providers may set their own cookies. Please refer to their privacy policies for more information.
            </p>

            <h2>Your Cookie Choices</h2>
            <p>
                You can choose to accept or reject non-essential cookies when you visit our site. You can also change your preferences at any time by clicking the button below.
            </p>

            <p>
                Additionally, most web browsers allow you to control cookies through settings. You can delete cookies or block them entirely, but doing so may affect site functionality.
            </p>

            <h2>Managing Cookies in Your Browser</h2>
            <p>Here are some helpful links to manage cookies in popular browsers:</p>
            <ul>
                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
                <li><a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
                <li><a href="https://support.microsoft.com/en-gb/help/17442/windows-internet-explorer-delete-manage-cookies" target="_blank" rel="noopener noreferrer">Internet Explorer</a></li>
            </ul>

            <h2>Changes to This Policy</h2>
            <p>
                We may update this Cookie Policy to reflect changes in law or site functionality. Any changes will be posted on this page with an updated revision date.
            </p>

            <h2>Contact Us</h2>
            <p>
                If you have questions about our use of cookies, please contact us at <strong>beanbucks@gmail.com</strong>.
            </p>

            {/* ✅ Change Cookie Preferences Button */}
           
            {/* ✅ Modal */}
            {showModal && (
                <CookieConsentModal onClose={() => setShowModal(false)} />


            )}
        </div>
    );
}

export default CookiePolicy;
