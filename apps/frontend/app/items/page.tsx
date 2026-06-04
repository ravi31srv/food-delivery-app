"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { MenuItem } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const { addToCart, totalItems, totalPrice } = useCartStore();

  useEffect(() => {
    fetch(`${BASE_URL}/menu-items`)
      .then((res) => res.json())
      .then((json) => {
        setItems(json.data);
        setLoading(false);
      });
  }, []);

  const filtered = items.filter(
    (item) =>
      item.isAvailable &&
      item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (item: MenuItem) => {
    addToCart(item);
    setToast(`${item.name} added!`);
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f9f7f4", fontFamily: "'Segoe UI', sans-serif", paddingBottom: "4rem" }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          background: "#1a1a1a", color: "#fff", padding: "10px 20px",
          borderRadius: 999, fontSize: 14, zIndex: 999, whiteSpace: "nowrap"
        }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <header style={{ background: "#fff", borderBottom: "1px solid #ebebeb", padding: "0 1.5rem", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0" }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: "#e55b2d" }}>🍽️ FoodDash</h1>
            <p style={{ fontSize: 13, color: "#9ca3af", margin: "2px 0 0" }}>Fresh picks, fast delivery</p>
          </div>

          {/* Right side icons */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

            {/* Orders icon */}
            <Link href="/orders" style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "#f3f4f6", border: "1.5px solid #e5e7eb",
              borderRadius: 999, padding: "8px 16px", textDecoration: "none",
              cursor: "pointer", transition: "background 0.2s"
            }}>
              <span style={{ fontSize: 16 }}>📋</span>
              <span style={{ fontWeight: 600, fontSize: 14, color: "#374151" }}>Orders</span>
            </Link>

            {/* Cart icon */}
            <Link href="/cart" style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "#fff5f0", border: "1.5px solid #f3c4a8",
              borderRadius: 999, padding: "8px 18px", textDecoration: "none",
              cursor: "pointer"
            }}>
              <span style={{ fontSize: 18 }}>🛒</span>
              {totalItems() > 0 && (
                <span style={{ background: "#e55b2d", color: "#fff", fontSize: 12, fontWeight: 700, borderRadius: 999, padding: "1px 7px" }}>
                  {totalItems()}
                </span>
              )}
              <span style={{ fontWeight: 600, fontSize: 14, color: "#e55b2d" }}>
                {totalItems() === 0 ? "Cart" : `₹${totalPrice().toFixed(2)}`}
              </span>
            </Link>

          </div>
        </div>
      </header>

      {/* Search */}
      <div style={{ maxWidth: 1100, margin: "1.5rem auto", padding: "0 1.5rem", position: "relative" }}>
        <span style={{ position: "absolute", left: 30, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>🔍</span>
        <input
          type="text"
          placeholder="Search menu items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%", padding: "12px 44px", border: "1.5px solid #e5e7eb",
            borderRadius: 12, fontSize: 15, background: "#fff", outline: "none",
            boxSizing: "border-box"
          }}
        />
        {search && (
          <button onClick={() => setSearch("")} style={{
            position: "absolute", right: 28, top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 14
          }}>✕</button>
        )}
      </div>

      {/* Result count */}
      {!loading && (
        <p style={{ maxWidth: 1100, margin: "0 auto 1rem", padding: "0 1.5rem", fontSize: 13, color: "#9ca3af" }}>
          {filtered.length} item{filtered.length !== 1 ? "s" : ""} available
        </p>
      )}

      {/* Skeleton loading */}
      {loading && (
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem" }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} style={{ height: 320, borderRadius: 16, background: "#efefef" }} />
          ))}
        </div>
      )}

      {/* Grid */}
      {!loading && (
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem" }}>
          {filtered.map((item) => (
            <div key={item._id} style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid #f0f0f0" }}>
              <div style={{ position: "relative", height: 180, background: "#f3f4f6", overflow: "hidden" }}>
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/400x220/f3f4f6/9ca3af?text=No+Image";
                  }}
                />
                <span style={{
                  position: "absolute", top: 10, left: 10,
                  background: "#dcfce7", color: "#15803d",
                  fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999
                }}>✓ Available</span>
              </div>
              <div style={{ padding: "14px 16px 16px" }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 6px", color: "#111" }}>{item.name}</h2>
                <p style={{
                  fontSize: 13, color: "#6b7280", lineHeight: 1.5, margin: "0 0 14px",
                  display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
                }}>{item.description}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: "#e55b2d" }}>₹{item.price.toFixed(2)}</span>
                  <button
                    onClick={() => handleAdd(item)}
                    style={{
                      background: "#e55b2d", color: "#fff", border: "none",
                      padding: "8px 16px", borderRadius: 8, fontSize: 13,
                      fontWeight: 600, cursor: "pointer"
                    }}
                  >
                    + Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "4rem 1rem", color: "#9ca3af", fontSize: 16 }}>
              😕 No items match "{search}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}