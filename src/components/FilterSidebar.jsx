import React, { useState, useEffect } from "react";
function FilterSidebar({ drinks = [], flavours = [], onFilterChange, onClose }) {

  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedFlavours, setSelectedFlavours] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  // Dynamically extract unique categories from tags
  const categories = Array.from(
    new Set(drinks.map((drink) => drink.tags || "Other"))
  ).filter(Boolean);
  useEffect(() => {
    if (categories.length > 0 && selectedCategories.length === 0) {
      setSelectedCategories(categories);
    }
  }, [categories]);
  
  const toggleSelection = (value, list, setList) => {
    setList(
      list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value]
    );
  };
  const minPrice = Math.floor(Math.min(...drinks.map(d => parseFloat(d.price) || 0)));
  const maxPrice = Math.ceil(Math.max(...drinks.map(d => parseFloat(d.price) || 0)));
  useEffect(() => {
    onFilterChange({
      search,
      categories: selectedCategories,
      flavours: selectedFlavours,
      priceMin: priceRange.min,
      priceMax: priceRange.max,
    });
  }, [search, selectedCategories, selectedFlavours, priceRange]);
  
  
  
  const clearAll = () => {
    setSearch("");
    setSelectedCategories([]);
    setSelectedFlavours([]);
    setPriceRange({ min: "", max: "" });
    onFilterChange({});
  };


  return (
    <aside
      className="filter-sidebar"
      style={{
        backgroundColor: "var(--card)",
        color: "var(--text)",
        borderRadius: "12px",
        padding: "1.5rem",
        width: "100%",
        maxWidth: "300px",
        boxShadow: "0 0 15px rgba(0,0,0,0.1)",
      }}
    >
      {/* Heading */}
      <h2 style={{ fontSize: "1.5rem", marginBottom: "1.2rem", marginTop:"0" }}>Filters</h2>

      {/* Search */}
      <div style={{ marginBottom: "1.2rem" }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search drinks..."
          style={{
            width: "100%",
            padding: "0.6rem",
            borderRadius: "8px",
            border: "1px solid var(--component-border)",
            background: "var(--background)",
            color: "var(--text)",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Categories */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h4>Categories</h4>
        {categories.length > 0 ? (
          categories.map((cat) => (
            <label key={cat} style={{ display: "block", marginBottom: "0.5rem" }}>
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() =>
                  toggleSelection(cat, selectedCategories, setSelectedCategories)
                }
                style={{ marginRight: "0.5rem" }}
              />
              {cat}
            </label>
          ))
        ) : (
          <p style={{ fontSize: "0.9rem", color: "var(--body-text)" }}>
            No categories available
          </p>
        )}
      </div>

      {/* Price Range */}
      <div >
  <h4>Price Range (£{priceRange.min} – £{priceRange.max || maxPrice})</h4>
  <input
    type="range"
    min={minPrice}
    max={maxPrice}
    step="0.1"
    value={priceRange.max || maxPrice}
    onChange={(e) =>
      setPriceRange((prev) => ({ ...prev, max: e.target.value }))
    }
    style={{ width: "100%" }}
  />
</div>


      {/* Clear All */}
      <button
        onClick={clearAll}
        style={{
          backgroundColor: "var(--primary)",
          color: "var(--button-text)",
          border: "none",
          width: "100%",
          padding: "0.75rem",
          borderRadius: "8px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Clear All Filters
      </button>
    </aside>
  );
}

export default FilterSidebar;
