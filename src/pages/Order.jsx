import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryCard from "../components/CategoryCard";
import TwoChoicesModal from "../components/TwoChoices";
import "../Order_Style.css";

function Order() {
  const [hasStore, setHasStore] = useState(false);
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
      <h1 style={{ marginLeft: "2rem" }}>Menu</h1>

        <CategoryCard />
      </div>
    </>
  );
}

export default Order;
