import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import InfoDisplayModal from "./InfoDisplayModal";
import "../MapComponent_Style.css";

mapboxgl.accessToken =
  "pk.eyJ1Ijoicm9ja3loZW5kZXJzb24iLCJhIjoiY204Y3hsajk1MjJtcDJscXVoNHBxczVxeSJ9.fwvphAwtGJD_UiHR-beXvA";

const MapComponent = ({
  externalTrigger,
  clearTrigger,
  setSelectedStore,
  selectedStore,
  showToast,
}) => {
  const mapContainerRef = useRef(null);
  const [stores, setStores] = useState([]);

  useEffect(() => {
    fetch(
      "http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/public/read_stores.php"
    )
      .then((res) => res.json())
      .then((data) => setStores(data))
      .catch((err) => console.error("Failed to fetch stores:", err));
  }, []);

  useEffect(() => {
    if (externalTrigger === "LOCATE_NEAREST") {
      handleLocateNearestStore();
      clearTrigger(); // Reset after handling
    }
  }, [externalTrigger]);

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
    if (!mapContainerRef.current || stores.length === 0) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v10",
      center: [-4.2026, 56.4907],
      zoom: 6,
      pitchWithRotate: false,
      dragRotate: false,
      maxPitch: 0,
    });

    stores.forEach((store) => {
      const isOpen = isStoreCurrentlyOpen(store);

      const popupNode = document.createElement("div");
      popupNode.style.fontFamily = "sans-serif";
      popupNode.style.minWidth = "200px";

      popupNode.innerHTML = `
        <h3 style="margin: 0 0 0.3rem;">${store.store_name}</h3>
        <p style="margin: 0 0 0.5rem;">
          <strong style="color: ${isOpen ? "#00FF90" : "#FF5A5A"};">
            ${isOpen ? "Open" : "Closed"}
          </strong><br/>
          ${store.open_time} - ${store.close_time}
        </p>
      `;

      const btn = document.createElement("button");
      btn.textContent = "Learn More";
      btn.style.padding = "0.5rem 1rem";
      btn.style.background = "#FD6100";
      btn.style.border = "none";
      btn.style.color = "white";
      btn.style.borderRadius = "6px";
      btn.style.cursor = "pointer";
      btn.disabled = !isOpen;
      btn.style.opacity = isOpen ? 1 : 0.5;

      btn.addEventListener("click", () => {
        window.dispatchEvent(
          new CustomEvent("openStoreModal", { detail: store })
        );
      });

      popupNode.appendChild(btn);

      new mapboxgl.Marker()
        .setLngLat([store.longitude, store.latitude])
        .setPopup(new mapboxgl.Popup().setDOMContent(popupNode))
        .addTo(map);
    });

    return () => map.remove();
  }, [stores]);

  useEffect(() => {
    const handler = (e) => setSelectedStore(e.detail);
    window.addEventListener("openStoreModal", handler);
    return () => window.removeEventListener("openStoreModal", handler);
  }, [setSelectedStore]);

  const handleLocateNearestStore = () => {
    if (!navigator.geolocation) {
      showToast({
        title: "Geolocation Error",
        type: "error",
        message: "Geolocation is not supported by your browser.",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;

        const openStores = stores.filter(isStoreCurrentlyOpen);
        if (openStores.length === 0) {
          showToast({
            title: "No Stores Found",
            type: "warning",
            message: "No open stores near your location.",
          });
          return;
        }

        const toMiles = (meters) => meters * 0.000621371;

        const haversineDistance = (lat1, lon1, lat2, lon2) => {
          const R = 6371e3;
          const φ1 = (lat1 * Math.PI) / 180;
          const φ2 = (lat2 * Math.PI) / 180;
          const Δφ = ((lat2 - lat1) * Math.PI) / 180;
          const Δλ = ((lon2 - lon1) * Math.PI) / 180;

          const a =
            Math.sin(Δφ / 2) ** 2 +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return R * c;
        };

        let closestStore = null;
        let shortestDistance = Infinity;

        openStores.forEach((store) => {
          const dist = haversineDistance(
            userLat,
            userLon,
            store.latitude,
            store.longitude
          );
          if (dist < shortestDistance) {
            shortestDistance = dist;
            closestStore = store;
          }
        });

        if (closestStore) {
          const distanceMiles = toMiles(shortestDistance).toFixed(1);
          showToast({
            type: "warning",
            title: "No Stores Found",
            message: "No open stores near your location.",
          });
          
          setSelectedStore(closestStore);
        }
      },
      () => {
        showToast({
          type: "error",
          title: "Location Error",
          message: "Unable to retrieve your location.",
        });
        
      }
    );
  };

  return (
    <>
      <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
      {selectedStore && (
        <InfoDisplayModal
          title={selectedStore.store_name}
          onClose={() => setSelectedStore(null)}
          onConfirm={() => {
            sessionStorage.setItem("selectedStoreId", selectedStore.id);
            setSelectedStore(null);
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
    </>
  );
};

export default MapComponent;
