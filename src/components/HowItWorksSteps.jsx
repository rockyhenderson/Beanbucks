import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LocalCafe as CoffeeIcon, Store as StoreIcon } from "@mui/icons-material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";

function HowItWorksSteps() {
  const [needsShopSelection, setNeedsShopSelection] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [randomDrinks, setRandomDrinks] = useState([]);
  const [shops, setShops] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if shop is selected
    const selectedStoreId = sessionStorage.getItem("selectedStoreId");
    if (!selectedStoreId) {
      setNeedsShopSelection(true);
    }

    // Fetch shops data


    // Fetch random drinks
    fetch("http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/public/get_random_drinks.php")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRandomDrinks(data);
        } else {
          console.error("Invalid drinks response format:", data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch random drinks:", err);
      });
  }, []);

  const questions = [
    {
      question: "What's your coffee personality?",
      options: [
        { text: "Bold & intense", value: "bold" },
        { text: "Smooth & balanced", value: "balanced" },
        { text: "Sweet & indulgent", value: "sweet" },
        { text: "Light & refreshing", value: "light" }
      ]
    },
    {
      question: "Preferred serving style?",
      options: [
        { text: "Hot classic", value: "hot" },
        { text: "Iced/chilled", value: "iced" },
        { text: "Blended frappe", value: "frappe" },
        { text: "Nitro cold brew", value: "nitro" }
      ]
    },
    {
      question: "Favorite flavor profile?",
      options: [
        { text: "Chocolate/caramel", value: "chocolate" },
        { text: "Spiced/seasonal", value: "spiced" },
        { text: "Fruity/floral", value: "fruity" },
        { text: "Pure coffee", value: "pure" }
      ]
    }
  ];

  const getRecommendation = () => {
    if (randomDrinks.length === 0) return [];
    const shuffled = [...randomDrinks].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 2);
  };

  const handleAnswer = (value) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setResult(getRecommendation());
    }
  };

  const handleShopSelect = (shopId) => {
    sessionStorage.setItem("selectedStoreId", shopId);
    setNeedsShopSelection(false);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
  };

  const selectedShopName = shops.find(shop =>
    shop.id === sessionStorage.getItem("selectedStoreId")
  )?.shop_name || "your selected store";

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        maxWidth: "600px",
        margin: isMobile ? "2rem 1rem" : "3rem auto",
        padding: isMobile ? "1.5rem" : "2rem",
        backgroundColor: "var(--card)",
        borderRadius: "16px",
        border: "1px solid var(--component-border)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        fontFamily: "'Quicksand', sans-serif"
      }}
    >
      <div style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "1.5rem",
        color: "var(--primary)"
      }}>
        {needsShopSelection ? (
          <StoreIcon style={{
            fontSize: isMobile ? "1.8rem" : "2rem",
            marginRight: "0.5rem"
          }} />
        ) : (
          <CoffeeIcon style={{
            fontSize: isMobile ? "1.8rem" : "2rem",
            marginRight: "0.5rem"
          }} />
        )}
        <h2 style={{
          fontSize: isMobile ? "1.3rem" : "1.5rem",
          fontWeight: 600,
          margin: 0,
          color: "var(--heading-color)"
        }}>
          {needsShopSelection ? "Select Your Shop" :
            result ? "Your Perfect Drinks" : "Barista's Choice Quiz"}
        </h2>
      </div>

      {needsShopSelection ? (
        <>
          <div style={{
            width: "100%",
            height: "4px",
            backgroundColor: "var(--component-border)",
            borderRadius: "2px",
            marginBottom: isMobile ? "1.5rem" : "2rem"
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.5 }}
              style={{
                height: "100%",
                borderRadius: "2px",
                backgroundColor: "var(--primary)"
              }}
            />
          </div>

          <h3 style={{
            fontSize: isMobile ? "1.1rem" : "1.2rem",
            fontWeight: 600,
            color: "var(--heading-color)",
            marginBottom: isMobile ? "1rem" : "1.5rem",
            textAlign: "center"
          }}>
            Please choose a shop location before starting the quiz
          </h3>

          {/* Add the Change Store button here */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/store")}
            style={{
              backgroundColor: "var(--primary)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: isMobile ? "0.75rem" : "1rem",
              fontWeight: 600,
              cursor: "pointer",
              textAlign: "center",
              transition: "all 0.2s ease",
              fontSize: isMobile ? "0.85rem" : "0.9rem",
              width: "100%",
              marginBottom: "1.5rem"
            }}
          >
            Choose Store
          </motion.button>

          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: "0.75rem",
            marginBottom: isMobile ? "1.5rem" : "2rem"
          }}>
            {shops.map((shop, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleShopSelect(shop.id)}
                style={{
                  backgroundColor: "transparent",
                  color: "var(--text)",
                  border: "2px solid var(--primary)",
                  borderRadius: "8px",
                  padding: isMobile ? "0.75rem" : "1rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.2s ease",
                  fontSize: isMobile ? "0.85rem" : "0.9rem"
                }}
              >
                {shop.shop_name}
              </motion.button>
            ))}
          </div>
        </>
      ) : !result ? (
        <>
          <div style={{
            width: "100%",
            height: "4px",
            backgroundColor: "var(--component-border)",
            borderRadius: "2px",
            marginBottom: isMobile ? "1.5rem" : "2rem"
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                backgroundColor: "var(--primary)"
              }}
              transition={{ duration: 0.5 }}
              style={{
                height: "100%",
                borderRadius: "2px"
              }}
            />
          </div>

          <h3 style={{
            fontSize: isMobile ? "1.1rem" : "1.2rem",
            fontWeight: 600,
            color: "var(--heading-color)",
            marginBottom: isMobile ? "1rem" : "1.5rem"
          }}>
            {questions[currentQuestion].question}
          </h3>

          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: "0.75rem",
            marginBottom: isMobile ? "1.5rem" : "2rem"
          }}>
            {questions[currentQuestion].options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleAnswer(option.value)}
                style={{
                  backgroundColor: "transparent",
                  color: "var(--text)",
                  border: "2px solid var(--primary)",
                  borderRadius: "8px",
                  padding: isMobile ? "0.75rem" : "1rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.2s ease",
                  fontSize: isMobile ? "0.85rem" : "0.9rem"
                }}
              >
                {option.text}
              </motion.button>
            ))}
          </div>

          <div style={{
            color: "var(--body-text)",
            fontSize: "0.85rem",
            textAlign: "center"
          }}>
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              backgroundColor: "var(--primary)",
              color: "white",
              padding: isMobile ? "1rem" : "1.5rem",
              borderRadius: "12px",
              marginBottom: isMobile ? "1.5rem" : "2rem",
              textAlign: "center"
            }}
          >
            <h3 style={{
              fontSize: isMobile ? "1.2rem" : "1.3rem",
              fontWeight: 700,
              margin: "0 0 0.5rem"
            }}>
              We Recommend
            </h3>
            <p style={{
              margin: 0,
              fontSize: isMobile ? "0.9rem" : "1rem"
            }}>
              Based on your taste profile at {selectedShopName}
            </p>
          </motion.div>

          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: "1rem",
            marginBottom: isMobile ? "1.5rem" : "2rem"
          }}>
            {result.map((drink, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                style={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--component-border)",
                  borderRadius: "8px",
                  padding: "1rem",
                  textAlign: "center",
                  cursor: "pointer"
                }}
                onClick={() => {
                  console.log("Drink being sent to Order page:", drink); 
debugger
                  navigate(`/order/${drink.category.toLowerCase()}`, {
                    state: { drink }
                  });
                }}

              >
                <div style={{
                  width: "50px",
                  height: "50px",
                  backgroundColor: "var(--primary)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 0.5rem",
                  color: "white"
                }}>
                  <CoffeeIcon style={{ fontSize: "1.5rem" }} />
                </div>
                <p style={{
                  fontWeight: 600,
                  color: "var(--heading-color)",
                  margin: "0.25rem 0",
                  fontSize: "0.95rem"
                }}>
                  {drink.name}
                </p>
                <div
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "white",
                    border: "none",
                    borderRadius: "999px",
                    padding: "0.25rem 0.75rem",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    marginTop: "0.5rem",
                    display: "inline-block"
                  }}
                >
                  Order Now
                </div>
              </motion.div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={restartQuiz}
            style={{
              backgroundColor: "transparent",
              color: "var(--primary)",
              border: "2px solid var(--primary)",
              borderRadius: "8px",
              padding: isMobile ? "0.6rem" : "0.75rem 1.5rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "block",
              margin: "0 auto",
              width: "100%",
              maxWidth: "200px",
              fontSize: isMobile ? "0.85rem" : "0.9rem"
            }}
          >
            Try Again
          </motion.button>
        </>
      )}
    </motion.section>
  );
}

export default HowItWorksSteps;