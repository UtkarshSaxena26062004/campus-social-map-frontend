import React from "react";

export default function FilterBar({ type, setType, search, setSearch }) {
  return (
    <div
      style={{
        marginBottom: "1rem",
        display: "flex",
        gap: "0.5rem",
        flexWrap: "wrap",
        alignItems: "center"
      }}
    >
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        style={{
          padding: "0.35rem 0.5rem",
          borderRadius: "0.4rem",
          border: "1px solid #d1d5db",
          fontSize: "0.85rem"
        }}
      >
        <option value="">All Types</option>
        <option value="EVENT">Events</option>
        <option value="STUDY_GROUP">Study Groups</option>
        <option value="LOST_FOUND">Lost &amp; Found</option>
      </select>
      <input
        type="text"
        placeholder="Search by title, description, location..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          flex: 1,
          minWidth: "200px",
          padding: "0.35rem 0.5rem",
          borderRadius: "0.4rem",
          border: "1px solid #d1d5db",
          fontSize: "0.85rem"
        }}
      />
    </div>
  );
}
