import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";

// 👉 yahan apna Cloudinary details daal
const CLOUD_NAME = "doyljoj7v";
const UPLOAD_PRESET = "unsigned_preset";

export default function CreatePost() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "EVENT",
    locationText: "",
    date: "",
    time: "",
    tags: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file || null);
  };

  const uploadImageToCloudinary = async (file) => {
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(url, {
      method: "POST",
      body: data,
    });

    if (!res.ok) {
      throw new Error("Image upload failed");
    }

    const json = await res.json();
    return json.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setUploading(true);

    try {
      let imageUrl = "";

      // 1️⃣ Pehle image upload (agar file select hai)
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
      }

      // 2️⃣ Ab backend ko post create request
      const payload = {
        ...form,
        tags: form.tags
          ? form.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
        imageUrl,
      };

      const res = await api.post("/posts", payload);
      if (res.status === 201) {
        navigate("/");
      }
    } catch (err) {
      console.error("Create post error", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to create post"
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ marginTop: "1.5rem", maxWidth: "520px" }}>
      <h2
        style={{
          fontSize: "1.2rem",
          fontWeight: 600,
          marginBottom: "0.75rem",
        }}
      >
        Create New Post
      </h2>
      {error && (
        <p
          style={{
            color: "red",
            fontSize: "0.85rem",
            marginBottom: "0.5rem",
          }}
        >
          {error}
        </p>
      )}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={onChange}
          required
          style={{
            padding: "0.5rem",
            borderRadius: "0.4rem",
            border: "1px solid #d1d5db",
          }}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={onChange}
          required
          rows={3}
          style={{
            padding: "0.5rem",
            borderRadius: "0.4rem",
            border: "1px solid #d1d5db",
          }}
        />
        <select
          name="type"
          value={form.type}
          onChange={onChange}
          style={{
            padding: "0.5rem",
            borderRadius: "0.4rem",
            border: "1px solid #d1d5db",
          }}
        >
          <option value="EVENT">Event</option>
          <option value="STUDY_GROUP">Study Group</option>
          <option value="LOST_FOUND">Lost &amp; Found</option>
        </select>
        <input
          name="locationText"
          placeholder="Location (e.g., Block A, Seminar Hall)"
          value={form.locationText}
          onChange={onChange}
          required
          style={{
            padding: "0.5rem",
            borderRadius: "0.4rem",
            border: "1px solid #d1d5db",
          }}
        />

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={onChange}
            style={{
              flex: 1,
              padding: "0.5rem",
              borderRadius: "0.4rem",
              border: "1px solid #d1d5db",
            }}
          />
          <input
            type="time"
            name="time"
            value={form.time}
            onChange={onChange}
            style={{
              flex: 1,
              padding: "0.5rem",
              borderRadius: "0.4rem",
              border: "1px solid #d1d5db",
            }}
          />
        </div>

        {/* Image input */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.85rem",
              marginBottom: "0.25rem",
            }}
          >
            Image (optional)
          </label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {imageFile && (
            <p style={{ fontSize: "0.8rem", marginTop: "0.25rem" }}>
              Selected: {imageFile.name}
            </p>
          )}
        </div>

        <input
          name="tags"
          placeholder="Tags (comma separated, e.g., DSA, placement)"
          value={form.tags}
          onChange={onChange}
          style={{
            padding: "0.5rem",
            borderRadius: "0.4rem",
            border: "1px solid #d1d5db",
          }}
        />

        <button
          type="submit"
          disabled={uploading}
          style={{
            padding: "0.5rem",
            borderRadius: "0.4rem",
            border: "none",
            cursor: "pointer",
            backgroundColor: "#2563eb",
            color: "white",
            fontWeight: 500,
          }}
        >
          {uploading ? "Uploading..." : "Create"}
        </button>
      </form>
    </div>
  );
}
