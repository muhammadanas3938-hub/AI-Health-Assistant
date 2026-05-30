import React, { useState, useEffect } from "react";

const API_BASE = "https://ai-health-assistant-1-35s1.onrender.com/";

export default function ClientPage() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  const fetchQueries = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/queries`);
      const data = await res.json();
      setQueries(data.reverse());
    } catch {
      setError("Could not connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString("en-US", {
      weekday: "short", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const getKeywords = (text) => {
    const stopWords = new Set(["i", "a", "the", "and", "or", "is", "in", "have", "has", "my", "feel", "feeling", "very", "some", "been", "me", "for", "are", "of", "it", "with", "also"]);
    return [...new Set(
      text.toLowerCase().split(/\W+/)
        .filter((w) => w.length > 3 && !stopWords.has(w))
    )].slice(0, 5);
  };

  return (
    <div className="page fade-in">
      <div className="page-header">
        <h1 className="page-title">My Health History</h1>
        <p className="page-subtitle">A summary of all your past symptom consultations.</p>
      </div>

      {/* Summary stats */}
      <div className="stats-row" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="stat-card">
          <div className="stat-value">{queries.length}</div>
          <div className="stat-label">Consultations</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {queries.length > 0 ? formatDate(queries[queries.length - 1]?.timestamp).split(",")[0] : "—"}
          </div>
          <div className="stat-label">First Consultation</div>
        </div>
      </div>

      {error && <div className="error-box">{error}</div>}

      {!loading && queries.length === 0 && !error && (
        <div className="empty-state">
          <div className="empty-icon">🌿</div>
          <div className="empty-title">No consultations yet</div>
          <div className="empty-desc">Head to the Symptoms page to get your first AI health guidance.</div>
        </div>
      )}

      {/* Two-panel layout on desktop */}
      {queries.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 1.4fr" : "1fr", gap: "20px", alignItems: "start" }}>

          {/* Left: List */}
          <div className="query-list">
            {queries.map((entry) => (
              <div
                key={entry.id}
                className="query-card"
                onClick={() => setSelected(selected?.id === entry.id ? null : entry)}
                style={{
                  cursor: "pointer",
                  borderColor: selected?.id === entry.id ? "var(--accent-light)" : "var(--border)",
                  boxShadow: selected?.id === entry.id ? "0 0 0 3px rgba(82,183,136,0.15)" : "var(--shadow)",
                }}
              >
                <div className="query-card-header">
                  <div className="query-meta">
                    <span className="query-id">#{entry.id}</span>
                    <span className="query-time">🕐 {formatDate(entry.timestamp)}</span>
                  </div>
                  {selected?.id === entry.id && (
                    <span style={{ fontSize: "12px", color: "var(--accent)", fontWeight: 600 }}>Selected ✓</span>
                  )}
                </div>
                <div className="query-symptoms-label">Symptoms</div>
                <div className="query-symptoms" style={{ fontSize: "14px" }}>{entry.symptoms}</div>
                <div className="badge-row" style={{ marginTop: "10px", marginBottom: 0 }}>
                  {getKeywords(entry.symptoms).map((kw) => (
                    <span key={kw} className="badge">#{kw}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right: Detail panel */}
          {selected && (
            <div className="card fade-in" style={{ position: "sticky", top: "88px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "18px" }}>Consultation #{selected.id}</h3>
                <button className="btn btn-ghost" style={{ padding: "6px 12px", fontSize: "13px" }} onClick={() => setSelected(null)}>
                  ✕ Close
                </button>
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-light)", marginBottom: "16px" }}>
                {formatDate(selected.timestamp)}
              </div>
              <div className="query-symptoms-label">Your Symptoms</div>
              <div style={{ fontWeight: 600, marginBottom: "20px", fontSize: "15px" }}>{selected.symptoms}</div>
              <div style={{ height: "1px", background: "var(--border)", marginBottom: "16px" }} />
              <div style={{ fontSize: "13px", color: "var(--accent)", fontWeight: 600, marginBottom: "10px" }}>
                🩺 AI Response
              </div>
              <div className="response-text" style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                {selected.response}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
