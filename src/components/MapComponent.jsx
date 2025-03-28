import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import InfoDisplayModal from "./InfoDisplayModal";
import "../MapComponent_Style.css";

mapboxgl.accessToken =
  "pk.eyJ1Ijoicm9ja3loZW5kZXJzb24iLCJhIjoiY204Y3hsajk1MjJtcDJscXVoNHBxczVxeSJ9.fwvphAwtGJD_UiHR-beXvA";

const MapComponent = () => {
  const mapContainerRef = useRef(null);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);

  useEffect(() => {
    fetch(
      "http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/public/read_stores.php"
    )
      .then((res) => res.json())
      .then((data) => setStores(data))
      .catch((err) => console.error("Failed to fetch stores:", err));
  }, []);

  const isStoreCurrentlyOpen = (store) => {
    if (!store?.is_open) return false; //same as if (!store || store.is_open !== true) return false;

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
      btn.disabled = !isOpen; // Disable button if the store is closed or outside operating hours

      // Apply dulling effect if the store is closed
      btn.style.opacity = isOpen ? 1 : 0.5;  // Make it dull if the store is closed

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
  }, []);

  return (
    <>
      <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
      {selectedStore && (
        <InfoDisplayModal
          title={selectedStore.store_name}
          onClose={() => setSelectedStore(null)}
          onConfirm={() =>
            alert(`Store "${selectedStore.store_name}" selected!`)
          }
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
