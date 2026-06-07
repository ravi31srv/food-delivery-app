"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { joinOrderRoom, getSocket } from "@/lib/socket";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const STATUS_STEPS = ["Order Received", "Preparing", "Out for Delivery", "Delivered"];
const STEP_ICONS = ["📋", "👨‍🍳", "🛵", "✅"];
const STEP_DESCRIPTIONS = [
  "We've received your order and are confirming it.",
  "Our chefs are preparing your food fresh.",
  "Your order is on the way to your address.",
  "Enjoy your meal! Order delivered successfully.",
];

function getStepIndex(status: string) {
  const map: Record<string, number> = {
    "Order Received": 0, "order_received": 0, "pending": 0,
    "Preparing": 1, "preparing": 1,
    "Out for Delivery": 2, "out_for_delivery": 2, "out for delivery": 2,
    "Delivered": 3, "delivered": 3,
  };
  return map[status] ?? 0;
}

export default function OrderStatusPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    fetch(`${BASE_URL}/orders/${orderId}`)
      .then((res) => res.json())
      .then((json) => { setOrder(json.result || json.data || json); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });

    // Initialize socket and join order room
    joinOrderRoom(String(orderId));
    const socket = getSocket();
    
    const handleOrderUpdate = (data: any) => {
      console.log("Order update received:", data);
      setOrder((prevOrder: any) => ({
        ...prevOrder,
        status: data.status || prevOrder.status,
      }));
    };

    if (socket) {
      socket.on("order-update", handleOrderUpdate);
    }

    return () => {
      if (socket) {
        socket.off("order-update", handleOrderUpdate);
      }
    };
  }, [orderId]);

  const currentStep = order ? getStepIndex(order.status) : 0;

  const pageStyle: React.CSSProperties = { minHeight: "100vh", background: "#f9f7f4", fontFamily: "'Segoe UI', sans-serif", paddingBottom: "4rem" };
  const cardStyle: React.CSSProperties = { background: "#fff", borderRadius: 16, border: "1px solid #f0f0f0", padding: "1.5rem", marginBottom: "1.25rem" };

  if (loading) {
    return (
      <div style={{ ...pageStyle, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem", color: "#6b7280" }}>
        <div style={{ width: 36, height: 36, border: "3px solid #f0f0f0", borderTopColor: "#e55b2d", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <p>Loading your order...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={{ ...pageStyle, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
        <p style={{ color: "#6b7280" }}>😕 Could not find order.</p>
        <Link href="/items" style={{ background: "#e55b2d", color: "#fff", textDecoration: "none", padding: "10px 24px", borderRadius: 10, fontWeight: 600 }}>
          Go back to Menu
        </Link>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      {/* Header */}
      <header style={{ background: "#fff", borderBottom: "1px solid #ebebeb", padding: "0 1.5rem", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 700, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0" }}>
          <Link href="/items" style={{ textDecoration: "none", color: "#6b7280", fontSize: 14, fontWeight: 500 }}>← Menu</Link>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: "#e55b2d" }}>🍽️ FoodDash</h1>
          <span />
        </div>
      </header>

      <div style={{ maxWidth: 700, margin: "2rem auto", padding: "0 1.5rem" }}>
        {/* Banner */}
        <div style={{ background: "#fff", border: "1px solid #bbf7d0", borderRadius: 16, padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
          <span style={{ fontSize: 36 }}>🎉</span>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 4px", color: "#111" }}>Order Placed Successfully!</h2>
            <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
              Order ID: <code style={{ background: "#f3f4f6", padding: "2px 6px", borderRadius: 4, fontSize: 12 }}>#{String(orderId).slice(-8).toUpperCase()}</code>
            </p>
          </div>
        </div>

        {/* Stepper */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 1.25rem", color: "#111" }}>Order Status</h3>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {STATUS_STEPS.map((step, i) => {
              const isDone = i < currentStep;
              const isActive = i === currentStep;
              return (
                <div key={step} style={{ display: "flex", gap: 16 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: 18, fontWeight: 700, flexShrink: 0,
                      background: isDone ? "#dcfce7" : isActive ? "#fff5f0" : "#f3f4f6",
                      color: isDone ? "#15803d" : isActive ? "#e55b2d" : "#9ca3af",
                      border: isActive ? "2px solid #e55b2d" : "none",
                    }}>
                      {isDone ? "✓" : STEP_ICONS[i]}
                    </div>
                    {i < STATUS_STEPS.length - 1 && (
                      <div style={{ width: 2, flex: 1, minHeight: 24, background: isDone ? "#86efac" : "#e5e7eb", margin: "4px 0", borderRadius: 2 }} />
                    )}
                  </div>
                  <div style={{ padding: "8px 0 20px" }}>
                    <p style={{ fontSize: 14, fontWeight: 600, margin: "0 0 4px", color: isDone ? "#15803d" : isActive ? "#e55b2d" : "#9ca3af" }}>
                      {step}
                    </p>
                    {isActive && <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{STEP_DESCRIPTIONS[i]}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery Details */}
        {order.customerName && (
          <div style={cardStyle}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 1.25rem", color: "#111" }}>Delivery Details</h3>
            {[
              { icon: "👤", label: "Name", value: order.customerName },
              { icon: "📍", label: "Address", value: order.customerAddress },
              { icon: "📞", label: "Phone", value: order.customerPhone },
            ].map(({ icon, label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f5f5f5", fontSize: 14 }}>
                <span style={{ color: "#6b7280" }}>{icon} {label}</span>
                <span style={{ fontWeight: 500, color: "#111" }}>{value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Order Items */}
        {order.items && (
          <div style={cardStyle}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 1.25rem", color: "#111" }}>Items Ordered</h3>
            {order.items.map((entry: any, i: number) => (
              <div key={entry._id || i} style={{ display: "flex", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f5f5f5", fontSize: 14, gap: 8 }}>
                <span style={{ flex: 1, color: "#111", fontWeight: 500 }}>Item {i + 1}</span>
                <span style={{ color: "#9ca3af" }}>× {entry.quantity}</span>
                <span style={{ fontWeight: 600, color: "#374151", minWidth: 64, textAlign: "right" }}>₹{(entry.unitPrice * entry.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0 0", marginTop: 8, borderTop: "1px solid #e5e7eb", fontSize: 15, fontWeight: 700 }}>
              <span>Total Paid</span>
              <span style={{ color: "#e55b2d" }}>₹{order.totalAmount?.toFixed(2)}</span>
            </div>
          </div>
        )}

        <Link href="/items" style={{ display: "block", textAlign: "center", background: "#e55b2d", color: "#fff", textDecoration: "none", padding: 14, borderRadius: 12, fontSize: 16, fontWeight: 700 }}>
          Order Again
        </Link>
      </div>
    </div>
  );
}