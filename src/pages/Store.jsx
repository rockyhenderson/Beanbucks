import React, { useRef } from "react";
import "../Store_Style.css"; // Import the styles
import MapComponent from "../components/MapComponent";

function Store() {
  const storeListRef = useRef(null); // Reference to the store list section

  const scrollToStoreList = () => {
    storeListRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="main-page-content">

      {/* Map Section (Fixed Size, Doesn't Overflow) */}
      <div className="store-container">
        {/* Store List Section */}
        <div className="section store-list" ref={storeListRef}>

          <div className="store-card">
            <strong>BeanBucks - City Center</strong>
            <p>Open: 7 AM - 10 PM</p>
            <p>123 Coffee St, Edinburgh</p>
            <p>Facilities: WiFi, Drive-Thru, Indoor Seating</p>
            <button className="select-store-button">Select This Store</button>
          </div>

          <div className="store-card">
            <strong>BeanBucks - West End</strong>
            <p>Open: 6 AM - 11 PM</p>
            <p>456 Latte Rd, Glasgow</p>
            <p>Facilities: Drive-Thru, Outdoor Seating</p>
            <button className="select-store-button">Select This Store</button>
          </div>

          <div className="store-card">
            <strong>BeanBucks - Riverside</strong>
            <p>Open: 8 AM - 9 PM</p>
            <p>789 Espresso Ave, Dundee</p>
            <p>Facilities: WiFi, Indoor Seating</p>
            <button className="select-store-button">Select This Store</button>
          </div>
        </div>

        {/* Map Section with Search Bar (For Mobile) */}
        <div className="section map-wrapper">
          {/* Mobile Search & Geolocation Section */}
          <div className="section search-section mobile-search">
            <input
              type="text"
              placeholder="Search for a store..."
              className="search-bar"
            />
            <button className="geo-button">Find Nearest Store</button>
          </div>
          <MapComponent />
        </div>
      </div>


      {/* Scroll Arrow */}
      <div className="scroll-arrow" onClick={scrollToStoreList}>
        ↓
      </div>
    </div>
  );
}

export default Store;
