import React from "react";
import "../Store_Style.css"; // Import the styles

function Store() {
  return (
    <div className="main-page-content">
      <h1>Find a BeanBucks Store</h1>
      {/* Search & Geolocation Section */}
      <div className="section search-section">
        <input
          type="text"
          placeholder="Search for a store..."
          className="search-bar"
        />
        <button className="geo-button">Find Nearest Store</button>
      </div>
      {/* Map Section (Fixed Size, Doesn't Overflow) */}
      {/* Store & Map Container */}
      <div className="store-container">
        {/* Store List Section */}
        <div className="section store-list">
          <p className="click-hint">Click a store card to learn more.</p>

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

        {/* Map Section */}
        <div className="section map-placeholder">
          <p>Map Here</p>
        </div>
      </div>
      <p className="click-hint">Click a store card to learn more.</p>{" "}
      {/* Hint added here */}
    </div>
  );
}

export default Store;
