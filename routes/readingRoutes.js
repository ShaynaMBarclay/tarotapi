const express = require("express");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", async (req, res) => {
  const { question, cards } = req.body;
  if (!question || !cards || !cards.length) {
    return res.status(400).json({ error: "Question and cards are required." });
  }

  const prompt = `
User asked: "${question}"
Tarot cards drawn:
${cards.map((c, i) => `${i + 1}. ${c.name}: ${c.description}`).join("\n")}

Write a mystical, beginner-friendly interpretation of what these cards mean in relation to the user's question.
  `;

  try {
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    let text = await result.response.text();
    if (text.startsWith("```")) text = text.replace(/^```(\w*)\n/, "").replace(/```$/, "");
    res.json({ reading: text.trim() });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Failed to generate reading." });
  }
});

module.exports = router;
