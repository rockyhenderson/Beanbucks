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

    const CustomPrevArrow = ({ onClick }) => (
        <IconButton
            onClick={onClick}
            style={{
                position: "absolute",
                left: "0",
                top: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "var(--primary)",
                color: "#fff",
                zIndex: 2,
                width: "40px",
                height: "40px",
            }}
        >
            <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
    );

    const CustomNextArrow = ({ onClick }) => (
        <IconButton
            onClick={onClick}
            style={{
                position: "absolute",
                right: "0",
                top: "50%",
                transform: "translate(50%, -50%)",
                backgroundColor: "var(--primary)",
                color: "#fff",
                zIndex: 2,
                width: "40px",
                height: "40px",
            }}
        >
            <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
    );

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        nextArrow: <CustomNextArrow />,
        prevArrow: <CustomPrevArrow />,
        responsive: [
            {
                breakpoint: 1280,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 960,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    return (
        <div
            className="rewards"
            style={{ padding: "2rem 1rem", maxWidth: "1200px", margin: "auto" }}
        >
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
                    <p
                        style={{
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                            color: "var(--primary)",
                            margin: 0,
                        }}
                    >
                        {loyaltyPoints} pts
                    </p>
                    <p style={{ margin: 0 }}>Your current balance</p>
                </div>
                <Tooltip title="You earn 1 point for every £1 spent. Redeem points for drinks and snacks!">
                    <IconButton aria-label="how it works">
                        <HelpOutlineIcon style={{ color: "var(--primary)" }} />
                    </IconButton>
                </Tooltip>
            </div>

            {/* REWARDS CAROUSEL */}
            <div
                className="card"
                style={{
                    backgroundColor: "var(--card)",
                    borderRadius: "16px",
                    padding: "2rem 2rem 3rem",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                    overflow: "hidden",
                    position: "relative",
                }}
            >
                <h2 style={{ textAlign: "center", marginBottom: "0.5rem" }}>
                    Available Rewards
                </h2>
                <p
                    style={{
                        textAlign: "center",
                        fontStyle: "italic",
                        color: "var(--body-text)",
                        marginBottom: "2rem",
                    }}
                >
                    Only one reward can be redeemed per purchase.
                </p>

                <div style={{ padding: "0 1rem", boxSizing: "border-box" }}>
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
                                    alert(`Redeemed: ${milestone.reward}`);
                                }
                            };

                            return (
                                <div
                                    key={i}
                                    onClick={handleClick}
                                    style={{ padding: "0 15px", outline: "none" }}
                                >
                                    <div
                                        style={{
                                            maxWidth: "200px",
                                            margin: "0 auto",
                                            aspectRatio: "4 / 5",
                                            backgroundColor: isSelected ? "#ffe8d9" : "var(--card)",
                                            borderRadius: "12px",
                                            padding: "0.75rem",
                                            border: `2px solid ${isSelected
                                                    ? "var(--primary)"
                                                    : isUnlocked
                                                        ? "var(--primary)"
                                                        : "#ccc"
                                                }`,
                                            boxShadow: isSelected
                                                ? "0 6px 16px rgba(0,0,0,0.1)"
                                                : "0 2px 8px rgba(0,0,0,0.03)",
                                            transition: "all 0.2s ease",
                                            transform: isSelected ? "scale(1.02)" : "scale(1)",
                                            cursor: isUnlocked ? "pointer" : "not-allowed",
                                            textAlign: "center",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <h3
                                            style={{
                                                fontSize: "1rem",
                                                margin: 0,
                                                color: isSelected ? "#000" : "var(--body-text)",
                                            }}
                                        >
                                            {milestone.reward}
                                        </h3>

                                        <p
                                            style={{
                                                margin: "0.25rem 0 0.75rem",
                                                fontSize: "0.85rem",
                                                color: isSelected ? "#000" : "var(--body-text)",
                                            }}
                                        >
                                            {milestone.points} pts
                                        </p>


                                        <div
                                            style={{
                                                width: "100%",
                                                height: "8px",
                                                backgroundColor: "#eee",
                                                borderRadius: "6px",
                                            }}
                                        >
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
                                            <p
                                                style={{
                                                    fontSize: "0.75rem",
                                                    marginTop: "0.5rem",
                                                    color: "#555",
                                                }}
                                            >
                                                {milestone.points - loyaltyPoints} pts to go
                                            </p>
                                        )}

                                        <button
                                            disabled={!isUnlocked}
                                            style={{
                                                marginTop: "1rem",
                                                padding: "0.4rem 0.8rem",
                                                fontSize: "0.8rem",
                                                backgroundColor: isUnlocked
                                                    ? "var(--primary)"
                                                    : "#ccc",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: "8px",
                                                cursor: isUnlocked ? "pointer" : "not-allowed",
                                                fontWeight: 600,
                                            }}
                                        >
                                            {isSelected
                                                ? "Selected"
                                                : isUnlocked
                                                    ? "Redeem"
                                                    : "Locked"}
                                        </button>
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
