import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

// 🔹 Set your Mapbox API access token (replace with your own key)
mapboxgl.accessToken = "pk.eyJ1Ijoicm9ja3loZW5kZXJzb24iLCJhIjoiY204Y3hsajk1MjJtcDJscXVoNHBxczVxeSJ9.fwvphAwtGJD_UiHR-beXvA";

const MapComponent = () => {
  // 🔹 Create a reference for the map container div
  const mapContainerRef = useRef(null);

  // 🔹 Store state to hold fetched store locations
  const [stores, setStores] = useState([]);

  /**
   * 🔹 Fetches store data from the API when the component mounts
   */
  useEffect(() => {
    fetch("http://webdev.edinburghcollege.ac.uk/~HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/public/read_stores.php")
      .then((response) => response.json()) // Parse the JSON response
      .then((data) => {
        setStores(data); // Store the fetched data in state
      })
      .catch((error) => console.error("Error fetching store data:", error)); // Handle errors
  }, []); // Runs only once when the component mounts

  /**
   * 🔹 Initializes the Mapbox map and adds store markers when store data is available
   */
  useEffect(() => {
    if (!mapContainerRef.current || stores.length === 0) return; // If map container doesn't exist or no stores, exit

    // 🔹 Initialize Mapbox map
    const map = new mapboxgl.Map({
      container: mapContainerRef.current, // Bind map to the div ref
      style: "mapbox://styles/mapbox/light-v10", // Map style (light theme)
      center: [-4.2026, 56.4907], // Set center (Scotland)
      zoom: 6, // Initial zoom level
      pitchWithRotate: false, // Prevents tilting when rotating the map
      dragRotate: false, // Disables manual rotation by user
      maxPitch: 0, // Forces the map to stay flat (2D mode)
    });

    // 🔹 Loop through all stores and add a marker for each one
    stores.forEach((store) => {
      new mapboxgl.Marker() // Create a new marker
        .setLngLat([store.longitude, store.latitude]) // Set marker position using store coordinates
        .setPopup(new mapboxgl.Popup().setHTML( // Create a popup with store details
          `<h3>${store.store_name}</h3><p>${store.address}</p>`
        ))
        .addTo(map); // Add marker to the map
    });

    // 🔹 Cleanup function to remove the map when the component unmounts
    return () => map.remove();
  }, [stores]); // Runs whenever the store list changes

  // 🔹 Return the map container div (Mapbox will render the map inside this)
  return <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />;
};

export default MapComponent;
