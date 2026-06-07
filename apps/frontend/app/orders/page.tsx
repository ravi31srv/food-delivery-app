"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSocket } from "@/lib/socket";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  "Order Received": { bg: "#fff5f0", color: "#e55b2d" },
  "Preparing":      { bg: "#fefce8", color: "#ca8a04" },
  "Out for Delivery": { bg: "#eff6ff", color: "#2563eb" },
  "Delivered":      { bg: "#f0fdf4", color: "#16a34a" },
};

export default function OrdersListPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/orders`)
      .then((res) => res.json())
      .then((json) => {
        setOrders(json.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Listen for real-time order updates
    const socket = getSocket();
    
    const handleOrderUpdate = (data: any) => {
      console.log("Order update received in list:", data);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === data.id ? { ...order, status: data.status } : order
        )
      );
    };

    if (socket) {
      socket.on("order-update", handleOrderUpdate);
    }

    return () => {
      if (socket) {
        socket.off("order-update", handleOrderUpdate);
      }
    };
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#f9f7f4", fontFamily: "'Segoe UI', sans-serif", paddingBottom: "4rem" }}>

      {/* Header */}
      <header style={{ background: "#fff", borderBottom: "1px solid #ebebeb", padding: "0 1.5rem", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0" }}>
          <Link href="/items" style={{ textDecoration: "none", color: "#6b7280", fontSize: 14, fontWeight: 500 }}>← Menu</Link>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: "#e55b2d" }}>🍽️ FoodDash</h1>
          <span />
        </div>
      </header>

      <div style={{ maxWidth: 800, margin: "2rem auto", padding: "0 1.5rem" }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 1.5rem", color: "#111" }}>My Orders</h2>

        {/* Loading skeletons */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ height: 100, borderRadius: 16, background: "#efefef" }} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && orders.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
            <p style={{ fontSize: 48, margin: "0 0 1rem" }}>📋</p>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111", margin: "0 0 8px" }}>No orders yet</h3>
            <p style={{ color: "#6b7280", margin: "0 0 1.5rem" }}>Place your first order from the menu!</p>
            <Link href="/items" style={{ display: "inline-block", background: "#e55b2d", color: "#fff", textDecoration: "none", padding: "10px 24px", borderRadius: 10, fontWeight: 600 }}>
              Browse Menu
            </Link>
          </div>
        )}

        {/* Orders list */}
        {!loading && orders.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {orders.map((order) => {
              const status = order.status || "Order Received";
              const statusStyle = STATUS_COLORS[status] || STATUS_COLORS["Order Received"];
              return (
                <Link
                  key={order._id}
                  href={`/order/${order._id}`}
                  style={{ textDecoration: "none" }}
                >
                  <div style={{
                    background: "#fff", borderRadius: 16, border: "1px solid #f0f0f0",
                    padding: "1.25rem 1.5rem", display: "flex", alignItems: "center",
                    justifyContent: "space-between", gap: 16,
                    transition: "box-shadow 0.2s", cursor: "pointer"
                  }}
                    onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)")}
                    onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
                  >
                    {/* Left: order info */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>
                          Order #{order._id.slice(-8).toUpperCase()}
                        </span>
                        <span style={{
                          fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999,
                          background: statusStyle.bg, color: statusStyle.color
                        }}>
                          {status}
                        </span>
                      </div>
                      <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 4px" }}>
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                        {" · "}
                        {order.items.map((item: any, i: number) => (
                          <span key={i}>
                            {i > 0 ? ", " : ""}qty {item.quantity} × ₹{item.unitPrice}
                          </span>
                        ))}
                      </p>
                    </div>

                    {/* Right: total + arrow */}
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p style={{ fontSize: 18, fontWeight: 700, color: "#e55b2d", margin: "0 0 4px" }}>
                        ₹{order.totalAmount.toFixed(2)}
                      </p>
                      <span style={{ fontSize: 13, color: "#9ca3af" }}>View →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}