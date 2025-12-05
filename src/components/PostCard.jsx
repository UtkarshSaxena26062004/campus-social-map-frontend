import React from "react";
import { Link } from "react-router-dom";

const typeColor = (type) => {
  switch (type) {
    case "EVENT":
      return "#2563eb";
    case "STUDY_GROUP":
      return "#16a34a";
    case "LOST_FOUND":
      return "#eab308";
    default:
      return "#6b7280";
  }
};

export default function PostCard({ post }) {
  const dateStr = post.date ? new Date(post.date).toLocaleDateString() : null;

  return (
    <Link to={`/posts/${post._id}`} style={{ textDecoration: "none" }}>
      <div
        style={{
          backgroundColor: "white",
          padding: "1rem",
          borderRadius: "0.5rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          marginBottom: "0.75rem",
          cursor: "pointer",
        }}
      >
        {post.imageUrl && (
  <div
    style={{
      marginBottom: "0.5rem",
      overflow: "hidden",
      borderRadius: "0.4rem",
      height: "200px",          // fixed height
      backgroundColor: "#f3f4f6",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <img
      src={post.imageUrl}
      alt={post.title}
      style={{
        maxWidth: "100%",
        maxHeight: "100%",
        objectFit: "contain",   // pura image dikhane ke liye
      }}
    />
  </div>
)}


        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "0.25rem",
          }}
        >
          <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>{post.title}</h3>
          <span
            style={{
              fontSize: "0.75rem",
              padding: "0.15rem 0.4rem",
              borderRadius: "999px",
              backgroundColor: typeColor(post.type),
              color: "white",
            }}
          >
            {post.type.replace("_", " ")}
          </span>
        </div>

        <p
          style={{
            fontSize: "0.9rem",
            color: "#4b5563",
            marginBottom: "0.35rem",
          }}
        >
          {post.description}
        </p>

        <p
          style={{
            fontSize: "0.8rem",
            color: "#6b7280",
            marginBottom: "0.25rem",
          }}
        >
          📍 {post.locationText}
        </p>

        {dateStr && (
          <p
            style={{
              fontSize: "0.8rem",
              color: "#6b7280",
              marginBottom: "0.25rem",
            }}
          >
            📅 {dateStr} {post.time && `• ${post.time}`}
          </p>
        )}

        <p style={{ fontSize: "0.8rem", color: "#6b7280" }}>
          👤 {post.createdBy?.name || "Unknown"} • 👥{" "}
          {post.participants?.length || 0} joined
        </p>

        {post.tags && post.tags.length > 0 && (
          <div
            style={{
              marginTop: "0.4rem",
              display: "flex",
              gap: "0.3rem",
              flexWrap: "wrap",
            }}
          >
            {post.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: "0.7rem",
                  backgroundColor: "#e5e7eb",
                  padding: "0.15rem 0.5rem",
                  borderRadius: "999px",
                  color: "#374151",
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
