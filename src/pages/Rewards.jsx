import React, { useEffect, useState } from 'react';
import "../Rewards_Style.css";

function Rewards() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check sessionStorage on load
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                if (parsed.role && parsed.role !== "none") {
                    setIsLoggedIn(true);
                }
            } catch {
                setIsLoggedIn(false);
            }
        } else {
            setIsLoggedIn(false);
        }

        // Handle scroll lock
        if (!isLoggedIn) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isLoggedIn]);

    return (
        <>
            {!isLoggedIn && (
                <div className="rewards__lock-overlay">
                    <div className="rewards__lock-box">
                        <h2>Please log in to access rewards</h2>
                        <p>You need to be signed in to view your loyalty points and perks.</p>
                        <div className="rewards__lock-cta">
                            <a href="/login" className="btn btn--primary">Login</a>
                            <a href="/register" className="btn btn--outline">Register</a>
                        </div>
                    </div>
                </div>
            )}

            <div className={`rewards ${!isLoggedIn ? 'rewards--blurred' : ''}`}>
                <h1>BeanBucks Rewards</h1>

                {/* Points Overview */}
                <section className="rewards__points-card">
                    <h2>Your Points</h2>
                    <p className="rewards__points-value">Loading points...</p>
                    <p className="rewards__points-subtext">Keep sipping to unlock free drinks!</p>
                </section>

                {/* Redeemable Items */}
                <section className="rewards__redeem-section">
                    <h2>Redeem Your Points</h2>
                    <div className="rewards__redeem-list">
                        {[{ name: 'Free Small Coffee', cost: 250 }, { name: '50% Off Seasonal Drink', cost: 300 }, { name: 'Free Cookie', cost: 150 }].map((reward, index) => (
                            <div className="rewards__reward-card" key={index}>
                                <div className="rewards__reward-info">
                                    <strong>{reward.name}</strong>
                                    <p>{reward.cost} pts</p>
                                </div>
                                <button className="rewards__redeem-button" disabled>
                                    Redeem
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Future Feature Teasers */}
                <section className="rewards__coming-soon">
                    <h2>Coming Soon</h2>
                    <ul>
                        <li>🎯 Personalized drink recommendations</li>
                        <li>🎁 Exclusive offers based on your loyalty</li>
                        <li>🔁 Quick reorder with points</li>
                    </ul>
                </section>
            </div>
        </>
    );
}

export default Rewards;
