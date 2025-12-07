import React from "react";
import { Link } from "react-router-dom";
import "./PostCard.css";

const typeMeta = (type) => {
  switch (type) {
    case "EVENT":
      return { label: "Event", className: "badge-event" };
    case "STUDY_GROUP":
      return { label: "Study Group", className: "badge-study" };
    case "LOST_FOUND":
      return { label: "Lost & Found", className: "badge-lost" };
    default:
      return { label: "Other", className: "badge-default" };
  }
};

export default function PostCard({ post }) {
  const dateStr = post.date ? new Date(post.date).toLocaleDateString() : null;
  const { label, className } = typeMeta(post.type);

  return (
    <Link to={`/posts/${post._id}`} className="post-card-link">
      <article className="post-card">
        {/* Image */}
        {post.imageUrl && (
          <div className="post-card-image-wrapper">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="post-card-image"
            />
          </div>
        )}

        <div className="post-card-content">
          {/* Title + type */}
          <header className="post-card-header">
            <h3 className="post-card-title">{post.title}</h3>
            <span className={`post-card-badge ${className}`}>{label}</span>
          </header>

          {/* Description */}
          <p className="post-card-description">{post.description}</p>

          {/* Meta info */}
          <div className="post-card-meta">
            <p className="meta-item">
              <span className="meta-icon">📍</span>
              <span>{post.locationText}</span>
            </p>

            {dateStr && (
              <p className="meta-item">
                <span className="meta-icon">📅</span>
                <span>
                  {dateStr} {post.time && `• ${post.time}`}
                </span>
              </p>
            )}

            <p className="meta-item">
              <span className="meta-icon">👤</span>
              <span>{post.createdBy?.name || "Unknown"}</span>
              <span className="meta-dot">•</span>
              <span>👥 {post.participants?.length || 0} joined</span>
            </p>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="post-card-tags">
              {post.tags.map((tag) => (
                <span key={tag} className="post-card-tag">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
