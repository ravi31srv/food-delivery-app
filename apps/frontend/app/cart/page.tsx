"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CartPage() {
  const router = useRouter();
  const { cart, updateQty, removeFromCart, clearCart, totalPrice } = useCartStore();

  const [details, setDetails] = useState({ name: "", address: "", phone: "" });
  const [errors, setErrors] = useState<{ name?: string; address?: string; phone?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if (!details.name.trim()) e.name = "Name is required";
    if (!details.address.trim()) e.address = "Address is required";
    if (!details.phone.trim()) e.phone = "Phone is required";
    else if (!/^[6-9]\d{9}$/.test(details.phone.trim())) e.phone = "Enter a valid Indian mobile number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCheckout = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setServerError(null);
    try {
      const payload = {
        customerName: details.name,
        customerAddress: details.address,
        customerPhone: details.phone,
        items: cart.map((c) => ({ itemId: c.item._id, quantity: c.qty })),
      };
      const res = await fetch(`${BASE_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok) {
        // Handle validation errors returned from backend
        if (json && Array.isArray(json.errors)) {
          const fieldErrors: typeof errors = {};
          for (const e of json.errors) {
            // backend uses fields like customerName/customerAddress/customerPhone
            if (e.field && e.messages) {
              if (e.field.includes('customerName')) fieldErrors.name = e.messages;
              else if (e.field.includes('customerAddress')) fieldErrors.address = e.messages;
              else if (e.field.includes('customerPhone')) fieldErrors.phone = e.messages;
              else setServerError((prev) => prev ? prev + ' | ' + e.messages : e.messages);
            }
          }
          setErrors((prev) => ({ ...prev, ...fieldErrors }));
        } else {
          setServerError(json?.message || 'Order failed. Please try again.');
        }
        setSubmitting(false);
        return;
      }

      const orderId = json.data?._id || json._id;
      clearCart();
      router.push(`/orders/`);
    } catch (err) {
      console.error("Checkout failed", err);
      setServerError('Unable to place order. Please try again.');
      setSubmitting(false);
    }
  };

  const s = {
    page: { minHeight: "100vh", background: "#f9f7f4", fontFamily: "'Segoe UI', sans-serif", paddingBottom: "4rem" } as React.CSSProperties,
    header: { background: "#fff", borderBottom: "1px solid #ebebeb", padding: "0 1.5rem", position: "sticky" as const, top: 0, zIndex: 100 },
    headerInner: { maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0" },
    card: { background: "#fff", borderRadius: 16, border: "1px solid #f0f0f0", padding: "1.5rem", marginBottom: "1.25rem" },
    input: { width: "100%", padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box" as const, fontFamily: "inherit" },
    inputError: { width: "100%", padding: "10px 14px", border: "1.5px solid #ef4444", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box" as const, fontFamily: "inherit" },
  };

  if (cart.length === 0) {
    return (
      <div style={{ minHeight: "100vh", background: "#f9f7f4", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif" }}>
        <div style={{ textAlign: "center", background: "#fff", borderRadius: 20, padding: "3rem 2.5rem", border: "1px solid #f0f0f0" }}>
          <p style={{ fontSize: 56, margin: "0 0 1rem" }}>🛒</p>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 8px", color: "#111" }}>Your cart is empty</h2>
          <p style={{ color: "#6b7280", fontSize: 15, margin: "0 0 1.5rem" }}>Add some items from the menu first.</p>
          <Link href="/items" style={{ display: "inline-block", background: "#e55b2d", color: "#fff", textDecoration: "none", padding: "10px 24px", borderRadius: 10, fontWeight: 600, fontSize: 14 }}>
            ← Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      {/* Header */}
      <header style={s.header}>
        <div style={s.headerInner}>
          <Link href="/items" style={{ textDecoration: "none", color: "#6b7280", fontSize: 14, fontWeight: 500 }}>← Menu</Link>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: "#e55b2d" }}>🍽️ FoodDash</h1>
          <span />
        </div>
      </header>

      {/* Layout */}
      <div style={{ maxWidth: 1100, margin: "2rem auto", padding: "0 1.5rem", display: "grid", gridTemplateColumns: "1fr 380px", gap: "1.5rem", alignItems: "start" }}>

        {/* Left: Cart Items */}
        <section style={s.card}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 1.25rem", color: "#111" }}>
            Your Cart ({cart.length} item{cart.length !== 1 ? "s" : ""})
          </h2>

          {cart.map(({ item, qty }) => (
            <div key={item._id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid #f5f5f5" }}>
              <img
                src={item.imageUrl}
                alt={item.name}
                style={{ width: 64, height: 64, borderRadius: 10, objectFit: "cover", background: "#f3f4f6", flexShrink: 0 }}
                onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/80x80/f3f4f6/9ca3af?text=?"; }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 600, margin: "0 0 4px", color: "#111", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</p>
                <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>₹{item.price.toFixed(2)} each</p>
              </div>
              {/* Qty control */}
              <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
                <button onClick={() => updateQty(item._id, qty - 1)} style={{ background: "#f9f9f9", border: "none", padding: "6px 12px", cursor: "pointer", fontSize: 16 }}>−</button>
                <span style={{ padding: "6px 12px", fontSize: 14, fontWeight: 600, color: "#111", borderLeft: "1.5px solid #e5e7eb", borderRight: "1.5px solid #e5e7eb" }}>{qty}</span>
                <button onClick={() => updateQty(item._id, qty + 1)} style={{ background: "#f9f9f9", border: "none", padding: "6px 12px", cursor: "pointer", fontSize: 16 }}>+</button>
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#e55b2d", minWidth: 60, textAlign: "right" }}>₹{(item.price * qty).toFixed(2)}</span>
              <button onClick={() => removeFromCart(item._id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, opacity: 0.4, padding: 4 }}>🗑</button>
            </div>
          ))}

          <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 0 0", fontSize: 15, fontWeight: 600, color: "#374151" }}>
            <span>Total</span>
            <span style={{ color: "#e55b2d", fontSize: 18 }}>₹{totalPrice().toFixed(2)}</span>
          </div>
        </section>

        {/* Right: Delivery + Checkout */}
        <section style={s.card}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 1.25rem", color: "#111" }}>Delivery Details</h2>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Full Name</label>
            <input style={errors.name ? s.inputError : s.input} type="text" placeholder="Ravi Solanki" value={details.name} onChange={(e) => { setDetails({ ...details, name: e.target.value }); setErrors({ ...errors, name: undefined }); }} />
            {errors.name && <p style={{ fontSize: 12, color: "#ef4444", margin: "4px 0 0" }}>{errors.name}</p>}
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Delivery Address</label>
            <textarea style={{ ...s.input, resize: "vertical", minHeight: 80 }} placeholder="123, MG Road, Ahmedabad" value={details.address} onChange={(e) => { setDetails({ ...details, address: e.target.value }); setErrors({ ...errors, address: undefined }); }} />
            {errors.address && <p style={{ fontSize: 12, color: "#ef4444", margin: "4px 0 0" }}>{errors.address}</p>}
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Phone Number</label>
            <input style={errors.phone ? s.inputError : s.input} type="tel" placeholder="9876543210" maxLength={10} value={details.phone} onChange={(e) => { setDetails({ ...details, phone: e.target.value }); setErrors({ ...errors, phone: undefined }); }} />
            {errors.phone && <p style={{ fontSize: 12, color: "#ef4444", margin: "4px 0 0" }}>{errors.phone}</p>}
          </div>

          {/* Summary */}
          <div style={{ background: "#f9f7f4", borderRadius: 12, padding: "14px 16px", margin: "1.25rem 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#6b7280", padding: "4px 0" }}>
              <span>Subtotal</span><span>₹{totalPrice().toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, padding: "4px 0" }}>
              <span style={{ color: "#6b7280" }}>Delivery</span><span style={{ color: "#15803d", fontWeight: 600 }}>FREE</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 700, color: "#111", borderTop: "1px solid #e5e7eb", marginTop: 8, paddingTop: 10 }}>
              <span>Total</span><span>₹{totalPrice().toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={submitting}
            style={{
              width: "100%", background: submitting ? "#f0a080" : "#e55b2d", color: "#fff",
              border: "none", padding: 14, borderRadius: 12, fontSize: 16,
              fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer"
            }}
          >
            {submitting ? "Placing Order..." : "Place Order →"}
          </button>
          {serverError && <p style={{ color: '#ef4444', marginTop: 8, fontSize: 13 }}>{serverError}</p>}
        </section>
      </div>
    </div>
  );
}