import React, { useRef, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useFetchWithRetry from "../utils/useFetchWithRetry";
import RetryFallback from "../components/RetryFallback";
import DrinkCard from "../components/DrinkCard";
import "../Order_Style.css";
import DrinkModal from "../components/DrinkModal";
import FilterSidebar from "../components/FilterSidebar";

const categoryMap = {
  hot: "Hot Drinks",
  cold: "Cold Drinks",
  food: "Food",
};

function OrderCategory() {
  const { type } = useParams();
  const label = categoryMap[type];
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [activeCategories, setActiveCategories] = useState([]);
  const scrollRefs = useRef({});
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const selectedStoreId = sessionStorage.getItem("selectedStoreId");

  useEffect(() => {
    if (!selectedStoreId) {
      navigate("/order", { replace: true });
    }
  }, [selectedStoreId, navigate]);

  const {
    data: drinks,
    error,
    retry,
    isLoading,
  } = useFetchWithRetry(
    selectedStoreId
      ? `http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/public/read_drinks.php?store_id=${selectedStoreId}`
      : null
  );

  const filteredDrinks =
    drinks?.filter((drink) => drink.category === type) || [];

  const allTags = Array.from(
    new Set(filteredDrinks.map((drink) => drink.tags || "Other"))
  );

  useEffect(() => {
    if (allTags.length && activeCategories.length === 0) {
      setActiveCategories(allTags);
    }
  }, [allTags]);

  const [priceFilter, setPriceFilter] = useState({ min: "", max: "" });
  const [searchTerm, setSearchTerm] = useState("");

  const groupedDrinks = filteredDrinks
    .filter((drink) => {
      const tag = drink.tags || "Other";
      const price = parseFloat(drink.price);
      const matchesCategory = activeCategories.includes(tag);
      const matchesPrice =
        (!priceFilter.min || price >= parseFloat(priceFilter.min)) &&
        (!priceFilter.max || price <= parseFloat(priceFilter.max));
      const matchesSearch =
        !searchTerm ||
        drink.name.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesPrice && matchesSearch;
    })
    .reduce((acc, drink) => {
      const tag = drink.tags || "Other";
      if (!acc[tag]) acc[tag] = [];
      acc[tag].push(drink);
      return acc;
    }, {});

  useEffect(() => {
    Object.values(scrollRefs.current).forEach((ref) => {
      if (!ref) return;

      let isDown = false;
      let startX = 0;
      let scrollLeft = 0;

      const onMouseDown = (e) => {
        isDown = true;
        ref.classList.add("dragging");
        startX = e.clientX;
        scrollLeft = ref.scrollLeft;
      };

      const onMouseMove = (e) => {
        if (!isDown) return;
        const x = e.clientX;
        const walk = (x - startX) * 1.2;
        ref.scrollLeft = scrollLeft - walk;
      };

      const onMouseUp = () => {
        isDown = false;
        ref.classList.remove("dragging");
      };

      ref.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);

      return () => {
        ref.removeEventListener("mousedown", onMouseDown);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };
    });
  }, [filteredDrinks]);

  if (!label) return <p>Category not found.</p>;
  if (error)
    return <RetryFallback onRetry={retry} message="Failed to load drinks." />;
  if (isLoading || !drinks) return <p>Loading drinks...</p>;

  return (
    <div className="order-category-page">
      <div className="order-category-header">
        <h1>{label}</h1>
      </div>

      {/* Mobile toggle button */}
      <button className="sidebar-toggle" onClick={() => setIsMobileSidebarOpen(true)}>
        Filters
      </button>

      {/* Mobile drawer sidebar */}
      <div className={`mobile-sidebar ${isMobileSidebarOpen ? "open" : ""}`}>
        <button className="close-sidebar" onClick={() => setIsMobileSidebarOpen(false)}>
          ✕
        </button>
        <FilterSidebar
          drinks={filteredDrinks}
          onFilterChange={(filters) => {
            setActiveCategories(filters.categories);
            setPriceFilter({ min: filters.priceMin, max: filters.priceMax });
            setSearchTerm(filters.search);
          }}
        />
      </div>

      <div className="order-content">
        {/* Desktop sidebar */}
        <div className="filter-sidebar-wrapper">
          <FilterSidebar
            drinks={filteredDrinks}
            onFilterChange={(filters) => {
              setActiveCategories(filters.categories);
              setPriceFilter({ min: filters.priceMin, max: filters.priceMax });
              setSearchTerm(filters.search);
            }}
          />
        </div>

        <div className="drink-groups">
          <div className="drink-grid flat-grid">
            {Object.values(groupedDrinks).flat().map((drink) => (
              <DrinkCard
                key={drink.id}
                drink={drink}
                onClick={() => setSelectedDrink(drink)}
              />
            ))}
          </div>
        </div>
      </div>

      <DrinkModal
        drink={selectedDrink}
        onClose={() => setSelectedDrink(null)}
      />
    </div>
  );
}

export default OrderCategory;
