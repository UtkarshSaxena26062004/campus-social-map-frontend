import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import PostCard from "../components/PostCard";
import FilterBar from "../components/FilterBar";
import { io } from "socket.io-client";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [type, setType] = useState("");
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (type) params.type = type;
      if (search) params.search = search;
      if (selectedTag) params.tag = selectedTag;

      const res = await api.get("/posts", { params });
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filters change hone par reload
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchPosts();
    }, 400);
    return () => clearTimeout(delayDebounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, search, selectedTag]);

  const uniqueTags = [...new Set(posts.flatMap((p) => p.tags || []))];

  // 🔴 Realtime: Socket.io
  useEffect(() => {
    // Backend URL
    const socket = io("http://localhost:5000", {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("postCreated", (data) => {
      console.log("Realtime: New post created", data);
      // Sirf list fresh kar do
      fetchPosts();
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // sirf 1 baar

  return (
    <div style={{ marginTop: "1.5rem" }}>
      <h2 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "0.75rem" }}>
        Campus Posts
      </h2>

      <FilterBar
        type={type}
        setType={setType}
        search={search}
        setSearch={setSearch}
      />

      {uniqueTags.length > 0 && (
        <div
          style={{
            marginBottom: "1rem",
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
          }}
        >
          <span
            onClick={() => setSelectedTag("")}
            style={{
              padding: "0.25rem 0.75rem",
              borderRadius: "999px",
              fontSize: "0.8rem",
              cursor: "pointer",
              backgroundColor: selectedTag === "" ? "#111827" : "#e5e7eb",
              color: selectedTag === "" ? "white" : "#374151",
            }}
          >
            All tags
          </span>
          {uniqueTags.map((tag) => (
            <span
              key={tag}
              onClick={() =>
                setSelectedTag(tag === selectedTag ? "" : tag)
              }
              style={{
                padding: "0.25rem 0.75rem",
                borderRadius: "999px",
                fontSize: "0.8rem",
                cursor: "pointer",
                backgroundColor:
                  tag === selectedTag ? "#2563eb" : "#e5e7eb",
                color: tag === selectedTag ? "white" : "#374151",
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {loading ? (
        <p style={{ fontSize: "0.9rem" }}>Loading...</p>
      ) : posts.length === 0 ? (
        <p style={{ fontSize: "0.9rem" }}>
          No posts yet. Be the first to create one!
        </p>
      ) : (
        posts.map((post) => <PostCard key={post._id} post={post} />)
      )}
    </div>
  );
}
