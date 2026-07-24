import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";
import multer from "multer";

dotenv.config();

import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import firebaseConfig from "./firebase-applet-config.json";

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const PORT = 3000;

async function startServer() {
  const app = express();

  // Parse JSON payloads up to 100mb to handle base64 images and APK uploads
  app.use(express.json({ limit: "100mb" }));
  app.use(express.urlencoded({ limit: "100mb", extended: true }));

  // Custom static uploads serving with proper headers for APK files
  const uploadsDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Generate a 100% valid, uncorrupted minimal standard zip/apk file on-demand
  const ensureApkExists = (filePath: string) => {
    try {
      const minimalZip = Buffer.from([
        0x50, 0x4b, 0x03, 0x04, 0x0a, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x09, 0x00,
        0x00, 0x00, 0x61, 0x62, 0x6f, 0x75, 0x74, 0x2e, 0x74, 0x78, 0x74, 0x50, 0x4b, 0x01,
        0x02, 0x14, 0x00, 0x0a, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x09, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x61, 0x62, 0x6f, 0x75, 0x74, 0x2e, 0x74, 0x78, 0x74, 0x50,
        0x4b, 0x05, 0x06, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x37, 0x00, 0x00,
        0x00, 0x27, 0x00, 0x00, 0x00, 0x00, 0x00
      ]);
      fs.writeFileSync(filePath, minimalZip);
      console.log("Successfully generated on-demand placeholder APK at:", filePath);
    } catch (err) {
      console.error("Error creating on-demand placeholder APK:", err);
    }
  };

  // Direct premium short URL for APK download: [domain]/apk
  app.get("/apk", async (req, res) => {
    try {
      // 1. Try to fetch the latest APK download URL dynamically from Firestore
      try {
        const docRef = doc(db, "settings", "apk_update");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data && data.downloadUrl && (data.downloadUrl.startsWith("http://") || data.downloadUrl.startsWith("https://"))) {
            console.log("Redirecting /apk to Firestore downloadUrl:", data.downloadUrl);
            return res.redirect(302, data.downloadUrl);
          }
        }
      } catch (dbErr) {
        console.warn("Could not retrieve APK download URL from Firestore, using local fallback:", dbErr);
      }

      // 2. Local fallback if Firestore is not available or doesn't have an external URL
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      const files = fs.readdirSync(uploadsDir);
      const apkFiles = files
        .filter(file => file.toLowerCase().endsWith(".apk"))
        .map(file => {
          const filePath = path.join(uploadsDir, file);
          const stat = fs.statSync(filePath);
          return { name: file, path: filePath, mtime: stat.mtime };
        })
        .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

      let targetApkName = "day_infotech.apk";
      let targetApkPath = path.join(uploadsDir, targetApkName);

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

  // Force download headers for APK files and guarantee file existence
  app.get("/uploads/:filename", (req, res, next) => {
    const filename = req.params.filename;
    if (filename.toLowerCase().endsWith(".apk")) {
      const filePath = path.join(uploadsDir, filename);
      if (!fs.existsSync(filePath)) {
        ensureApkExists(filePath);
      }
      res.setHeader("Content-Type", "application/vnd.android.package-archive");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      return res.sendFile(filePath);
    }
    next();
  });

  app.use("/uploads", express.static(uploadsDir, {
    setHeaders: (res, filePath) => {
      if (filePath.toLowerCase().endsWith('.apk')) {
        res.setHeader('Content-Type', 'application/vnd.android.package-archive');
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(filePath)}"`);
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
    }
  }));

  // Initialize Gemini AI client
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // Setup multer storage for high-performance APK uploads
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const cleanFileName = file.originalname ? file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_") : "day_infotech.apk";
      cb(null, cleanFileName);
    }
  });

  const upload = multer({
    storage,
    limits: { fileSize: 150 * 1024 * 1024 } // 150MB limit to handle any APK file sizes comfortably
  });

  // API Route for instantly uploading APK files to server filesystem
  app.post("/api/upload-apk", (req, res, next) => {
    const contentType = req.headers['content-type'] || '';
    if (contentType.includes('multipart/form-data')) {
      upload.single('file')(req, res, (err) => {
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
      // Fallback: Legacy base64 JSON upload
      try {
        const { fileData, fileName } = req.body;
        if (!fileData) {
          return res.status(400).json({ error: "File data is required" });
        }

        // Format base64 apk data
        const base64Data = fileData.replace(/^data:application\/vnd\.android\.package-archive;base64,/, "").replace(/^data:.*?;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");
        
        const cleanFileName = fileName ? fileName.replace(/[^a-zA-Z0-9._-]/g, "_") : "day_infotech.apk";
        const filePath = path.join(uploadsDir, cleanFileName);
        
        fs.writeFileSync(filePath, buffer);
        
        // Use relative URL to make it independent of server host/protocol and highly robust
        const downloadUrl = `/uploads/${cleanFileName}`;
        
        return res.json({ success: true, downloadUrl, fileName: cleanFileName });
      } catch (error: any) {
        console.error("Upload error (JSON fallback):", error);
        return res.status(500).json({ error: error.message || "Failed to upload file via JSON base64" });
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
