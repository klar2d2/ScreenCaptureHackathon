import OpenAI from "openai";
import dotenv from "dotenv";
import { encoding_for_model } from "tiktoken";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function analyzeImage(imageUrl) {
  const messages = [
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
            url: imageUrl,
            detail: "high",
          },
        },
      ],
    },
  ];

  // Count tokens
  const enc = encoding_for_model("gpt-4o"); // Replace with your model
  const tokenCount = enc.encode(JSON.stringify(messages)).length;
  console.log(`Token count: ${tokenCount}`);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      max_tokens: 300,
    });
    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error("Error:", error);
  }
}

const imageUrl =
  "https://image.slidesharecdn.com/electronichealthrecords-140507154817-phpapp01/75/Electronic-health-records-4-2048.jpg";
analyzeImage(imageUrl);
