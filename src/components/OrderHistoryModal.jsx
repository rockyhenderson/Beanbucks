import React, { useEffect, useState, useRef } from "react";
import Toast from "./Toast";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const ORDERS_PER_PAGE = 5;

const OrderHistoryModal = ({ userId, onClose }) => {
  const [orders, setOrders] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [paginated, setPaginated] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const listRef = useRef(null);

  useEffect(() => {
    fetch(
      `http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/public/get_user_order_history.php?id=${userId}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else {
          throw new Error(data.error || "Could not fetch orders.");
        }
      })
      .catch((err) => {
        console.error(err);
        setToast({
          type: "error",
          title: "Order History Error",
          message: err.message || "Failed to load your order history.",
        });
      })
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    if (listRef.current && listRef.current.scrollHeight > 550) {
      setPaginated(true);
    }
  }, [orders]);

  const paginatedOrders = paginated
    ? orders.slice((page - 1) * ORDERS_PER_PAGE, page * ORDERS_PER_PAGE)
    : orders;

  const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);

  return (
    <div className="modal-overlay">
      <div
        className="profile__logout-modal"
        style={{
          maxWidth: "min(90vw, 900px)",
          padding: "2rem",
          maxHeight: "90vh",
          overflow: "auto",
          background: "var(--card)",
          borderRadius: "1rem",
          border: "2px solid var(--component-border)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.25rem",
          }}
        >
          <h2 style={{ margin: 0 }}>Your Order History</h2>
          <IconButton onClick={onClose}>
            <CloseIcon style={{ color: "var(--text)" }} />
          </IconButton>
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
            <CircularProgress />
          </div>
        ) : orders.length === 0 ? (
          <p style={{ color: "var(--body-text)" }}>You have no past orders.</p>
        ) : (
          <>
            <div
              ref={listRef}
              className="order-list-container"
              style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
            >
              {paginatedOrders.map((order) => {
                const isExpanded = expandedOrder === order.order_id;
                return (
                  <div
                    key={order.order_id}
                    style={{
                      background: "#fffaf5",
                      padding: "1rem 1.5rem",
                      borderRadius: "0.75rem",
                      border: "1px solid var(--component-border)",
                      boxShadow: isExpanded ? "0 4px 8px rgba(0,0,0,0.1)" : "none",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {/* COLLAPSED HEADER */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        setExpandedOrder(isExpanded ? null : order.order_id)
                      }
                    >
                      <div>
                        <h3 style={{ marginBottom: "0.4rem" }}>Order #{order.order_id}</h3>
                        <p style={{ margin: 0 }}><strong>Placed:</strong> {order.order_time}</p>
                        <p style={{ margin: 0 }}><strong>Total:</strong> £{order.total_price}</p>
                      </div>
                      {isExpanded ? (
                        <ExpandLessIcon style={{ color: "var(--text)" }} />
                      ) : (
                        <ExpandMoreIcon style={{ color: "var(--text)" }} />
                      )}
                    </div>

                    {/* EXPANDED CONTENT */}
                    <div
                      style={{
                        maxHeight: isExpanded ? "1000px" : "0px",
                        overflow: "hidden",
                        transition: "max-height 0.4s ease-in-out",
                      }}
                    >
                      <Divider style={{ margin: "1rem 0" }} />
                      {order.items.map((item, i) => {
                        const filteredCustoms = item.customizations?.filter((line) => {
                          const trimmed = line.trim();
                          return (
                            trimmed &&
                            !trimmed.endsWith(":") &&
                            !trimmed.includes(": 0, 0, 0")
                          );
                        }) || [];

                        return (
                          <div
                            key={i}
                            style={{
                              marginBottom: i < order.items.length - 1 ? "1.5rem" : "0",
                            }}
                          >
                            <p style={{ fontWeight: 600 }}>
                              {item.drink_name} — {item.size} — £{item.price}
                            </p>
                            {filteredCustoms.length > 0 ? (
                              <div
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: "0.5rem",
                                  marginLeft: "0.5rem",
                                  marginTop: "0.25rem",
                                }}
                              >
                                {filteredCustoms.map((c, j) => (
                                  <span
                                    key={j}
                                    style={{
                                      backgroundColor: "#5A4A42",
                                      color: "#fff",
                                      padding: "0.35rem 0.75rem",
                                      borderRadius: "999px",
                                      fontSize: "0.85rem",
                                      fontWeight: 500,
                                      lineHeight: 1.4,
                                    }}
                                  >
                                    {c}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p
                                style={{
                                  fontSize: "0.9rem",
                                  color: "var(--body-text)",
                                  marginLeft: "1rem",
                                }}
                              >
                                No customizations
                              </p>
                            )}
                            {i < order.items.length - 1 && (
                              <Divider style={{ margin: "1rem 0" }} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {paginated && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "1rem",
                  marginTop: "2rem",
                }}
              >
                <button
                  className="btn btn--outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  ← Prev
                </button>
                <p
                  style={{
                    margin: 0,
                    alignSelf: "center",
                    color: "var(--body-text)",
                  }}
                >
                  Page {page} of {totalPages}
                </p>
                <button
                  className="btn btn--primary"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}

        {toast && (
          <div
            style={{
              position: "fixed",
              top: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 9999,
            }}
          >
            <Toast
              type={toast.type}
              title={toast.title}
              message={toast.message}
              onClose={() => setToast(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryModal;