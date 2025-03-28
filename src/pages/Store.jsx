import React, { useEffect, useState } from "react";
import { useMediaQuery } from "@mui/material";
import MapComponent from "../components/MapComponent";
import InfoDisplayModal from "../components/InfoDisplayModal";

function Store() {
  const isDesktop = useMediaQuery("(min-width: 900px)");
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);

  const isStoreCurrentlyOpen = (store) => {
    if (!store?.is_open) return false;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [openHour, openMinute] = store.open_time.split(":").map(Number);
    const [closeHour, closeMinute] = store.close_time.split(":").map(Number);

    const openMinutes = openHour * 60 + openMinute;
    const closeMinutes = closeHour * 60 + closeMinute;

    return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
  };

  useEffect(() => {
    fetch(
      "http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/public/read_stores.php"
    )
      .then((res) => res.json())
      .then((data) => setStores(data))
      .catch((err) => console.error("Failed to fetch stores:", err));
  }, []);

  return (
    <div
      style={{
        display: "flex",
        height: isDesktop ? "calc(100vh - 84px)" : "100vh",
        width: "100%",
        backgroundColor: "var(--background)",
        color: "var(--text)",
        flexDirection: isDesktop ? "row" : "column",
      }}
    >
      {isDesktop && (
        <div
          style={{
            width: "400px",
            padding: "1.5rem",
            overflowY: "auto",
            boxShadow: "2px 0 10px rgba(0,0,0,0.08)",
            backgroundColor: "var(--card)",
          }}
        >
          <h2 style={{ marginBottom: "1rem" }}>Available Stores</h2>

          {stores.map((store) => {
            const isOpenNow = isStoreCurrentlyOpen(store);
            return (
              <div
                key={store.id}
                style={{
                  marginBottom: "1rem",
                  padding: "1rem",
                  backgroundColor: "var(--background)",
                  borderRadius: "10px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                }}
              >
                <h3 style={{ margin: "0 0 0.5rem" }}>{store.store_name}</h3>
                <p>
                  <strong
                    style={{
                      color: isOpenNow ? "#00FF90" : "#FF5A5A",
                      fontWeight: 600,
                      marginRight: "0.5rem",
                    }}
                  >
                    {isOpenNow ? "Open" : "Closed"}
                  </strong>
                  {store.open_time} - {store.close_time}
                </p>
                <p>{store.address}</p>
                <div
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    marginTop: "0.75rem",
                  }}
                >
                  <button
                    className="btn btn--outline"
                    onClick={() => store.is_open && setSelectedStore(store)}
                    disabled={!isStoreCurrentlyOpen(store)}
                    style={{
                      opacity: isStoreCurrentlyOpen(store) ? 1 : 0.5,
                      cursor: isStoreCurrentlyOpen(store)
                        ? "pointer"
                        : "not-allowed",
                    }}
                  >
                    Learn More
                  </button>

                  <button
                    className="btn btn--primary"
                    disabled={!isStoreCurrentlyOpen(store)}
                    style={{
                      opacity: isStoreCurrentlyOpen(store) ? 1 : 0.5,
                      cursor: isStoreCurrentlyOpen(store)
                        ? "pointer"
                        : "not-allowed",
                    }}
                  >
                    Select This Store
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ flex: 1, position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: "1rem",
            left: "1rem",
            zIndex: 10,
            backgroundColor: "var(--card)",
            padding: "1rem",
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            flexWrap: "wrap",
            margin: 0,
            width: isDesktop ? "300px" : "calc(100% - 2rem)", // Keep width as per device size
            left: isDesktop ? "1rem" : undefined, // Align left on desktop
            right: isDesktop ? undefined : "1rem", // Add 1rem margin on mobile
            marginLeft: isDesktop ? 0 : "1rem", // 1rem margin for left on mobile
            marginRight: isDesktop ? 0 : "1rem", // 1rem margin for right on mobile
            display: "flex", // Keep the flex to ensure both elements are inline
            justifyContent: "space-between", // Space out the search bar and button properly
          }}
        >
          <input
            type="text"
            placeholder="Search for a store..."
            style={{
              flexGrow: 1,
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              border: "1px solid var(--primary)",
              backgroundColor: "var(--background)",
              color: "var(--text)",
              fontSize: "1rem",
            }}
          />
          <button
            className="btn btn--primary"
            style={{
              padding: "0.75rem 1.5rem",
              fontWeight: 600,
              fontSize: "0.95rem",
              borderRadius: "8px",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            Locate Nearest Store
          </button>
        </div>

        <div style={{ width: "100%", height: "100%" }}>
          <MapComponent />
        </div>
      </div>

      {selectedStore && (
        <InfoDisplayModal
          title={selectedStore.store_name}
          onClose={() => setSelectedStore(null)}
        >
          <p>
            <strong>Address:</strong> {selectedStore.address}
          </p>
          <p>
            <strong>Open Hours:</strong> {selectedStore.open_time} –{" "}
            {selectedStore.close_time}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              style={{
                color: isStoreCurrentlyOpen(selectedStore)
                  ? "#00FF90"
                  : "#FF5A5A",
                fontWeight: 600,
              }}
            >
              {isStoreCurrentlyOpen(selectedStore) ? "Open" : "Closed"}
            </span>
          </p>
          <p>
            <strong>Latitude:</strong> {selectedStore.latitude}
          </p>
          <p>
            <strong>Longitude:</strong> {selectedStore.longitude}
          </p>
        </InfoDisplayModal>
      )}
    </div>
  );
}

export default Store;
