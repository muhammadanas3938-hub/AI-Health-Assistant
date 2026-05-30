import React, { useState } from "react";

const API_BASE = "http://localhost:3001";

export default function UserPage() {
  const [symptoms, setSymptoms] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!symptoms.trim()) return;
    setLoading(true);
    setResponse("");
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setResponse(data.response);
      }
    } catch (err) {
      setError("Could not connect to the server. Make sure the backend is running on port 3001.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.ctrlKey) handleSubmit();
  };

  return (
    <div className="page fade-in">
      <div className="page-header">
        <h1 className="page-title">Describe Your Symptoms</h1>
        <p className="page-subtitle">Tell me how you're feeling and I'll provide health guidance powered by AI.</p>
      </div>

      <div className="card">
        <div className="form-group">
          <label className="form-label" htmlFor="symptoms">
            What symptoms are you experiencing?
          </label>
          <textarea
            id="symptoms"
            className="form-textarea"
            placeholder="e.g. I have a sore throat, mild fever for 2 days, and feel very tired..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={5}
          />
          <p style={{ fontSize: "12px", color: "var(--text-light)", marginTop: "6px" }}>
            Tip: Press <strong>Ctrl + Enter</strong> to submit
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={loading || !symptoms.trim()}
        >
          {loading ? (
            <>
              <span className="spinner" />
              Analyzing...
            </>
          ) : (
            <>🔍 Get Health Guidance</>
          )}
        </button>
      </div>

      {error && (
        <div className="error-box fade-in">
          ⚠️ {error}
        </div>
      )}

      {response && (
        <div className="response-box fade-in">
          <h3>🩺 AI Health Guidance</h3>
          <p className="response-text">{response}</p>
        </div>
      )}

      {/* Info cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginTop: "32px" }}>
        {[
          { icon: "🔒", title: "Private", desc: "Your queries are handled locally" },
          { icon: "⚡", title: "Instant", desc: "AI responses in seconds" },
          { icon: "📚", title: "Informed", desc: "Powered by Google Gemini" },
        ].map((item) => (
          <div key={item.title} className="card" style={{ textAlign: "center", padding: "20px 16px" }}>
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>{item.icon}</div>
            <div style={{ fontWeight: 600, marginBottom: "4px" }}>{item.title}</div>
            <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
