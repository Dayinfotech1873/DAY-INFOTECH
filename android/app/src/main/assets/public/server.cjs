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
var import_fs = __toESM(require("fs"), 1);
var import_multer = __toESM(require("multer"), 1);
import_dotenv.default.config();
var PORT = 3e3;
async function startServer() {
  const app = (0, import_express.default)();
  app.use(import_express.default.json({ limit: "100mb" }));
  app.use(import_express.default.urlencoded({ limit: "100mb", extended: true }));
  const uploadsDir = import_path.default.join(process.cwd(), "uploads");
  if (!import_fs.default.existsSync(uploadsDir)) {
    import_fs.default.mkdirSync(uploadsDir, { recursive: true });
  }
  const ensureApkExists = (filePath) => {
    try {
      const minimalZip = Buffer.from([
        80,
        75,
        3,
        4,
        10,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        9,
        0,
        0,
        0,
        97,
        98,
        111,
        117,
        116,
        46,
        116,
        120,
        116,
        80,
        75,
        1,
        2,
        20,
        0,
        10,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        9,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        97,
        98,
        111,
        117,
        116,
        46,
        116,
        120,
        116,
        80,
        75,
        5,
        6,
        0,
        0,
        0,
        0,
        1,
        0,
        1,
        0,
        55,
        0,
        0,
        0,
        39,
        0,
        0,
        0,
        0,
        0
      ]);
      import_fs.default.writeFileSync(filePath, minimalZip);
      console.log("Successfully generated on-demand placeholder APK at:", filePath);
    } catch (err) {
      console.error("Error creating on-demand placeholder APK:", err);
    }
  };
  app.get("/apk", (req, res) => {
    try {
      if (!import_fs.default.existsSync(uploadsDir)) {
        import_fs.default.mkdirSync(uploadsDir, { recursive: true });
      }
      const files = import_fs.default.readdirSync(uploadsDir);
      const apkFiles = files.filter((file) => file.toLowerCase().endsWith(".apk")).map((file) => {
        const filePath = import_path.default.join(uploadsDir, file);
        const stat = import_fs.default.statSync(filePath);
        return { name: file, path: filePath, mtime: stat.mtime };
      }).sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
      let targetApkName = "day_infotech.apk";
      let targetApkPath = import_path.default.join(uploadsDir, targetApkName);
      if (apkFiles.length > 0) {
        targetApkName = apkFiles[0].name;
        targetApkPath = apkFiles[0].path;
      } else {
        ensureApkExists(targetApkPath);
      }
      res.setHeader("Content-Type", "application/vnd.android.package-archive");
      res.setHeader("Content-Disposition", `attachment; filename="${targetApkName}"`);
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      return res.sendFile(targetApkPath);
    } catch (err) {
      console.error("Error serving short URL APK:", err);
      return res.status(500).send("Error downloading APK file. Please try again.");
    }
  });
  app.get("/uploads/:filename", (req, res, next) => {
    const filename = req.params.filename;
    if (filename.toLowerCase().endsWith(".apk")) {
      const filePath = import_path.default.join(uploadsDir, filename);
      if (!import_fs.default.existsSync(filePath)) {
        ensureApkExists(filePath);
      }
      res.setHeader("Content-Type", "application/vnd.android.package-archive");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      return res.sendFile(filePath);
    }
    next();
  });
  app.use("/uploads", import_express.default.static(uploadsDir, {
    setHeaders: (res, filePath) => {
      if (filePath.toLowerCase().endsWith(".apk")) {
        res.setHeader("Content-Type", "application/vnd.android.package-archive");
        res.setHeader("Content-Disposition", `attachment; filename="${import_path.default.basename(filePath)}"`);
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      }
    }
  }));
  const ai = new import_genai.GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
  const storage = import_multer.default.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const cleanFileName = file.originalname ? file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_") : "day_infotech.apk";
      cb(null, cleanFileName);
    }
  });
  const upload = (0, import_multer.default)({
    storage,
    limits: { fileSize: 150 * 1024 * 1024 }
    // 150MB limit to handle any APK file sizes comfortably
  });
  app.post("/api/upload-apk", (req, res, next) => {
    const contentType = req.headers["content-type"] || "";
    if (contentType.includes("multipart/form-data")) {
      upload.single("file")(req, res, (err) => {
        if (err) {
          console.error("Multer upload error:", err);
          return res.status(500).json({ error: err.message || "File upload failed via multipart form" });
        }
        if (!req.file) {
          return res.status(400).json({ error: "No file was uploaded. Please make sure the field name is 'file'." });
        }
        const downloadUrl = `/uploads/${req.file.filename}`;
        return res.json({ success: true, downloadUrl, fileName: req.file.filename });
      });
    } else {
      try {
        const { fileData, fileName } = req.body;
        if (!fileData) {
          return res.status(400).json({ error: "File data is required" });
        }
        const base64Data = fileData.replace(/^data:application\/vnd\.android\.package-archive;base64,/, "").replace(/^data:.*?;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");
        const cleanFileName = fileName ? fileName.replace(/[^a-zA-Z0-9._-]/g, "_") : "day_infotech.apk";
        const filePath = import_path.default.join(uploadsDir, cleanFileName);
        import_fs.default.writeFileSync(filePath, buffer);
        const downloadUrl = `/uploads/${cleanFileName}`;
        return res.json({ success: true, downloadUrl, fileName: cleanFileName });
      } catch (error) {
        console.error("Upload error (JSON fallback):", error);
        return res.status(500).json({ error: error.message || "Failed to upload file via JSON base64" });
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
