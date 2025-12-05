import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosInstance";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("csm_token", res.data.token);
      localStorage.setItem("csm_user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ marginTop: "2rem", maxWidth: "400px", marginInline: "auto" }}>
      <h2 style={{ marginBottom: "1rem", fontSize: "1.2rem", fontWeight: 600 }}>Login</h2>
      {error && (
        <p style={{ color: "red", fontSize: "0.85rem", marginBottom: "0.5rem" }}>{error}</p>
      )}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <input
          type="email"
          placeholder="College Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "0.5rem", borderRadius: "0.4rem", border: "1px solid #d1d5db" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: "0.5rem", borderRadius: "0.4rem", border: "1px solid #d1d5db" }}
        />
        <button
          type="submit"
          style={{
            padding: "0.5rem",
            borderRadius: "0.4rem",
            border: "none",
            cursor: "pointer",
            backgroundColor: "#2563eb",
            color: "white",
            fontWeight: 500
          }}
        >
          Login
        </button>
      </form>
      <p style={{ fontSize: "0.85rem", marginTop: "0.75rem" }}>
        Don't have an account? <Link to="/register" style={{ color: "#2563eb" }}>Register</Link>
      </p>
    </div>
  );
}
