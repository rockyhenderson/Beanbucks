import React, { useEffect, useState } from 'react';
import "../Rewards_Style.css";
import TwoChoicesModal from "../components/TwoChoices"; 
import { useNavigate } from 'react-router-dom';

function Rewards() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
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

        document.body.style.overflow = isLoggedIn ? 'auto' : 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isLoggedIn]);

    const handleLogin = () => navigate("/login");
    const handleRegister = () => navigate("/register");

    return (
        <>
            {!isLoggedIn && (
                <TwoChoicesModal
                    title="Please log in to access rewards"
                    confirmLabel="Login"
                    cancelLabel="Register"
                    onConfirm={handleLogin}
                    onCancel={handleRegister}
                />
            )}

            <div className={`rewards ${!isLoggedIn ? 'rewards--blurred' : ''}`}>
                <h1>Rewards</h1>

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
