import React, { useEffect, useState } from "react";
import { useMediaQuery } from "@mui/material";
import MapComponent from "../components/MapComponent";
import InfoDisplayModal from "../components/InfoDisplayModal";
import Toast from "../components/Toast";
import useFetchWithRetry from "../utils/useFetchWithRetry";
import RetryFallback from "../components/RetryFallback";
import TwoChoicesModal from "../components/TwoChoices";

function Store() {
  const {
    data: stores,
    error,
    retry,
    isLoading,
  } = useFetchWithRetry(
    "http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/public/read_stores.php"
  );
  const [toast, setToast] = useState(null);
  const [justSelectedStore, setJustSelectedStore] = useState(null);
  const selectedStoreIdFromSession = sessionStorage.getItem("selectedStoreId");
  console.log("Selected store ID from session:", selectedStoreIdFromSession);

  const isDesktop = useMediaQuery("(min-width: 900px)");
  const [selectedStore, setSelectedStore] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [mapAction, setMapAction] = useState(null);
  const showToast = ({ type, title, message }) => {
    setToast({ type, title, message });
    setTimeout(() => setToast(null), 4000);
  };

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
  if (error) return <RetryFallback onRetry={retry} />;
  if (isLoading) return <p style={{ padding: "2rem" }}>Loading stores...</p>;
  if (!stores) return null;

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
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            animation: "slideDown 0.3s ease-out",
          }}
        >
          <Toast
            type={toast.type}
            title={toast.title}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        </div>
      )}

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
            const isSelected = store.id.toString() === selectedStoreIdFromSession;

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

                {isSelected ? (
                  <div
                    style={{
                      marginTop: "0.75rem",
                      padding: "0.5rem 1rem",
                      backgroundColor: "#d4f7d4", // light green
                      border: "2px solid #2e7d32", // dark green
                      borderRadius: "6px",
                      fontWeight: 600,
                      textAlign: "center",
                      color: "#2e7d32", // dark green text to match border
                    }}
                  >
                    ✅ Already Selected
                  </div>

                ) : (
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
                      disabled={!isOpenNow}
                      style={{
                        opacity: isOpenNow ? 1 : 0.5,
                        cursor: isOpenNow ? "pointer" : "not-allowed",
                      }}
                    >
                      Learn More
                    </button>

                    <button
                      className="btn btn--primary"
                      disabled={!isOpenNow}
                      onClick={() => {
                        localStorage.removeItem("beanbucks_cart");
                        sessionStorage.setItem("selectedStoreId", store.id);
                        setToast({
                          type: "success",
                          title: "Store Selected!",
                          message: `You selected ${store.store_name}!`,
                        });
                        setSelectedStore(null);
                        setJustSelectedStore(store);
                      }}
                      style={{
                        opacity: isOpenNow ? 1 : 0.5,
                        cursor: isOpenNow ? "pointer" : "not-allowed",
                      }}
                    >
                      Select This Store
                    </button>
                  </div>
                )}
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
            
            marginLeft: isDesktop ? 0 : "1rem", // 1rem margin for left on mobile
            marginRight: isDesktop ? 0 : "1rem", // 1rem margin for right on mobile
            justifyContent: "space-between", // Space out the search bar and button properly
          }}
        >
          <input
            type="text"
            placeholder="Search for a store..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // Allows click to register
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

          {/* 🔽 Search Suggestions Dropdown */}
          {showDropdown && searchQuery && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 0.5rem)",
                left: 0,
                right: 0,
                backgroundColor: "var(--card)",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                padding: "0.5rem",
                maxHeight: "200px",
                overflowY: "auto",
                zIndex: 999,
              }}
            >
              {stores.filter((store) =>
                `${store.store_name} ${store.address}`
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
              ).length > 0 ? (
                stores
                  .filter((store) =>
                    `${store.store_name} ${store.address}`
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                  )
                  .map((store) => (
                    <div
                      key={store.id}
                      onClick={() => {
                        setSelectedStore(store);
                        setShowDropdown(false);
                        setSearchQuery("");
                      }}
                      style={{
                        padding: "0.5rem",
                        cursor: "pointer",
                        borderRadius: "6px",
                        transition: "0.2s",
                      }}
                      onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "var(--background)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <strong>{store.store_name}</strong>
                      <div style={{ fontSize: "0.85rem", opacity: 0.7 }}>
                        {store.address}
                      </div>
                    </div>
                  ))
              ) : (
                <div style={{ padding: "0.5rem", opacity: 0.6 }}>
                  No stores found.
                </div>
              )}
            </div>
          )}

          <button
            className="btn btn--primary"
            onClick={() => setMapAction("LOCATE_NEAREST")}
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
          <MapComponent
            stores={stores}
            externalTrigger={mapAction}
            clearTrigger={() => setMapAction(null)}
            setSelectedStore={setSelectedStore}
            selectedStore={selectedStore}
            showToast={showToast}
            setJustSelectedStore={setJustSelectedStore}
          />
        </div>
      </div>
      {justSelectedStore && (
        <TwoChoicesModal
          title={`You've selected ${justSelectedStore.store_name}.`}
          confirmLabel="Go to Order Page"
          cancelLabel="Change Store"
          onConfirm={() => {
            window.location.href = "/order"; // redirect
          }}
          onCancel={() => setJustSelectedStore(null)} // just close modal
        />
      )}

      {selectedStore && (
        <InfoDisplayModal
          title={selectedStore.store_name}
          onClose={() => setSelectedStore(null)}
          onConfirm={() => {
            localStorage.removeItem("beanbucks_cart");
            sessionStorage.setItem("selectedStoreId", selectedStore.id);
            setToast({
              type: "success",
              title: "Store Selected!",
              message: `You selected ${selectedStore.store_name}!`,
            });
            setSelectedStore(null);
            setJustSelectedStore(selectedStore); // Fix: use selectedStore not store

          }}

          confirmLabel="Select This Store"
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
