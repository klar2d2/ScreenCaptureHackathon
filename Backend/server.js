import express from "express";
import multer from "multer";
import OpenAI from "openai";
import dotenv from "dotenv";
import { encoding_for_model } from "tiktoken";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const imagePath = req.file.path;

    // Process the image with OCR (Tesseract.js example)
    const {
      data: { text },
    } = await Tesseract.recognize(imagePath, "eng");

    // Count tokens for input
    const messages = [
      {
        role: "user",
        content: `Extracted text from the image: ${text}\n\nI want all the form fields and values listed out in a numbered list.`,
      },
    ];
    const enc = encoding_for_model("gpt-4o");
    const inputTokenCount = enc.encode(JSON.stringify(messages)).length;
    console.log(`Input token count: ${inputTokenCount}`);

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      max_tokens: 300,
    });

    const outputText = response.choices[0].message.content;
    const outputTokenCount = enc.encode(outputText).length;
    console.log(`Output token count: ${outputTokenCount}`);

    // Calculate cost
    const inputCostPerToken = 0.01 / 1000;
    const outputCostPerToken = 0.03 / 1000;
    const inputCost = inputTokenCount * inputCostPerToken;
    const outputCost = outputTokenCount * outputCostPerToken;
    const totalCost = inputCost + outputCost;

    console.log(`Total cost: $${totalCost.toFixed(4)}`);

    res.json({ text: outputText, cost: totalCost });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the image." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
