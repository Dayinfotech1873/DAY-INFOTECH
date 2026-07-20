import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();

  // Parse JSON payloads up to 15mb to handle base64 images
  app.use(express.json({ limit: "15mb" }));

  // Initialize Gemini AI client
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Route for AI Deep Scan Document details
  app.post("/api/gemini/enhance-document", async (req, res) => {
    try {
      const { image, mode } = req.body;
      if (!image) {
        return res.status(400).json({ error: "Image data is required" });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY environment variable is not configured on the server." });
      }

      // Format base64 image data
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      const imagePart = {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data,
        },
      };

      const systemPrompt = `You are an expert AI Document Verification and Enhancement system.
Analyze the provided document image and extract its textual information with 100% precision.
DO NOT forge, invent, or change any information. Keep the original text exactly as is.
Return a structured JSON output reflecting the document details.

Mode context: ${mode} (ID_CARD standard size is 8.6cm x 5.6cm, A4_DOCUMENT standard size fits on A4).

Your response must strictly be a JSON object containing:
- documentType: Elegant human-readable document name (e.g. "Aadhar Card Front", "PAN Card", "Gujarat Income Certificate", etc.)
- fields: Array of objects with { label: string, value: string } extracted from the document deeply. Labels should be clear (e.g., "Full Name", "Card Number", "DOB", "Address", "Date of Issue").
- qualityScore: A number from 0 to 100 representing image/text legibility.
- cleaningTips: Array of recommendations (e.g., "whiten background", "sharpen small text characters", "enhance stamp visibility").
- autoCrop: Integer suggested rotation in degrees (0, 90, 180, 270) to make it right-side up.
- isVerified: Boolean if the document is authentic-looking and fields are parsed correctly.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          imagePart,
          { text: "Analyze this document deeply and extract its details cleanly in JSON format." }
        ],
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              documentType: { type: Type.STRING },
              fields: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    label: { type: Type.STRING },
                    value: { type: Type.STRING },
                  },
                  required: ["label", "value"],
                },
              },
              qualityScore: { type: Type.INTEGER },
              cleaningTips: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              autoCrop: { type: Type.INTEGER },
              isVerified: { type: Type.BOOLEAN },
            },
            required: ["documentType", "fields", "qualityScore", "cleaningTips", "autoCrop", "isVerified"],
          },
        },
      });

      const responseText = response.text || "{}";
      const result = JSON.parse(responseText);
      res.json(result);
    } catch (error: any) {
      console.error("Gemini enhance error:", error);
      res.status(500).json({ error: error.message || "Failed to process document with Gemini AI" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
