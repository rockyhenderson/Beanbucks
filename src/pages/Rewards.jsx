import React, { useEffect, useState } from "react";
import useFetchWithRetry from "../utils/useFetchWithRetry";
import RetryFallback from "../components/RetryFallback";
import TwoChoicesModal from "../components/TwoChoices";
import { useNavigate } from "react-router-dom";
import { Tooltip, IconButton } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Toast from "../components/Toast"; // Make sure this path is correct
import { Button } from "@mui/material";


function Rewards() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);
    const [toast, setToast] = useState(null);
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
        `/api/public/read_loyalty_points.php?id=${userId}`
    );

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
    if (isLoading) return <div className="loading-spinner">Loading...</div>;
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

    const CustomPrevArrow = ({ onClick }) => (
        <IconButton
            onClick={onClick}
            sx={{
                position: "absolute",
                left: "-25px",
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "#ee5c01",
                color: "white",
                zIndex: 2,
                width: "40px",
                height: "40px",
                "&:hover": {
                    backgroundColor: "#d45301",
                },
            }}
        >
            <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
    );

    const CustomNextArrow = ({ onClick }) => (
        <IconButton
            onClick={onClick}
            sx={{
                position: "absolute",
                right: "-25px",
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "#ee5c01",
                color: "white",
                zIndex: 2,
                width: "40px",
                height: "40px",
                "&:hover": {
                    backgroundColor: "#d45301",
                },
            }}
        >
            <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
    );

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        nextArrow: <CustomNextArrow />,
        prevArrow: <CustomPrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    arrows: false,
                },
            },
        ],
    };

    return (
        <div className="rewards-container">
            {/* Toast Notification */}
            {toast && (
                <div style={{
                    position: "fixed",
                    top: "20px",
                    left: "50%",
                    transform: "translateX(-50%)",

                    zIndex: 9999
                }}>
                    <Toast
                        type={toast.type}
                        title={toast.title}
                        message={toast.message}
                        onClose={() => setToast(null)}
                    />
                </div>
            )}

            <div className="rewards-header">
                <h1>Your Rewards</h1>
                <Button
  variant="outlined"
  onClick={async () => {
    try {
      const response = await fetch(
        `/api/public/Add1kPoints.php?user_id=${userId}`
      );
      const data = await response.json();

      if (data.success) {
        setToast({
          type: "success",
          title: "Points Granted",
          message: "✅ 1000 loyalty points added!",
        });
        retry(); // Refetch updated points
      } else {
        throw new Error(data.message || "Failed to add points");
      }
    } catch (err) {
      console.error("Dev points error:", err);
      setToast({
        type: "error",
        title: "Dev Error",
        message: err.message || "Something went wrong.",
      });
    }
  }}
  sx={{
    backgroundColor: "rgba(40, 167, 69, 0.1)",
    color: "#28a745",
    fontWeight: "bold",
    fontSize: "1rem",
    padding: "0.7rem 1.2rem",
    borderRadius: "8px",
    border: "2px solid #28a745",
    cursor: "pointer",
    marginLeft: "1rem",
    "&:hover": {
      backgroundColor: "#28a745",
      color: "white",
      borderColor: "#28a745",
    },
  }}
>
  Give 1000 Points
</Button>

                <p className="subtitle">Redeem your loyalty points for delicious treats</p>
            </div>

            {/* POINTS SUMMARY CARD */}
            <div className="points-card">
                <div className="points-content">
                    <div className="points-value">
                        <span className="points-number">{loyaltyPoints}</span>
                        <span className="points-label">points</span>
                    </div>
                    <div className="points-description">
                        <p>Current balance</p>
                        <Tooltip
                            title="You earn 1 point for every £1 spent. Redeem points for drinks and snacks!"
                            arrow
                            placement="top"
                        >
                            <IconButton aria-label="how it works" size="small">
                                <HelpOutlineIcon className="help-icon" />
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
                <div className="progress-container">
                    <div
                        className="progress-bar"
                        style={{ width: `${Math.min(100, (loyaltyPoints / 600) * 100)}%` }}
                    />
                </div>
            </div>

            {/* REWARDS CAROUSEL */}
            <div className="rewards-section">
                <h2>Available Rewards</h2>
                <p className="section-subtitle">Only one reward can be redeemed per purchase</p>

                <div className="slider-container">
                    <Slider {...sliderSettings}>
                        {rewardMilestones.map((milestone, i) => {
                            const progress = getProgress(loyaltyPoints, milestone.points);
                            const isUnlocked = loyaltyPoints >= milestone.points;
                            const selectedReward = JSON.parse(
                                localStorage.getItem("SelectedReward")
                            );
                            const isSelected = selectedReward?.id === i + 1;

                            const handleClick = () => {
                                if (isUnlocked) {
                                    localStorage.setItem(
                                        "SelectedReward",
                                        JSON.stringify({ id: i + 1, reward: milestone.reward })
                                    );
                                    setSelectedRewardId(i + 1);
                                    setToast({
                                        type: "success",
                                        title: "Reward Selected",
                                        message: `${milestone.reward} has been selected for your next purchase!`
                                    });
                                }
                            };

                            return (
                                <div key={i} onClick={handleClick}>
                                    <div className={`reward-card ${isSelected ? "selected" : ""} ${isUnlocked ? "unlocked" : "locked"}`}>
                                        <div className="reward-content">
                                            <h3>{milestone.reward}</h3>
                                            <p className="points-required">{milestone.points} pts</p>

                                            <div className="progress-wrapper">
                                                <div className="progress-track">
                                                    <div
                                                        className="progress-thumb"
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                                {!isUnlocked && (
                                                    <p className="points-remaining">
                                                        {milestone.points - loyaltyPoints} pts to go
                                                    </p>
                                                )}
                                            </div>

                                            <button
                                                className={`redeem-button ${isSelected ? "selected" : ""}`}
                                                disabled={!isUnlocked}
                                            >
                                                {isSelected ? "Selected" : isUnlocked ? "Redeem Now" : "Locked"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </Slider>
                </div>
            </div>
        </div>
    );
}

export default Rewards;

const styles = `
:root {
    --primary: #ee5c01;
    --primary-dark: #d45301;
    --primary-light: #ff7b33;
    --primary-extra-light: #ffe8d9;
    --text-dark: #2c3e50;
    --text-medium: #7f8c8d;
    --text-light: #95a5a6;
    --background-light: #f5f5f5;
    --border-light: #e0e0e0;
}

.rewards-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
    font-family: 'Segoe UI', Roboto, sans-serif;
    color: var(--text-dark);
}

.rewards-header {
    text-align: center;
    margin-bottom: 2rem;
}

.rewards-header h1 {
    font-size: 2.5rem;
    color: var(--text-dark);
    margin-bottom: 0.5rem;
    font-weight: 700;
}

.subtitle {
    font-size: 1.1rem;
    color: var(--text-medium);
    margin: 0;
}

/* Points Card */
.points-card {
    background: linear-gradient(135deg, #fff8f5 0%, #ffddd1 100%);
    border-radius: 16px;
    padding: 1.5rem;
    margin-bottom: 3rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid var(--primary-extra-light);
}

.points-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.points-value {
    display: flex;
    align-items: baseline;
}

.points-number {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--primary);
    margin-right: 0.5rem;
}

.points-label {
    font-size: 1.2rem;
    color: var(--text-medium);
}

.points-description {
    display: flex;
    align-items: center;
}

.points-description p {
    margin: 0 0.5rem 0 0;
    color: var(--text-medium);
}

.help-icon {
    color: var(--text-medium);
    transition: color 0.2s;
}

.help-icon:hover {
    color: var(--primary);
}

.progress-container {
    width: 100%;
    height: 8px;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 4px;
    overflow: hidden;
}

.progress-bar {
    height: 100%;
    background: linear-gradient(90deg, var(--primary-light), var(--primary));
    border-radius: 4px;
    transition: width 0.5s ease;
}

/* Rewards Section */
.rewards-section {
    background-color: white;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    margin-bottom: 2rem;
}

.rewards-section h2 {
    text-align: center;
    font-size: 1.8rem;
    color: var(--text-dark);
    margin-bottom: 0.5rem;
}

.section-subtitle {
    text-align: center;
    color: var(--text-light);
    font-style: italic;
    margin-bottom: 2rem;
}

.slider-container {
    padding: 0 2rem;
    position: relative;
}

/* Reward Cards */
.reward-card {
    background-color: white;
    border-radius: 12px;
    padding: 1.5rem;
    margin: 0 10px;
    height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid var(--border-light);
    transition: all 0.3s ease;
    cursor: pointer;
}

.reward-card.unlocked:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.reward-card.selected {
    background-color: var(--primary-extra-light);
    border: 2px solid var(--primary);
    box-shadow: 0 8px 20px rgba(238, 92, 1, 0.15);
}

.reward-card.locked {
    opacity: 0.7;
    cursor: not-allowed;
}

.reward-content {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.reward-card h3 {
    font-size: 1.3rem;
    color: var(--text-dark);
    margin-bottom: 0.5rem;
    text-align: center;
}

.points-required {
    font-size: 1rem;
    color: var(--text-medium);
    text-align: center;
    margin-bottom: 1.5rem;
}

.progress-wrapper {
    margin: 1rem 0;
}

.progress-track {
    width: 100%;
    height: 6px;
    background-color: #f0f0f0;
    border-radius: 3px;
    overflow: hidden;
}

.progress-thumb {
    height: 100%;
    background: linear-gradient(90deg, var(--primary-light), var(--primary));
    border-radius: 3px;
    transition: width 0.5s ease;
}

.points-remaining {
    font-size: 0.8rem;
    color: var(--text-light);
    text-align: center;
    margin-top: 0.5rem;
}

.redeem-button {
    margin-top: auto;
    padding: 0.7rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
}

.reward-card.unlocked .redeem-button {
    background: linear-gradient(135deg, var(--primary-light), var(--primary));
    color: white;
}

.reward-card.unlocked .redeem-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(238, 92, 1, 0.2);
}

.reward-card.selected .redeem-button {
    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
    color: white;
}

.reward-card.locked .redeem-button {
    background-color: #e0e0e0;
    color: var(--text-light);
    cursor: not-allowed;
}

/* Loading Spinner */
.loading-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    font-size: 1.2rem;
    color: var(--text-light);
}

/* Slick Carousel Customizations */
.slick-dots li button:before {
    color: var(--text-light);
    font-size: 10px;
}

.slick-dots li.slick-active button:before {
    color: var(--primary);
}

@media (max-width: 768px) {
    .rewards-container {
        padding: 1.5rem 1rem;
    }
    
    .rewards-header h1 {
        font-size: 2rem;
    }
    
    .points-card {
        padding: 1rem;
    }
    
    .points-number {
        font-size: 2rem;
    }
    
    .rewards-section {
        padding: 1.5rem 1rem;
    }
    
    .slider-container {
        padding: 0;
    }
    
    .reward-card {
        height: 280px;
        padding: 1.2rem;
    }
}
`;

// Inject styles
const styleElement = document.createElement("style");
styleElement.textContent = styles;
document.head.appendChild(styleElement);