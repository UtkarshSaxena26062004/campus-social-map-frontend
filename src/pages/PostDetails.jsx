import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  const user = localStorage.getItem("csm_user")
    ? JSON.parse(localStorage.getItem("csm_user"))
    : null;

  const fetchPost = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/posts/${id}`);
      setPost(res.data);
    } catch (err) {
      console.error("Error fetching post details", err);
      setError("Unable to load post");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return <p style={{ marginTop: "1rem" }}>Loading...</p>;
  }

  if (!post) {
    return (
      <div style={{ marginTop: "1rem" }}>
        <p>Post not found.</p>
        <button
          onClick={() => navigate(-1)}
          style={{
            marginTop: "0.5rem",
            padding: "0.4rem 0.8rem",
            borderRadius: "0.4rem",
            border: "none",
            cursor: "pointer",
            backgroundColor: "#2563eb",
            color: "white",
            fontSize: "0.85rem",
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  const dateStr = post.date ? new Date(post.date).toLocaleDateString() : null;
  const isJoined =
    user && post.participants?.some((p) => p._id === user.id || p.id === user.id);

  const handleJoinLeave = async () => {
    if (!user) return;
    setJoining(true);
    setError("");
    try {
      if (isJoined) {
        await api.post(`/posts/${post._id}/leave`);
      } else {
        await api.post(`/posts/${post._id}/join`);
      }
      await fetchPost(); // refresh data
    } catch (err) {
      console.error("Join/Leave error", err);
      setError("Action failed, please try again.");
    } finally {
      setJoining(false);
    }
  };

  return (
    <div
      style={{
        marginTop: "1.5rem",
        backgroundColor: "white",
        padding: "1.25rem",
        borderRadius: "0.75rem",
        boxShadow: "0 1px 5px rgba(0,0,0,0.08)",
        maxWidth: "640px",
      }}
    >
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: "0.75rem",
          padding: "0.3rem 0.7rem",
          borderRadius: "0.4rem",
          border: "1px solid #d1d5db",
          backgroundColor: "white",
          cursor: "pointer",
          fontSize: "0.8rem",
        }}
      >
        ← Back
      </button>

      <h2 style={{ fontSize: "1.3rem", fontWeight: 600, marginBottom: "0.5rem" }}>
        {post.title}
      </h2>
        {post.imageUrl && (
  <div
    style={{
      marginTop: "0.5rem",
      marginBottom: "0.75rem",
      borderRadius: "0.75rem",
      overflow: "hidden",
    }}
  >
    <img
      src={post.imageUrl}
      alt={post.title}
      style={{ width: "100%", maxHeight: "360px", objectFit: "cover" }}
    />
  </div>
)}

      <p style={{ fontSize: "0.9rem", color: "#4b5563", marginBottom: "0.75rem" }}>
        {post.description}
      </p>

      <p style={{ fontSize: "0.9rem", marginBottom: "0.25rem" }}>
        <strong>Type:</strong> {post.type.replace("_", " ")}
      </p>
      <p style={{ fontSize: "0.9rem", marginBottom: "0.25rem" }}>
        <strong>Location:</strong> {post.locationText}
      </p>
      {dateStr && (
        <p style={{ fontSize: "0.9rem", marginBottom: "0.25rem" }}>
          <strong>When:</strong> {dateStr} {post.time && `• ${post.time}`}
        </p>
      )}
      <p style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>
        <strong>Created by:</strong> {post.createdBy?.name || "Unknown"}{" "}
        {post.createdBy?.branch && `(${post.createdBy.branch})`}
      </p>

      <p style={{ fontSize: "0.9rem", marginBottom: "0.75rem" }}>
        <strong>Participants:</strong> {post.participants?.length || 0}
      </p>

      {error && (
        <p style={{ color: "red", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
          {error}
        </p>
      )}

      <button
        onClick={handleJoinLeave}
        disabled={joining}
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "0.5rem",
          border: "none",
          cursor: "pointer",
          backgroundColor: isJoined ? "#ef4444" : "#22c55e",
          color: "white",
          fontWeight: 500,
          fontSize: "0.9rem",
        }}
      >
        {joining ? "Please wait..." : isJoined ? "Leave" : "Join"}
      </button>

      {post.participants && post.participants.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <p style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.25rem" }}>
            People who joined:
          </p>
          <ul style={{ fontSize: "0.85rem", color: "#4b5563" }}>
            {post.participants.map((p) => (
              <li key={p._id || p.id}>• {p.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
