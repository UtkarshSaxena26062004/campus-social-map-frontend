import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("csm_token");

  const handleLogout = () => {
    localStorage.removeItem("csm_token");
    localStorage.removeItem("csm_user");
    navigate("/login");
  };

  const user = localStorage.getItem("csm_user")
    ? JSON.parse(localStorage.getItem("csm_user"))
    : null;

  return (
    <nav style={{ backgroundColor: "#111827", color: "white", padding: "0.75rem 1.5rem" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link to="/" style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
          Campus Social Map
        </Link>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          {token && (
            <Link to="/create" style={{ fontSize: "0.95rem" }}>
              + New Post
            </Link>
          )}
          {user && <span style={{ fontSize: "0.9rem" }}>Hi, {user.name}</span>}
          {token ? (
            <button
              onClick={handleLogout}
              style={{
                border: "none",
                padding: "0.35rem 0.75rem",
                borderRadius: "4px",
                cursor: "pointer",
                backgroundColor: "#f97316",
                color: "white",
                fontSize: "0.85rem"
              }}
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" style={{ fontSize: "0.9rem" }}>Login</Link>
              <Link to="/register" style={{ fontSize: "0.9rem" }}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
