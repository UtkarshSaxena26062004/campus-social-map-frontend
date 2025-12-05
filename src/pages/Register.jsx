import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosInstance";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    branch: "",
    year: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/register", form);
      localStorage.setItem("csm_token", res.data.token);
      localStorage.setItem("csm_user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={{ marginTop: "2rem", maxWidth: "400px", marginInline: "auto" }}>
      <h2 style={{ marginBottom: "1rem", fontSize: "1.2rem", fontWeight: 600 }}>Register</h2>
      {error && (
        <p style={{ color: "red", fontSize: "0.85rem", marginBottom: "0.5rem" }}>{error}</p>
      )}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={onChange}
          required
          style={{ padding: "0.5rem", borderRadius: "0.4rem", border: "1px solid #d1d5db" }}
        />
        <input
          type="email"
          name="email"
          placeholder="College Email"
          value={form.email}
          onChange={onChange}
          required
          style={{ padding: "0.5rem", borderRadius: "0.4rem", border: "1px solid #d1d5db" }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={onChange}
          required
          style={{ padding: "0.5rem", borderRadius: "0.4rem", border: "1px solid #d1d5db" }}
        />
        <input
          name="branch"
          placeholder="Branch (e.g., CSE)"
          value={form.branch}
          onChange={onChange}
          style={{ padding: "0.5rem", borderRadius: "0.4rem", border: "1px solid #d1d5db" }}
        />
        <input
          name="year"
          placeholder="Year (e.g., 3rd year)"
          value={form.year}
          onChange={onChange}
          style={{ padding: "0.5rem", borderRadius: "0.4rem", border: "1px solid #d1d5db" }}
        />
        <button
          type="submit"
          style={{
            padding: "0.5rem",
            borderRadius: "0.4rem",
            border: "none",
            cursor: "pointer",
            backgroundColor: "#16a34a",
            color: "white",
            fontWeight: 500
          }}
        >
          Register
        </button>
      </form>
      <p style={{ fontSize: "0.85rem", marginTop: "0.75rem" }}>
        Already have an account? <Link to="/login" style={{ color: "#2563eb" }}>Login</Link>
      </p>
    </div>
  );
}
