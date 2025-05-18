import React from "react";
import { motion } from "framer-motion";
import { useMediaQuery } from "@mui/material";
import { Star, Favorite, LocalCafe, EmojiEmotions } from "@mui/icons-material";

function SocialProof() {
  const isMobile = useMediaQuery("(max-width:600px)");
  const stats = [
    { value: "10K+", label: "Happy Sippers" },
    { value: "4.9", label: "Average Rating" },
    { value: "98%", label: "Would Recommend" }
  ];

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        maxWidth: "1000px",
        margin: isMobile ? "2rem 1rem" : "4rem auto",
        padding: 0,
        textAlign: "center",
        position: "relative"
      }}
    >
      {/* Floating coffee beans decoration */}
      <motion.div
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 5, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: "absolute",
          left: "5%",
          top: "-20px",
          opacity: 0.7
        }}
      >
        <LocalCafe style={{ 
          color: "var(--primary)", 
          fontSize: "2rem",
          transform: "rotate(20deg)"
        }} />
      </motion.div>

      <motion.div
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        style={{
          backgroundColor: "var(--card)",
          borderRadius: "24px",
          padding: isMobile ? "2rem 1.5rem" : "3rem 2rem",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          border: "1px solid var(--component-border)",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Pulse effect behind title */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "100%",
            background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
            zIndex: 0
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ 
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(238, 92, 1, 0.1)",
            padding: "0.5rem 1rem",
            borderRadius: "999px",
            marginBottom: "1.5rem"
          }}>
            <Favorite style={{ color: "#e53961", fontSize: "1.2rem" }} />
            <span style={{ 
              fontWeight: 600,
              color: "var(--primary)",
              fontSize: "0.9rem"
            }}>
              COMMUNITY FAVORITE
            </span>
          </div>

          <h2 style={{
            fontSize: isMobile ? "1.8rem" : "2.5rem",
            fontWeight: 700,
            color: "var(--heading-color)",
            marginBottom: "1rem",
            lineHeight: 1.2
          }}>
            Join <span style={{ color: "var(--primary)" }}>10,000+</span> Happy Coffee Lovers
          </h2>

          <p style={{
            fontSize: isMobile ? "1rem" : "1.1rem",
            color: "var(--body-text)",
            maxWidth: "700px",
            margin: "0 auto 2rem",
            lineHeight: 1.6
          }}>
            Don't just take our word for it - hear why our community keeps coming back for that perfect cup
          </p>

          {/* Stats row */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: isMobile ? "1rem" : "2rem",
            flexWrap: "wrap",
            marginBottom: "3rem"
          }}>
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--component-border)",
                  borderRadius: "16px",
                  padding: "1.5rem 1rem",
                  minWidth: "120px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                }}
              >
                <p style={{
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: "var(--primary)",
                  margin: "0 0 0.25rem",
                  lineHeight: 1
                }}>
                  {stat.value}
                </p>
                <p style={{
                  fontSize: "0.9rem",
                  color: "var(--body-text)",
                  margin: 0
                }}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Testimonials grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: "1.5rem",
            marginBottom: "2rem"
          }}>
            {[
              {
                quote: "I've tried every coffee shop in town - nothing compares to these flavors!",
                author: "Jess M.",
                role: "Daily Regular",
                emoji: "☕"
              },
              {
                quote: "The baristas remember my order before I even walk in. That's service!",
                author: "Alex T.",
                role: "Mobile Order Pro",
                emoji: "💫"
              },
              {
                quote: "My productivity doubled since discovering their cold brew. No joke.",
                author: "Sam R.",
                role: "Remote Worker",
                emoji: "⚡"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -8 }}
                style={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--component-border)",
                  borderRadius: "20px",
                  padding: "2rem 1.5rem",
                  textAlign: "center",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                <div style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  opacity: 0.1,
                  fontSize: "3rem"
                }}>
                  {testimonial.emoji}
                </div>
                <div style={{
                  fontSize: "3rem",
                  marginBottom: "0.5rem",
                  lineHeight: 1
                }}>
                  "
                </div>
                <p style={{
                  fontStyle: "italic",
                  fontSize: "1rem",
                  color: "var(--text)",
                  marginBottom: "1.5rem",
                  position: "relative",
                  zIndex: 1
                }}>
                  {testimonial.quote}
                </p>
                <div style={{
                  width: "50px",
                  height: "50px",
                  backgroundColor: "var(--primary)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "1.2rem"
                }}>
                  {testimonial.author.charAt(0)}
                </div>
                <p style={{
                  fontWeight: 700,
                  color: "var(--heading-color)",
                  margin: "0.25rem 0 0",
                  fontSize: "1.1rem"
                }}>
                  {testimonial.author}
                </p>
                <p style={{
                  fontSize: "0.85rem",
                  color: "var(--body-text)",
                  margin: "0.25rem 0 0"
                }}>
                  {testimonial.role}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Trust badges */}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "1rem",
            alignItems: "center",
            opacity: 0.8
          }}>
            <EmojiEmotions style={{ color: "var(--primary)", fontSize: "1.5rem" }} />
            <span style={{ fontSize: "0.9rem" }}>Verified Reviews</span>
            <span style={{ fontSize: "2rem", lineHeight: 1 }}>·</span>
            <div style={{ display: "flex" }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} style={{ color: "#FFD700", fontSize: "1.2rem" }} />
              ))}
            </div>
            <span style={{ fontSize: "2rem", lineHeight: 1 }}>·</span>
            <span style={{ fontSize: "0.9rem" }}>Since 2022</span>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}

export default SocialProof;