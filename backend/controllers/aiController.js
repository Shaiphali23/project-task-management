const axios = require("axios");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

// Helper to call Gemini / Generative Language generateContent REST endpoint
async function callGeminiGenerateContent(contents, generationConfig = {}) {
  if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not set");

  // endpoint (v1beta). If Google updates endpoints, change accordingly.
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

  const body = {
    // request shape: contents is array of { parts: [{ text: '...' }] }
    contents,
    // optional: generationConfig could include temperature, maxOutputTokens etc.
    ...(Object.keys(generationConfig || {}).length ? { generationConfig } : {}),
  };

  const headers = {
    "Content-Type": "application/json",
    "x-goog-api-key": GEMINI_API_KEY,
  };

  const resp = await axios.post(url, body, { headers, timeout: 20000 });
  return resp.data;
}

// Extract readable text from multiple possible response shapes
function extractTextFromGeminiResponse(data) {
  if (!data) return null;
  try {
    // 1) new style: data.candidates[0].content.parts[].text
    const cand = data.candidates && data.candidates[0];
    if (cand) {
      const content = cand.content;
      if (content && Array.isArray(content.parts) && content.parts.length) {
        return content.parts.map((p) => p.text).join("\n\n");
      }
      // sometimes content is array with parts
      if (Array.isArray(content)) {
        const parts = content.flatMap((c) =>
          Array.isArray(c.parts)
            ? c.parts.map((p) => p.text)
            : c.text
            ? [c.text]
            : []
        );
        if (parts.length) return parts.join("\n\n");
      }
      if (typeof cand.text === "string") return cand.text;
    }

    // 2) old style: data.output or data.output[0].content
    if (data.output && typeof data.output === "string") return data.output;
    if (Array.isArray(data.output)) {
      const parts = data.output.flatMap((o) =>
        o.parts ? o.parts.map((p) => p.text) : o.text ? [o.text] : []
      );
      if (parts.length) return parts.join("\n\n");
    }

    // fallback: stringify
    return JSON.stringify(data);
  } catch (err) {
    return JSON.stringify(data);
  }
}

exports.summarizeProject = async (req, res) => {
  try {
    const tasks = req.body.tasks || [];
    if (!Array.isArray(tasks))
      return res.status(400).json({ error: "tasks must be an array" });

    const promptText = [
      "Summarize these project tasks. Output:",
      "1) Short project summary (1-2 lines).",
      "2) Grouped action list by status (To Do, In Progress, Done).",
      "3) Top 3 recommended next priorities.",
      "",
      "Tasks:",
      ...tasks.map(
        (t) =>
          `- ${t.title}${t.description ? ": " + t.description : ""} [status:${
            t.status || "todo"
          }]`
      ),
    ].join("\n");

    const contents = [{ parts: [{ text: promptText }] }];

    const generationConfig = {
      // You can set temperature, maxOutputTokens etc. if supported by the chosen model.
      // temperature: 0.2,
      // maxOutputTokens: 512
    };

    const aiResp = await callGeminiGenerateContent(contents, generationConfig);
    const text = extractTextFromGeminiResponse(aiResp);

    res.json({ success: true, text, raw: aiResp });
  } catch (err) {
    console.error("AI summarize error:", err.response?.data || err.message);
    res
      .status(500)
      .json({
        error: "AI request failed",
        details: err.response?.data || err.message,
      });
  }
};

exports.qaOnCard = async (req, res) => {
  try {
    const { card, question } = req.body;
    if (!card || !question)
      return res.status(400).json({ error: "card and question required" });

    const promptText = [
      `Task card:`,
      `Title: ${card.title}`,
      `Description: ${card.description || ""}`,
      `Status: ${card.status || "todo"}`,
      ``,
      `Question: ${question}`,
      `Answer concisely. If not enough info, state that you cannot answer from the card.`,
    ].join("\n");

    const contents = [{ parts: [{ text: promptText }] }];

    const aiResp = await callGeminiGenerateContent(contents, {});
    const text = extractTextFromGeminiResponse(aiResp);

    res.json({ success: true, text, raw: aiResp });
  } catch (err) {
    console.error("AI QA error:", err.response?.data || err.message);
    res
      .status(500)
      .json({
        error: "AI request failed",
        details: err.response?.data || err.message,
      });
  }
};
