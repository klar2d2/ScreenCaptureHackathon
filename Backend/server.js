import express from "express";
import multer from "multer";
import OpenAI from "openai";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";

dotenv.config();
const app = express();
app.use(cors());
const port = process.env.PORT || 3001;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const upload = multer({ dest: "upload/" });

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("File received:", req.file);

    // Read the file and convert to base64
    const imageBuffer = fs.readFileSync(req.file.path);
    const base64Image = imageBuffer.toString("base64");

    console.log("Image converted to base64");

    try {
      console.log("Sending request to OpenAI");
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "I want all the form fields and values listed out in a numbered list. use this form: 1. Last Name, Maiden: Watts",
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${req.file.mimetype};base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        max_tokens: 300,
      });

      console.log("Received response from OpenAI");
      const outputText = response.choices[0].message.content;
      console.log("Output text:", outputText);

      // Delete the uploaded file after processing
      fs.unlinkSync(req.file.path);
      console.log("Deleted uploaded file");

      res.json({ text: outputText });
    } catch (openaiError) {
      console.error("OpenAI API Error:", openaiError);
      res.status(500).json({
        error:
          openaiError.message ||
          "An error occurred while processing the image with OpenAI.",
      });
    }
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({
      error: error.message || "An error occurred while processing the image.",
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
