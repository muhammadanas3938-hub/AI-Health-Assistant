import React, { useState, useEffect } from "react";

const API_BASE = "https://ai-health-assistant-1-35s1.onrender.com";

function QueryCard({ entry, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString("en-US", {
      month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <div className="query-card fade-in">
      <div className="query-card-header">
        <div className="query-meta">
          <span className="query-id">#{entry.id}</span>
          <span className="query-time">🕐 {formatDate(entry.timestamp)}</span>
        </div>
        <button className="btn btn-danger" onClick={() => onDelete(entry.id)}>
          🗑 Delete
        </button>
      </div>

      <div className="query-symptoms-label">Reported Symptoms</div>
      <div className="query-symptoms">{entry.symptoms}</div>

      <button
        className="query-response-toggle"
        onClick={() => setExpanded((v) => !v)}
      >
        {expanded ? "Hide AI response ▲" : "View AI response ▼"}
      </button>

      {expanded && (
        <div className="query-response-body">{entry.response}</div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchQueries = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/queries`);
      const data = await res.json();
      setQueries(data.reverse()); // newest first
    } catch {
      setError("Could not connect to the backend. Make sure it's running on port 3001.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    try {
      await fetch(`${API_BASE}/api/queries/${id}`, { method: "DELETE" });
      setQueries((prev) => prev.filter((q) => q.id !== id));
    } catch {
      alert("Failed to delete. Backend may be unreachable.");
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  return (
    <div className="page fade-in">
      <div className="page-header">
        <h1 className="page-title">Admin Panel</h1>
        <p className="page-subtitle">View and manage all user symptom queries.</p>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{queries.length}</div>
          <div className="stat-label">Total Queries</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {queries.filter((q) => {
              const d = new Date(q.timestamp);
              return new Date() - d < 86400000;
            }).length}
          </div>
          <div className="stat-label">Today</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {queries.length > 0
              ? Math.round(queries.reduce((a, q) => a + q.symptoms.split(" ").length, 0) / queries.length)
              : 0}
          </div>
          <div className="stat-label">Avg Words / Query</div>
        </div>
      </div>

      {/* Actions */}
      <div className="admin-actions">
        <span className="admin-count">
          {loading ? "Loading..." : `${queries.length} entr${queries.length === 1 ? "y" : "ies"}`}
        </span>
        <button className="btn btn-ghost" onClick={fetchQueries} disabled={loading}>
          🔄 Refresh
        </button>
      </div>

      {error && <div className="error-box">{error}</div>}

      {!loading && queries.length === 0 && !error && (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <div className="empty-title">No queries yet</div>
          <div className="empty-desc">Queries will appear here once users submit symptoms.</div>
        </div>
      )}

      <div className="query-list">
        {queries.map((entry) => (
          <QueryCard key={entry.id} entry={entry} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
