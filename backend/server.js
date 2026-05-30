const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// In-memory store for all queries
let queryLog = [];
let queryIdCounter = 1;

// POST /api/chat — receive symptoms, call Gemini, return response
app.post("/api/chat", async (req, res) => {
  const { symptoms } = req.body;

  if (!symptoms || symptoms.trim() === "") {
    return res.status(400).json({ error: "Symptoms field is required." });
  }

  const prompt = `You are a helpful AI health assistant. A user has described the following symptoms: "${symptoms}". 
Provide clear, friendly, and responsible health guidance. 
Include:
1. Possible causes (2-3 likely ones)
2. Home care suggestions
3. When to see a doctor

Always remind the user that this is not a substitute for professional medical advice.
Keep the response concise and easy to understand.`;

  try {
    const apiKey = process.env.API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const geminiRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini API error:", errText);
      return res.status(502).json({ error: "Gemini API request failed.", details: errText });
    }

    const data = await geminiRes.json();
    const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI.";

    // Store query in memory
    const entry = {
      id: queryIdCounter++,
      symptoms: symptoms.trim(),
      response: aiText,
      timestamp: new Date().toISOString(),
    };
    queryLog.push(entry);

    return res.json({ response: aiText, id: entry.id });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// GET /api/queries — return all stored queries (Admin & Client views)
app.get("/api/queries", (req, res) => {
  res.json(queryLog);
});

// DELETE /api/queries/:id — delete a single query (Admin view)
app.delete("/api/queries/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const before = queryLog.length;
  queryLog = queryLog.filter((q) => q.id !== id);
  if (queryLog.length < before) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Entry not found." });
  }
});

app.listen(PORT, () => {
  console.log(`\n✅ AI Health Assistant backend running on http://localhost:${PORT}\n`);
});
