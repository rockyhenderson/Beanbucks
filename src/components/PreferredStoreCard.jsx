import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PreferredStoreCard = () => {
  const navigate = useNavigate();
  const [store, setStore] = useState(null);

  useEffect(() => {
    const id = sessionStorage.getItem("selectedStoreId");
    console.log("Selected Store ID:", id); // ✅ should print '1'

    if (!id) return;

    fetch(
      "/api/public/read_stores.php"
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched store list:", data); // ✅ confirm array

        const match = data.find((s) => String(s.id) === String(id)); // 🔥 string-safe compare
        console.log("Matched store:", match); // ✅ should show full store object

        if (match) setStore(match);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  if (!store) {
    return (
      <div style={{ opacity: 0.75 }}>
        No preferred store selected.
        <br />
        <button
          className="btn btn--primary"
          style={{ marginTop: "1rem" }}
          onClick={() => navigate("/store")}
        >
          Select a Store
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "var(--card)",
        borderRadius: "10px",
        padding: "1rem",
        marginTop: "0.5rem",

      }}
    >
      <h3 style={{ margin: "0 0 0.25rem" }}>{store.store_name}</h3>
      <p style={{ margin: 0, fontSize: "0.95rem", opacity: 0.9 }}>
        📍 {store.address}
      </p>

    </div>
  );
};

export default PreferredStoreCard;
