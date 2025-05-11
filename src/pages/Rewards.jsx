import React, { useEffect, useState } from "react";
import useFetchWithRetry from "../utils/useFetchWithRetry";
import RetryFallback from "../components/RetryFallback";
import TwoChoicesModal from "../components/TwoChoices";
import { useNavigate } from "react-router-dom";
import { Tooltip, IconButton } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

function Rewards() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();
    const [selectedRewardId, setSelectedRewardId] = useState(() => {
        const stored = localStorage.getItem("SelectedReward");
        return stored ? JSON.parse(stored).id : null;
    });
    
    useEffect(() => {
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                if (parsed.role && parsed.role !== "none") {
                    setIsLoggedIn(true);
                    setUserId(parsed.id);
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

    const { data, error, retry, isLoading } = useFetchWithRetry(
        `http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/public/read_loyalty_points.php?id=${userId}`
    );
    const handleRewardSelect = (milestone) => {
        if (loyaltyPoints >= milestone.points) {
            localStorage.setItem(
                "SelectedReward",
                JSON.stringify({ id: milestone.id, reward: milestone.reward })
            );
            alert(`Redeemed: ${milestone.reward}`);
        }
    };

    if (!isLoggedIn) {
        return (
            <TwoChoicesModal
                title="Please log in to access rewards"
                confirmLabel="Login"
                cancelLabel="Register"
                onConfirm={() => navigate("/login")}
                onCancel={() => navigate("/register")}
            />
        );
    }

    if (error) return <RetryFallback onRetry={retry} />;
    if (isLoading) return <p>Loading...</p>;
    if (!data) return null;

    const loyaltyPoints = data.loyalty_points;

    const rewardMilestones = [
        { points: 50, reward: "Free Extra Shot" },
        { points: 100, reward: "Free Small Drink" },
        { points: 200, reward: "Free Large Drink" },
        { points: 400, reward: "Free Snack or Bakery Item" },
        { points: 600, reward: "Any Drink + Snack Combo" },
    ];

    const getProgress = (current, target) =>
        Math.min(100, Math.round((current / target) * 100));

    return (
        <div className="rewards" style={{ padding: "2rem 1rem", maxWidth: "1200px", margin: "auto" }}>
            <h1 style={{ fontSize: "2.25rem", marginBottom: "1rem" }}>Rewards</h1>

            {/* POINTS SUMMARY CARD */}
            <div
                style={{
                    backgroundColor: "var(--card)",
                    border: "2px solid var(--primary)",
                    borderRadius: "12px",
                    padding: "1rem 1.5rem",
                    marginBottom: "2rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                }}
            >
                <div>
                    <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--primary)", margin: 0 }}>
                        {loyaltyPoints} pts
                    </p>
                    <p className="rewards__points-subtext" style={{ margin: 0 }}>
                        Your current balance
                    </p>
                </div>
                <Tooltip title="You earn 1 point for every £1 spent. Redeem points for drinks and snacks!">
                    <IconButton aria-label="how it works">
                        <HelpOutlineIcon style={{ color: "var(--primary)" }} />
                    </IconButton>
                </Tooltip>
            </div>

            {/* REWARD CARDS */}
            <div
                className="card"
                style={{
                    backgroundColor: "var(--card)",
                    borderRadius: "16px",
                    padding: "2rem",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                }}
            >
                <h2 style={{ textAlign: "center", marginBottom: "0.5rem" }}>Available Rewards</h2>
                <p style={{ textAlign: "center", fontStyle: "italic", color: "var(--body-text)", marginBottom: "2rem" }}>
                    Only one reward can be redeemed per purchase.
                </p>

                <div
                    className="rewards__grid"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                        gap: "1.5rem",
                    }}
                >
                    {rewardMilestones.map((milestone, i) => {
                        const progress = getProgress(loyaltyPoints, milestone.points);
                        const isUnlocked = loyaltyPoints >= milestone.points;
                        const selectedReward = JSON.parse(localStorage.getItem("SelectedReward"));
                        const isSelected = selectedReward?.id === i + 1;

                        const handleClick = () => {
                            if (isUnlocked) {
                                localStorage.setItem("SelectedReward", JSON.stringify({ id: i + 1, reward: milestone.reward }));
                                setSelectedRewardId(i + 1);
                            }
                        };


                        return (
                            <div
                                key={i}
                                onClick={handleClick}
                                style={{
                                    backgroundColor: isSelected ? "#ffe8d9" : "#fff",
                                    borderRadius: "12px",
                                    padding: "1.5rem",
                                    border: `2px solid ${isSelected ? "var(--primary)" : isUnlocked ? "var(--primary)" : "#ccc"}`,
                                    boxShadow: isSelected
                                        ? "0 6px 16px rgba(0,0,0,0.1)"
                                        : "0 2px 8px rgba(0,0,0,0.03)",
                                    transition: "all 0.2s ease",
                                    transform: isSelected ? "scale(1.02)" : "scale(1)",
                                    cursor: isUnlocked ? "pointer" : "not-allowed",
                                    textAlign: "center",
                                }}
                            >
                                <h3 style={{ margin: 0 }}>{milestone.reward}</h3>
                                <p style={{ margin: "0.5rem 0 1rem" }}>{milestone.points} pts</p>
                                <div style={{ width: "100%", height: "10px", backgroundColor: "#eee", borderRadius: "6px" }}>
                                    <div
                                        style={{
                                            width: `${progress}%`,
                                            height: "100%",
                                            backgroundColor: "var(--primary)",
                                            borderRadius: "6px",
                                            transition: "width 0.3s",
                                        }}
                                    />
                                </div>
                                {!isUnlocked && (
                                    <p style={{ fontSize: "0.85rem", marginTop: "0.5rem", color: "#555" }}>
                                        {milestone.points - loyaltyPoints} pts to go
                                    </p>
                                )}
                                <button
                                    disabled={!isUnlocked}
                                    className="btn btn--primary"
                                    style={{
                                        marginTop: "1rem",
                                        padding: "0.5rem 1rem",
                                        backgroundColor: isUnlocked ? "var(--primary)" : "#ccc",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "8px",
                                        cursor: isUnlocked ? "pointer" : "not-allowed",
                                        fontWeight: 600,
                                    }}
                                >
                                    {isSelected ? "Selected" : isUnlocked ? "Redeem" : "Locked"}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
    );
}

export default Rewards;
