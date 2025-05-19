import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LocalCafe as CoffeeIcon, Store as StoreIcon, Close as CloseIcon } from "@mui/icons-material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";

function HowItWorksSteps({ onClose }) {
  const [needsShopSelection, setNeedsShopSelection] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [randomDrinks, setRandomDrinks] = useState([]);
  const [shops, setShops] = useState([]);
  const navigate = useNavigate();

  // Fetch random drinks
  useEffect(() => {
    const selectedStoreId = sessionStorage.getItem("selectedStoreId");
    if (!selectedStoreId) {
      setNeedsShopSelection(true);
    }

    fetch("/api/public/get_random_drinks.php")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRandomDrinks(data);
        }
      })
      .catch(console.error);
  }, []);

  // All quiz questions
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
    },
    {
      question: "How do you take your coffee?",
      options: [
        { text: "Black - no additions", value: "black" },
        { text: "With milk/cream", value: "milk" },
        { text: "Sweetened", value: "sweetened" },
        { text: "With flavors/syrups", value: "flavored" }
      ]
    },
    {
      question: "When do you typically drink coffee?",
      options: [
        { text: "Morning wake-up", value: "morning" },
        { text: "Afternoon pick-me-up", value: "afternoon" },
        { text: "Evening treat", value: "evening" },
        { text: "All day long", value: "allDay" }
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

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
  };

  return (
    <AnimatePresence>
      {/* Modal Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.7)",
          zIndex: 1300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
        }}
      >
        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          style={{
            maxWidth: "600px",
            width: "100%",
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            position: "relative",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              background: "none",
              border: "none",
              color: "#666",
              cursor: "pointer",
              zIndex: 1,
              padding: "8px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
              ":hover": {
                backgroundColor: "#f5f5f5"
              }
            }}
          >
            <CloseIcon />
          </button>

          {/* Quiz Content */}
          <div style={{ padding: "2rem" }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "1.5rem",
              color: "var(--primary)"
            }}>
              <CoffeeIcon style={{
                fontSize: "2rem",
                marginRight: "0.5rem"
              }} />
              <h2 style={{
                fontSize: "1.5rem",
                fontWeight: 600,
                margin: 0,
                color: "#333"
              }}>
                {result ? "Your Perfect Match" : "Coffee Quiz"}
              </h2>
            </div>

            {!result ? (
              <>
                <div style={{
                  width: "100%",
                  height: "6px",
                  backgroundColor: "#eee",
                  borderRadius: "3px",
                  marginBottom: "2rem",
                  overflow: "hidden"
                }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${((currentQuestion + 1) / questions.length) * 100}%`
                    }}
                    transition={{ duration: 0.5 }}
                    style={{
                      height: "100%",
                      borderRadius: "3px",
                      backgroundColor: "var(--primary)"
                    }}
                  />
                </div>

                <h3 style={{
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  color: "#333",
                  marginBottom: "1.5rem"
                }}>
                  {questions[currentQuestion].question}
                </h3>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: "1rem",
                  marginBottom: "2rem"
                }}>
                  {questions[currentQuestion].options.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleAnswer(option.value)}
                      style={{
                        backgroundColor: "white",
                        color: "#333",
                        border: "2px solid var(--primary)",
                        borderRadius: "8px",
                        padding: "1rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        textAlign: "center",
                        transition: "all 0.2s ease",
                        fontSize: "1rem"
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
                <div style={{
                  backgroundColor: "var(--primary)",
                  color: "white",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  marginBottom: "2rem",
                  textAlign: "center"
                }}>
                  <h3 style={{
                    fontSize: "1.3rem",
                    fontWeight: 700,
                    margin: "0 0 0.5rem"
                  }}>
                    We Found Your Match!
                  </h3>
                  <p style={{
                    margin: 0,
                    fontSize: "1rem"
                  }}>
                    Based on your coffee personality
                  </p>
                </div>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "1.5rem",
                  marginBottom: "2rem"
                }}>
                  {result.map((drink, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -5 }}
                      style={{
                        backgroundColor: "#f9f9f9",
                        border: "1px solid #eee",
                        borderRadius: "12px",
                        padding: "1.5rem",
                        textAlign: "center",
                        cursor: "pointer"
                      }}
                      onClick={() => {
                        navigate(`/order/${drink.category.toLowerCase()}`, {
                          state: { drink }
                        });
                        onClose();
                      }}
                    >
                      <div style={{
                        width: "60px",
                        height: "60px",
                        backgroundColor: "var(--primary)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 1rem",
                        color: "white"
                      }}>
                        <CoffeeIcon style={{ fontSize: "1.75rem" }} />
                      </div>
                      <h4 style={{
                        fontWeight: 700,
                        color: "#333",
                        margin: "0.5rem 0",
                        fontSize: "1.1rem"
                      }}>
                        {drink.name}
                      </h4>
                      <p style={{
                        color: "#666",
                        margin: "0.5rem 0",
                        fontSize: "0.9rem"
                      }}>
                        {drink.description || "Delicious specialty coffee"}
                      </p>
                      <div
                        style={{
                          backgroundColor: "var(--primary)",
                          color: "white",
                          border: "none",
                          borderRadius: "999px",
                          padding: "0.5rem 1.25rem",
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          marginTop: "1rem",
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
                    backgroundColor: "white",
                    color: "var(--primary)",
                    border: "2px solid var(--primary)",
                    borderRadius: "8px",
                    padding: "0.75rem 1.5rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "block",
                    margin: "0 auto",
                    width: "100%",
                    maxWidth: "200px",
                    fontSize: "1rem"
                  }}
                >
                  Take Quiz Again
                </motion.button>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default HowItWorksSteps;