import React, { useEffect, useState } from "react";
import useFetchWithRetry from "../utils/useFetchWithRetry"; // Custom Hook
import RetryFallback from "../components/RetryFallback"; // Retry Fallback Component
import "../Rewards_Style.css";
import { useNavigate } from 'react-router-dom';

function Rewards() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null); // Initialize as null
    const [showRankInfo, setShowRankInfo] = useState(false); // State to control modal visibility
    const navigate = useNavigate();

    // Check if the user is logged in and retrieve user ID from session storage
    useEffect(() => {
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                if (parsed.role && parsed.role !== "none") {
                    setIsLoggedIn(true);
                    setUserId(parsed.id); // Set the user ID dynamically
                }
            } catch {
                setIsLoggedIn(false);
            }
        } else {
            setIsLoggedIn(false);
        }

        document.body.style.overflow = isLoggedIn ? "auto" : "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isLoggedIn]);

    // Use the useFetchWithRetry hook to fetch loyalty points data
    const { data, error, retry, isLoading } = useFetchWithRetry(
        `http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/public/read_loyalty_points.php?id=${userId}`
    );

    // Debugging: Log the API response to the console
    useEffect(() => {
        if (data) {
            console.log("API Response:", data); // Log the response to see the structure
        }
    }, [data]);

    // Handle loading, error, and display data
    if (error) return <RetryFallback onRetry={retry} />;
    if (isLoading) return <p>Loading...</p>;
    if (!data) return null;

    // Membership Status (based on points)
    const getMembershipLevel = (points) => {
        if (points >= 1000) return "Diamond Membership";
        if (points >= 500) return "Gold Membership";
        if (points >= 300) return "Silver Membership";
        return "Standard Membership";
    };

    // Set membership level based on lifetime points
    const membershipLevel = getMembershipLevel(data.lifetime_points);

    // Rank colors
    const rankColors = {
        "Standard Membership": "gray",
        "Silver Membership": "silver",
        "Gold Membership": "gold",
        "Diamond Membership": "#2C97BF", // Custom color for Diamond
    };

    // Toggle rank information modal
    const toggleRankInfo = () => setShowRankInfo(!showRankInfo);

    return (
        <>
            {!isLoggedIn && (
                <TwoChoicesModal
                    title="Please log in to access rewards"
                    confirmLabel="Login"
                    cancelLabel="Register"
                    onConfirm={() => navigate("/login")}
                    onCancel={() => navigate("/register")}
                />
            )}

            <div className={`rewards ${!isLoggedIn ? "rewards--blurred" : ""}`}>
                <h1>Rewards</h1>

                {/* Current Points - Main Focus */}
                <section className="rewards__current-points" style={{ borderColor: rankColors[membershipLevel], backgroundColor: "var(--card)" }}>
                    <h2>Your Current Points</h2>
                    <p className="rewards__points-value">{data.loyalty_points} pts</p>
                    <p className="rewards__points-subtext">
                        These are your available points for redeeming rewards right now!
                    </p>
                </section>

                {/* SPEND POINTS and Rank Progression Div */}
                <section className="rewards__spend-and-progress">
                    {/* SPEND POINTS Section */}
                    <div className="rewards__spend-points">
                        <h2>Your Lifetime Points</h2>
                        <p className="rewards__points-value">{data.lifetime_points} pts</p>
                        <p className="rewards__points-subtext">
                            These are the total points you've earned over time.
                        </p>
                    </div>

                    {/* Rank Progression Section */}
                    <div className="rewards__rank-progress">
                        <h2>Rank Progression</h2>
                    </div>
                </section>


                {/* Rank Info Modal */}
                {showRankInfo && (
                    <div className="rewards__rank-info-modal">
                        <div className="rewards__modal-content">
                            <button
                                className="rewards__close-btn"
                                onClick={toggleRankInfo}
                            >
                                ✕
                            </button>
                            <h3>Membership Ranks</h3>
                            <ul>
                                <li><strong>Standard Membership</strong>: Earn points for small rewards (e.g., Free Coffee) - <span style={{ color: "gray" }}>Gray</span></li>
                                <li><strong>Silver Membership</strong>: Get bigger rewards like 50% off seasonal drinks - <span style={{ color: "silver" }}>Silver</span></li>
                                <li><strong>Gold Membership</strong>: Unlock VIP rewards and discounts - <span style={{ color: "gold" }}>Gold</span></li>
                                <li><strong>Diamond Membership</strong>: Enjoy exclusive benefits and VIP access - <span style={{ color: "#2C97BF" }}>Diamond</span></li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </>
    );


}

export default Rewards;
