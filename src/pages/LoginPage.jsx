import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f5f5f5",
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 12,
        border: "0.5px solid #e0e0e0",
        padding: "2rem 2.5rem",
        width: "100%",
        maxWidth: 380,
      }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: 8 }}>İş Takip</h1>
        <p style={{ fontSize: 14, color: "#888", marginBottom: 24 }}>Hesabınıza giriş yapın</p>

        {error && (
          <div style={{
            background: "#fff0f0",
            border: "0.5px solid #f5c2c2",
            borderRadius: 8,
            padding: "10px 14px",
            fontSize: 13,
            color: "#c0392b",
            marginBottom: 16,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 13, color: "#555", display: "block", marginBottom: 6 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="ornek@email.com"
              style={{ width: "100%", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, color: "#555", display: "block", marginBottom: 6 }}>
              Şifre
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{ width: "100%", boxSizing: "border-box" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: "10px 0", fontSize: 14 }}
          >
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
      </div>
    </div>
  );
}
