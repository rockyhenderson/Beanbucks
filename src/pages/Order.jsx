import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import CategoryCard from "../components/CategoryCard";
import TwoChoicesModal from "../components/TwoChoices";
import "../Order_Style.css";
import HowItWorksSteps from "../components/HowItWorksSteps";

function Order() {
  const [hasStore, setHasStore] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedStore = sessionStorage.getItem("selectedStoreId");
    setHasStore(!!storedStore);

    document.body.style.overflow = storedStore ? "auto" : "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleSelectStore = () => navigate("/store");
  const handleGoHome = () => navigate("/");
  const handleQuizClick = () => setShowQuizModal(true); // ✅ Show quiz modal

  return (
    <>
      {!hasStore && (
        <TwoChoicesModal
          title="Please select a store before ordering"
          confirmLabel="Select Store"
          cancelLabel="Home"
          onConfirm={handleSelectStore}
          onCancel={handleGoHome}
        />
      )}
      <div className={`orders ${!hasStore ? "rewards--blurred" : ""}`}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          margin: "2rem 2rem 1rem 2rem",
          flexWrap: "wrap",
          gap: "1rem",
          paddingTop: "1rem"
        }}>
          <h1 style={{ margin: 0 }}>Menu</h1>

          <Button
            variant="outlined"
            onClick={handleQuizClick}
            sx={{
              border: "2px solid var(--primary)",
              color: "var(--primary)",
              backgroundColor: "white",
              fontSize: "1rem",
              px: 3,
              py: 1,
              borderRadius: "24px",
              textTransform: "none",
              fontWeight: "bold",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              '&:hover': {
                backgroundColor: "rgba(var(--primary-rgb), 0.08)",
                border: "2px solid var(--primary)",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
              },
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}
          >
            <span style={{ whiteSpace: "nowrap" }}>Find Your Perfect Drink</span>
            <span style={{ fontSize: "1.2rem" }}>☕</span>
          </Button>
        </div>

        <CategoryCard />
      </div>

      {/* ✅ Modal rendering */}
      {showQuizModal && (
        <HowItWorksSteps onClose={() => setShowQuizModal(false)} />
      )}
    </>
  );
}

export default Order;
