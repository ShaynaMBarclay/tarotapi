import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", async (req, res) => {
  const { question, cards } = req.body;

  // Validate input
  if (!question || !cards || !cards.length) {
    return res.status(400).json({ error: "Question and cards are required." });
  }

  const prompt = `
User asked: "${question}"
Tarot cards drawn:
${cards.map((c, i) => `${i + 1}. ${c.name}: ${c.description}`).join("\n")}

As an expert tarot reader with a whimsical and enchanting personality:
- If only 1 card is drawn, provide a short, focused interpretation.  
- If 3 cards are drawn, interpret them as a past, present, and future spread.  
- If 10 cards are drawn, provide a more in-depth reading that ties the themes together as a full Celtic Cross spread.  
Offer insight, guidance, and a touch of magical storytelling in relation to the user's question.
`;

  try {
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });
    const result = await model.generateContent(prompt);

    let text = await result.response.text();

    // Clean code block formatting if present
    if (text.startsWith("```")) {
      text = text.replace(/^```(\w*)\n/, "").replace(/```$/, "");
    }

    // Ensure JSON response is always valid
    res.json({ reading: text.trim() });

  } catch (error) {
    console.error("Gemini Error:", error);

    // Always return valid JSON, even on errors
    res.status(503).json({ reading: "The cards are busy. Please try again in a moment." });
  }
});

export default router;
