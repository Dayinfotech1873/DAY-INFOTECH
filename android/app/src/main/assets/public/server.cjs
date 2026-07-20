var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var PORT = 3e3;
async function startServer() {
  const app = (0, import_express.default)();
  app.use(import_express.default.json({ limit: "15mb" }));
  const ai = new import_genai.GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
  app.post("/api/gemini/enhance-document", async (req, res) => {
    try {
      const { image, mode } = req.body;
      if (!image) {
        return res.status(400).json({ error: "Image data is required" });
      }
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY environment variable is not configured on the server." });
      }
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      const imagePart = {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data
        }
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
            type: import_genai.Type.OBJECT,
            properties: {
              documentType: { type: import_genai.Type.STRING },
              fields: {
                type: import_genai.Type.ARRAY,
                items: {
                  type: import_genai.Type.OBJECT,
                  properties: {
                    label: { type: import_genai.Type.STRING },
                    value: { type: import_genai.Type.STRING }
                  },
                  required: ["label", "value"]
                }
              },
              qualityScore: { type: import_genai.Type.INTEGER },
              cleaningTips: {
                type: import_genai.Type.ARRAY,
                items: { type: import_genai.Type.STRING }
              },
              autoCrop: { type: import_genai.Type.INTEGER },
              isVerified: { type: import_genai.Type.BOOLEAN }
            },
            required: ["documentType", "fields", "qualityScore", "cleaningTips", "autoCrop", "isVerified"]
          }
        }
      });
      const responseText = response.text || "{}";
      const result = JSON.parse(responseText);
      res.json(result);
    } catch (error) {
      console.error("Gemini enhance error:", error);
      res.status(500).json({ error: error.message || "Failed to process document with Gemini AI" });
    }
  });
  app.use("/assets", import_express.default.static(import_path.default.join(process.cwd(), "assets")));
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
