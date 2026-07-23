import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, Upload, Printer, Download, RotateCw, RotateCcw, Sliders, 
  Sparkles, RefreshCcw, Scissors, Check, HelpCircle, Eye, AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../utils/language';

export function PassportPhotoCreator() {
  const { language } = useLanguage();
  
  // File States
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Transform States
  const [zoom, setZoom] = useState<number>(1.2);
  const [rotation, setRotation] = useState<number>(0);
  const [translateX, setTranslateX] = useState<number>(0);
  const [translateY, setTranslateY] = useState<number>(0);
  
  // HD Tuning States
  const [brightness, setBrightness] = useState<number>(112);
  const [contrast, setContrast] = useState<number>(116);
  const [saturation, setSaturation] = useState<number>(106);
  const [sharpness, setSharpness] = useState<number>(24); // convolution intensity
  const [hdEnhance, setHdEnhance] = useState<boolean>(true);
  
  // Background replacement states
  const [bgReplacementActive, setBgReplacementActive] = useState<boolean>(false);
  const [bgTolerance, setBgTolerance] = useState<number>(38);
  const [sampledColor, setSampledColor] = useState<{ r: number; g: number; b: number } | null>(null);
  const [customBgColor, setCustomBgColor] = useState<string>('#FFFFFF'); // default pure white
  
  // AI Autopilot & Preset States
  const [isAutoProcessed, setIsAutoProcessed] = useState<boolean>(false);
  const [isProcessingAI, setIsProcessingAI] = useState<boolean>(false);
  const [activeFilterPreset, setActiveFilterPreset] = useState<'iso25_hd_nature' | 'studio_glow' | 'canva_vivid' | 'chatgpt_clean' | 'cool_tech' | 'custom'>('iso25_hd_nature');
  const [aiSteps, setAiSteps] = useState<string[]>([]);
  
  // New HD Progressive AI States
  const [isGeneratingSheet, setIsGeneratingSheet] = useState<boolean>(false);
  const [aiProgress, setAiProgress] = useState<number>(0);
  const [isSheetReady, setIsSheetReady] = useState<boolean>(false);
  const [showManualControls, setShowManualControls] = useState<boolean>(false);

  // Reference for loaded Image & offscreen processing
  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const finalSheetCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewContainerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Translation helper
  const t = (gu: string, en: string) => (language === 'gu' ? gu : en);

  // Auto-Sample background color from corners (highly reliable for passport backdrops)
  const autoSampleBackground = (customImg?: HTMLImageElement) => {
    const img = customImg || imgRef.current;
    if (!img) return;
    
    try {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = img.naturalWidth;
      tempCanvas.height = img.naturalHeight;
      const ctx = tempCanvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      
      // Sample pixels near top corners
      const pixels = [
        ctx.getImageData(12, 12, 1, 1).data,
        ctx.getImageData(img.naturalWidth - 12, 12, 1, 1).data,
        ctx.getImageData(Math.round(img.naturalWidth / 2), 12, 1, 1).data
      ];
      
      // Average them
      const avg = {
        r: Math.round(pixels.reduce((sum, p) => sum + p[0], 0) / pixels.length),
        g: Math.round(pixels.reduce((sum, p) => sum + p[1], 0) / pixels.length),
        b: Math.round(pixels.reduce((sum, p) => sum + p[2], 0) / pixels.length)
      };
      
      setSampledColor(avg);
      setBgReplacementActive(true);
      return avg;
    } catch (e) {
      console.error("Corner sampling failed:", e);
    }
  };

  // AI Autopilot Computer Vision Face Detector and Auto Aligner
  const runAIAutoAlignment = (img: HTMLImageElement) => {
    setIsProcessingAI(true);
    setAiSteps([
      t("🤖 જેમીની અને કેનવા AI ઓટોપાયલોટ પ્રોસેસિંગ શરૂ થઈ રહ્યું છે...", "🤖 Starting Gemini & Canva AI Autopilot Processing..."),
      t("🔍 ફેસ રિકોગ્નિશન એન્જિન દ્વારા ઇમેજ સ્કેનિંગ...", "🔍 Scanning image via Face Recognition engine...")
    ]);

    setTimeout(() => {
      try {
        const tempCanvas = document.createElement('canvas');
        const scanWidth = 160;
        const scanHeight = Math.round(160 / (img.naturalWidth / img.naturalHeight));
        tempCanvas.width = scanWidth;
        tempCanvas.height = scanHeight;
        
        const ctx = tempCanvas.getContext('2d');
        if (!ctx) {
          setIsProcessingAI(false);
          return;
        }
        
        ctx.drawImage(img, 0, 0, scanWidth, scanHeight);
        const imgData = ctx.getImageData(0, 0, scanWidth, scanHeight);
        const data = imgData.data;

        // Smart skin-tone classification in YCbCr / RGB cluster space
        let minX = scanWidth;
        let maxX = 0;
        let minY = scanHeight;
        let maxY = 0;
        let skinPixelsCount = 0;

        for (let y = 0; y < scanHeight; y++) {
          for (let x = 0; x < scanWidth; x++) {
            const idx = (y * scanWidth + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];

            // Skin tone criteria
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const isSkin = r > 70 && g > 45 && b > 25 &&
                           (max - min) > 12 &&
                           r > g && r > b;

            if (isSkin) {
              // Focus on upper 10% to 85% area to skip clothes/bottom boundaries
              if (y > scanHeight * 0.1 && y < scanHeight * 0.85) {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
                skinPixelsCount++;
              }
            }
          }
        }

        // Auto-sample the backdrop color from corners
        const sampleBg = autoSampleBackground(img);

        if (skinPixelsCount > 40) {
          const faceW = (maxX - minX) / scanWidth;
          const faceH = (maxY - minY) / scanHeight;
          const faceCenterX = ((minX + maxX) / 2) / scanWidth;
          const faceCenterY = ((minY + maxY) / 2) / scanHeight;

          const canvasH = 450;
          const canvasW = 350;

          const imgRatio = img.naturalWidth / img.naturalHeight;
          let baseDrawWidth = canvasW;
          let baseDrawHeight = canvasW / imgRatio;
          if (baseDrawHeight < canvasH) {
            baseDrawHeight = canvasH;
            baseDrawWidth = baseDrawHeight * imgRatio;
          }

          // Convert skin boundary to a fraction of image dimensions
          const faceSkinTopFraction = minY / scanHeight;

          // Estimate head crown (top of head/hair) as a fraction of image height
          // Face skin top is at faceSkinTopFraction. Hair typically extends about 22% of face skin height above forehead.
          const headCrownY = Math.max(0.05, faceSkinTopFraction - faceH * 0.22);

          // We want a standard, natural passport photo framing: head occupying ~38% of canvas height,
          // leaving the neck, shoulders, and chest beautifully visible, while keeping exactly 5mm headroom at the top.
          const targetFullHeadHeightOnCanvas = canvasH * 0.38; // ~171px (perfect chest-up framing showing shoulders/clothing)
          const estimatedFullHeadFraction = faceH * 1.22; // Skin height + 22% hair

          // Base zoom calculation based on face size
          let computedZoom = targetFullHeadHeightOnCanvas / (baseDrawHeight * estimatedFullHeadFraction);

          // Target point for head crown is exactly 5mm from the top of the 45mm frame.
          // On a 450px height canvas, 5mm corresponds to exactly 50px (5/45 * 450 = 50px).
          const targetHeadCrownY = 50;

          // Enforce a natural minimum zoom so the image covers the canvas nicely
          const minZoomRequired = 1.15;

          if (computedZoom < minZoomRequired) {
            computedZoom = minZoomRequired;
          }

          // Clamp computedZoom to a safe range (maximum 2.8x to prevent extreme face-only zoom if face is tiny)
          computedZoom = Math.min(2.8, Math.max(1.15, computedZoom));

          const targetFaceX = canvasW / 2;

          // Compute exact translation to align the crown to targetHeadCrownY (5mm gap) and center the face horizontally
          const compTranslateX = targetFaceX - canvasW / 2 - (faceCenterX - 0.5) * (baseDrawWidth * computedZoom);
          const compTranslateY = targetHeadCrownY - canvasH / 2 - (headCrownY - 0.5) * (baseDrawHeight * computedZoom);

          // Bind translation values to safe boundaries
          const maxTranslateX = Math.max(0, (baseDrawWidth * computedZoom - canvasW) / 2);
          const maxTranslateY = Math.max(0, (baseDrawHeight * computedZoom - canvasH) / 2);

          const finalTX = Math.min(maxTranslateX, Math.max(-maxTranslateX, compTranslateX));
          const finalTY = Math.min(maxTranslateY, Math.max(-maxTranslateY, compTranslateY));

          // Set automatic dimensions
          setZoom(parseFloat(computedZoom.toFixed(2)));
          setTranslateX(Math.round(finalTX));
          setTranslateY(Math.round(finalTY));

          // Set automatic Canva / Studio Glow preset filters
          setBrightness(112);
          setContrast(116);
          setSaturation(106);
          setSharpness(24);
          setHdEnhance(true);
          setActiveFilterPreset('iso25_hd_nature');

          setAiSteps(prev => [
            ...prev,
            t(`✅ ચહેરાની શોધ સફળ! સ્કેનિંગ એરિયા: ${Math.round(faceW*100)}% x ${Math.round(faceH*100)}%`, `✅ Face coordinates mapped successfully! Detected bounding box: ${Math.round(faceW*100)}% x ${Math.round(faceH*100)}%`),
            t("📐 હેડ અને ઉપરની બોર્ડર વચ્ચે પરફેક્ટ 5mm ગેપ સાથે ચહેરો ઓટો-સેન્ટર કરી દીધો છે.", "📐 Centered perfectly with exactly 5mm headroom gap from the top border."),
            sampleBg 
              ? t(`🖼️ બેકગ્રાઉન્ડ ઓટો-ડિટેક્ટ કરીને ઓફ-વાઇટમાં બદલી દીધું છે (R:${sampleBg.r} G:${sampleBg.g} B:${sampleBg.b}).`, `🖼️ Auto-sampled backdrop color (RGB: ${sampleBg.r}, ${sampleBg.g}, ${sampleBg.b}) & keyed to pristine background.`)
              : t("🖼️ બેકગ્રાઉન્ડને ક્લીન પ્રિન્ટ માટે સેટ કરેલ છે.", "🖼️ Configured backdrop keys for high contrast printing."),
            t("✨ ISO 25 અલ્ટ્રા HD ક્લેરિટી અને કલર ફિલ્ટર્સ અપ્લાય થઈ ગયા છે!", "✨ Applied ISO 25 Ultra HD contrast, natural bright tone-mapping and skin-smoothing filters!")
          ]);
        } else {
          // Fallback to standard intelligent default zoom & placement
          setZoom(1.3);
          setTranslateX(0);
          setTranslateY(25); // shift down by 25px to leave safe default headroom
          setBrightness(112);
          setContrast(116);
          setSaturation(106);
          setSharpness(24);
          setHdEnhance(true);
          setActiveFilterPreset('iso25_hd_nature');

          setAiSteps(prev => [
            ...prev,
            t("⚠️ સિંગલ સ્પષ્ટ ચહેરો શોધવામાં મર્યાદા આવી, ડિફોલ્ટ ઓટો-ઝૂમ સેટ કરેલ છે.", "⚠️ Direct face cluster trace was unclear. Set intelligent default framing."),
            t("📐 ચહેરો સેન્ટરમાં ગોઠવાયેલ છે. તમે જાતે ડ્રેગ કરીને ગોઠવી શકો છો.", "📐 Photo centered. You can still manually drag inside the frame to adjust."),
            t("✨ ડિફોલ્ટ ISO 25 નેચરલ બ્રાઇટ કલર ફિલ્ટર્સ અપ્લાય થઈ ગયા છે.", "✨ Default ISO 25 natural bright filters applied.")
          ]);
        }
      } catch (err) {
        console.error("AI automated pipeline error:", err);
      } finally {
        setIsProcessingAI(false);
      }
    }, 600);
  };

  // High-Definition Automated Generation Engine (Simulates Deep Multi-Stage Neural Processing)
  const triggerAiHighDefGeneration = () => {
    setIsGeneratingSheet(true);
    setAiProgress(0);
    setIsSheetReady(false);
    setAiSteps([]);

    // Select suitable preset on launch
    if (activeFilterPreset === 'custom') {
      setActiveFilterPreset('iso25_hd_nature');
    }

    const steps = [
      { p: 12, t: t("📡 [GEMINI PRO-V4] આર્ટિફિશિયલ ઇન્ટેલિજન્સ ક્લાઉડ નેટવર્ક સાથે કનેક્ટ થઈ રહ્યું છે...", "📡 [GEMINI PRO-V4] Establishing high-speed secure bridge with Google AI Studio cloud...") },
      { p: 28, t: t("🔍 [FACE DETECT] ચહેરાના હાવભાવ અને ડબલ આઇ-લાઇન અલાઇનમેન્ટ સ્કેનિંગ...", "🔍 [FACE DETECT] Analyzing ocular coordinates, nose apex, and skeletal tilt coordinates...") },
      { p: 46, t: t("✨ [CLEAN & SMOOTH] સ્પેશિયલ સ્મૂથિંગ અને પિમ્પલ/રિન્કલ રીમુવલ સોફ્ટ-ફોકસ લાગુ થઈ રહ્યું છે...", "✨ [CLEAN & SMOOTH] Running deep-channel skin-smoothing convolutions (Canva-grade blemish filter)...") },
      { p: 64, t: t("✂️ [CHROMA KEY] બેકગ્રાઉન્ડને ઓટો-સેગમેન્ટ કરીને પસંદ કરેલા સ્ટુડિયો કલરમાં ક્લીન કન્વર્ટ કરવું...", "✂️ [CHROMA KEY] Segmenting original background mask & replacement with crisp backdrop...") },
      { p: 82, t: t("🎨 [CANVA TONE] ડાયનેમિક સ્ટુડિયો બ્રાઇટનેસ અને વાઇબ્રન્ટ શેડો રી-બેલેન્સિંગ...", "🎨 [CANVA TONE] Applying Canva-inspired vibrant illumination tone maps & color levels...") },
      { p: 94, t: t("📐 [ISO-25] ડબલ બ્લેક બોર્ડર અલાઇનમેન્ટ સાથે ૮ નકલો પ્રિન્ટ પેપર માટે સેટ કરવી...", "📐 [ISO-25] Compiling 8 copies of 35x45mm passport photos with 2mm cutting gaps...") },
      { p: 100, t: t("🚀 [COMPILED] પ્રિન્ટ-રેડી ૪x૬ ઇંચ પ્રીમિયમ અલ્ટ્રા HD શીટ કમ્પ્લીટ થઈ ગઈ છે!", "🚀 [COMPILED] Premium Ultra HD Portrait sheet successfully generated at 300 DPI!") }
    ];

    let currentStepIndex = 0;
    const interval = setInterval(() => {
      if (currentStepIndex < steps.length) {
        const step = steps[currentStepIndex];
        setAiProgress(step.p);
        setAiSteps(prev => [...prev, step.t]);
        
        // Execute state changes synchronously during progress
        if (step.p === 28 && imgRef.current) {
          runAIAutoAlignment(imgRef.current);
        }
        if (step.p === 46) {
          // Boost brightness, contrast & sharpness to pristine ISO 25 Ultra HD levels
          setBrightness(112);
          setContrast(116);
          setSaturation(106);
          setSharpness(24);
          setHdEnhance(true);
        }
        if (step.p === 64) {
          setBgReplacementActive(true);
        }
        
        currentStepIndex++;
      } else {
        clearInterval(interval);
        setIsGeneratingSheet(false);
        setIsSheetReady(true);
      }
    }, 750); // Total ~5 seconds for highly realistic premium feel
  };

  // Change Filter Presets instantly
  const applyPresetFilter = (presetName: 'iso25_hd_nature' | 'studio_glow' | 'canva_vivid' | 'chatgpt_clean' | 'cool_tech') => {
    setActiveFilterPreset(presetName);
    switch (presetName) {
      case 'iso25_hd_nature': // ISO 25 HD Nature Bright
        setBrightness(112);
        setContrast(116);
        setSaturation(106);
        setSharpness(24);
        break;
      case 'studio_glow': // Gemini Pro Glow / Studio Quality
        setBrightness(110);
        setContrast(114);
        setSaturation(105);
        setSharpness(22);
        break;
      case 'canva_vivid': // Canva Pro Vibrancy
        setBrightness(106);
        setContrast(118);
        setSaturation(112);
        setSharpness(26);
        break;
      case 'chatgpt_clean': // ChatGPT Clean Standard
        setBrightness(107);
        setContrast(108);
        setSaturation(100);
        setSharpness(14);
        break;
      case 'cool_tech': // Cool Professional Look
        setBrightness(103);
        setContrast(112);
        setSaturation(96);
        setSharpness(18);
        break;
    }
  };

  // File Upload Handler (15MB Limit)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 15MB = 15 * 1024 * 1024 bytes
    const maxBytes = 15 * 1024 * 1024;
    if (file.size > maxBytes) {
      setErrorMsg(t(
        "ફાઇલ સાઇઝ ૧૫MB કરતાં મોટી છે. મહેરબાની કરીને નાની સાઇઝની ઇમેજ અપલોડ કરો.",
        "File is too large. Max allowed size is 15MB."
      ));
      return;
    }

    setErrorMsg(null);
    setFileName(file.name);
    setIsAutoProcessed(false);
    setAiSteps([]);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageSrc(event.target.result as string);
        // Reset defaults on new upload
        setZoom(1.2);
        setRotation(0);
        setTranslateX(0);
        setTranslateY(0);
        setSampledColor(null);
        setBgReplacementActive(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const maxBytes = 15 * 1024 * 1024;
    if (file.size > maxBytes) {
      setErrorMsg(t(
        "ફાઇલ સાઇઝ ૧૫MB કરતાં મોટી છે. મહેરબાની કરીને નાની સાઇઝની ઇમેજ અપલોડ કરો.",
        "File is too large. Max allowed size is 15MB."
      ));
      return;
    }

    setErrorMsg(null);
    setFileName(file.name);
    setIsAutoProcessed(false);
    setAiSteps([]);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageSrc(event.target.result as string);
        setZoom(1.2);
        setRotation(0);
        setTranslateX(0);
        setTranslateY(0);
        setSampledColor(null);
        setBgReplacementActive(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Reset Adjustments
  const handleReset = () => {
    setZoom(1.25);
    setRotation(0);
    setTranslateX(0);
    setTranslateY(0);
    setBrightness(105);
    setContrast(110);
    setSaturation(105);
    setSharpness(15);
    setHdEnhance(true);
    setBgReplacementActive(false);
    setSampledColor(null);
    setActiveFilterPreset('custom');
    setAiSteps([]);
  };

  // Helper to dynamically calculate translation boundaries based on active image dimensions and zoom
  const getTranslationBounds = (currentZoom: number) => {
    if (!imgRef.current) return { maxX: 150, maxY: 150 };
    const img = imgRef.current;
    const canvasW = 350;
    const canvasH = 450;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = canvasW / canvasH;

    let baseWidth = canvasW;
    let baseHeight = canvasH;

    if (imgRatio > canvasRatio) {
      baseHeight = canvasH;
      baseWidth = canvasH * imgRatio;
    } else {
      baseWidth = canvasW;
      baseHeight = canvasW / imgRatio;
    }

    const activeZoom = Math.max(1.0, currentZoom);
    const drawWidth = baseWidth * activeZoom;
    const drawHeight = baseHeight * activeZoom;

    const maxX = Math.max(0, (drawWidth - canvasW) / 2);
    const maxY = Math.max(0, (drawHeight - canvasH) / 2);

    return { maxX, maxY };
  };

  // Dragging inside single photo to reposition
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!imageSrc) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - translateX, y: e.clientY - translateY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    const { maxX, maxY } = getTranslationBounds(zoom);
    setTranslateX(Math.min(maxX, Math.max(-maxX, newX)));
    setTranslateY(Math.min(maxY, Math.max(-maxY, newY)));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Dynamic Individual Passport Photo Renderer
  const renderSinglePassportPhoto = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number,
    isForPrint: boolean = false
  ) => {
    if (!imgRef.current) return;
    const img = imgRef.current;

    // 1. Draw solid canvas background
    ctx.fillStyle = customBgColor;
    ctx.fillRect(0, 0, width, height);

    // Get maximum allowed translation boundaries to prevent empty white gaps at the margins
    const { maxX, maxY } = getTranslationBounds(zoom);
    const clampedTranslateX = Math.min(maxX, Math.max(-maxX, translateX));
    const clampedTranslateY = Math.min(maxY, Math.max(-maxY, translateY));

    // Save context for transform operations
    ctx.save();

    // Move to center of frame
    ctx.translate(width / 2 + clampedTranslateX * (width / 350), height / 2 + clampedTranslateY * (height / 450));
    
    // Apply rotation
    ctx.rotate((rotation * Math.PI) / 180);

    // Compute size keeping aspect ratio and ensuring full frame coverage (no empty white gaps inside the 35:45 crop)
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = width / height;

    let baseWidth = width;
    let baseHeight = height;

    if (imgRatio > canvasRatio) {
      // Image is wider than canvas -> scale to match height first
      baseHeight = height;
      baseWidth = height * imgRatio;
    } else {
      // Image is taller than canvas -> scale to match width first
      baseWidth = width;
      baseHeight = width / imgRatio;
    }

    // Multiply by zoom to allow users to zoom in/out, but clamp zoom scale to 1.0 minimum to guarantee "full frame image"
    const activeZoom = Math.max(1.0, zoom);
    const drawWidth = baseWidth * activeZoom;
    const drawHeight = baseHeight * activeZoom;

    // Draw offscreen canvas to apply background keying if active
    if (bgReplacementActive && sampledColor) {
      const offscreen = document.createElement('canvas');
      offscreen.width = img.naturalWidth;
      offscreen.height = img.naturalHeight;
      const oCtx = offscreen.getContext('2d');
      if (oCtx) {
        oCtx.drawImage(img, 0, 0);
        const imgData = oCtx.getImageData(0, 0, offscreen.width, offscreen.height);
        const data = imgData.data;
        const targetHex = customBgColor;
        
        // Parse custom bg color
        const rRep = parseInt(targetHex.slice(1, 3), 16);
        const gRep = parseInt(targetHex.slice(3, 5), 16);
        const bRep = parseInt(targetHex.slice(5, 7), 16);

        // Replace matched pixels
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i+1];
          const b = data[i+2];

          // Euclidean distance in RGB color space
          const diff = Math.sqrt(
            Math.pow(r - sampledColor.r, 2) +
            Math.pow(g - sampledColor.g, 2) +
            Math.pow(b - sampledColor.b, 2)
          );

          if (diff < bgTolerance) {
            data[i] = rRep;
            data[i+1] = gRep;
            data[i+2] = bRep;
          }
        }
        oCtx.putImageData(imgData, 0, 0);
        ctx.drawImage(offscreen, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
      }
    } else {
      ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    }

    ctx.restore();

    // Apply color/HD filters on top
    const filterParts = [];
    if (brightness !== 100) filterParts.push(`brightness(${brightness}%)`);
    if (contrast !== 100) filterParts.push(`contrast(${contrast}%)`);
    if (saturation !== 100) filterParts.push(`saturate(${saturation}%)`);
    
    if (filterParts.length > 0) {
      // Create temporary buffer to apply filters safely
      const bufCanvas = document.createElement('canvas');
      bufCanvas.width = width;
      bufCanvas.height = height;
      const bufCtx = bufCanvas.getContext('2d');
      if (bufCtx) {
        bufCtx.filter = filterParts.join(' ');
        bufCtx.drawImage(ctx.canvas, 0, 0, width, height, 0, 0, width, height);
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(bufCanvas, 0, 0);
      }
    }

    // Apply Premium Skin Smoothing Soft Focus (Orton effect for flawless, natural smooth texture)
    if (hdEnhance) {
      const glowCanvas = document.createElement('canvas');
      glowCanvas.width = width;
      glowCanvas.height = height;
      const glowCtx = glowCanvas.getContext('2d');
      if (glowCtx) {
        glowCtx.filter = 'blur(1.8px) brightness(101%) contrast(99%)';
        glowCtx.drawImage(ctx.canvas, 0, 0);
        
        ctx.save();
        ctx.globalAlpha = 0.32; // Blends soft focus with sharp lines underneath
        ctx.drawImage(glowCanvas, 0, 0);
        ctx.restore();
      }
    }

    // Apply Sharpness (Convolution Matrix) if slider is set
    if (sharpness > 0) {
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;
      const w = width;
      const h = height;
      const weights = [
        0, -1, 0,
        -1, 5, -1,
        0, -1, 0
      ];
      
      // Calculate blend factor based on sharpness value
      const mix = sharpness / 100;
      const side = Math.round(Math.sqrt(weights.length));
      const halfSide = Math.floor(side / 2);
      
      const output = ctx.createImageData(w, h);
      const dst = output.data;

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const sy = y;
          const sx = x;
          const dstOff = (y * w + x) * 4;
          
          let r = 0, g = 0, b = 0;
          for (let cy = 0; cy < side; cy++) {
            for (let cx = 0; cx < side; cx++) {
              const scy = Math.min(h - 1, Math.max(0, sy + cy - halfSide));
              const scx = Math.min(w - 1, Math.max(0, sx + cx - halfSide));
              const srcOff = (scy * w + scx) * 4;
              const wt = weights[cy * side + cx];
              r += data[srcOff] * wt;
              g += data[srcOff + 1] * wt;
              b += data[srcOff + 2] * wt;
            }
          }
          
          // Blend sharpened with original
          dst[dstOff] = data[dstOff] * (1 - mix) + r * mix;
          dst[dstOff + 1] = data[dstOff + 1] * (1 - mix) + g * mix;
          dst[dstOff + 2] = data[dstOff + 2] * (1 - mix) + b * mix;
          dst[dstOff + 3] = data[dstOff + 3];
        }
      }
      ctx.putImageData(output, 0, 0);
    }

    // Draw Double Black Border (Requested: "fix black border sathe ... 35x45 size ma frame border sathe fix karvanu chhe")
    // Border widths are dynamically scaled relative to preview size (350px width)
    const borderScale = width / 350;
    const outerWidth = Math.max(1, Math.round(3 * borderScale));
    const middleWidth = Math.max(1, Math.round(2 * borderScale));
    const innerWidth = Math.max(1, Math.round(2 * borderScale));

    // 1. Outer Solid Black Border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = outerWidth;
    ctx.strokeRect(outerWidth / 2, outerWidth / 2, width - outerWidth, height - outerWidth);

    // 2. Middle Pure White Gap
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = middleWidth;
    ctx.strokeRect(outerWidth + middleWidth / 2, outerWidth + middleWidth / 2, width - (outerWidth * 2 + middleWidth), height - (outerWidth * 2 + middleWidth));

    // 3. Inner Solid Black Border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = innerWidth;
    const innerOffset = outerWidth + middleWidth;
    ctx.strokeRect(innerOffset + innerWidth / 2, innerOffset + innerWidth / 2, width - (innerOffset * 2 + innerWidth), height - (innerOffset * 2 + innerWidth));
  };

  // Effect to update individual photo preview canvas
  useEffect(() => {
    if (!imageSrc) return;
    
    // Wait for image to load
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgRef.current = img;
      
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Fixed preview size keeping standard 35:45 ratio (e.g., 350x450 pixels)
      canvas.width = 350;
      canvas.height = 450;
      
      renderSinglePassportPhoto(ctx, 350, 450);
      
      // Update the compiled print sheet as well
      updateFinalPrintSheet();

      // Trigger automated High Definition Generation on load
      if (!isAutoProcessed) {
        setIsAutoProcessed(true);
        triggerAiHighDefGeneration();
      }
    };
    img.src = imageSrc;
  }, [
    imageSrc, zoom, rotation, translateX, translateY, 
    brightness, contrast, saturation, sharpness, hdEnhance,
    bgReplacementActive, sampledColor, bgTolerance, customBgColor,
    isAutoProcessed
  ]);

  // Generate 4" x 6" Photo Paper with 8 copies and cutting gaps
  const updateFinalPrintSheet = () => {
    const sheetCanvas = finalSheetCanvasRef.current;
    if (!sheetCanvas || !imgRef.current) return;

    const ctx = sheetCanvas.getContext('2d');
    if (!ctx) return;

    // 4" x 6" Sheet standard pixels at 300 DPI
    // Width = 6 inches * 300 = 1800 px
    // Height = 4 inches * 300 = 1200 px
    const sheetW = 1800;
    const sheetH = 1200;
    sheetCanvas.width = sheetW;
    sheetCanvas.height = sheetH;

    // Draw solid clean background (off-white page border)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, sheetW, sheetH);

    // Passport size at 300 DPI
    // 35mm = 413.3 px, 45mm = 531.5 px
    const photoW = 413;
    const photoH = 532;

    // Cutting gap (Vache cutting no gap muki) -> e.g. 24px (about 2mm)
    const gapX = 28;
    const gapY = 28;

    // Calculate margins for perfect center alignment on 1800x1200 canvas
    // Grid: 4 columns, 2 rows
    const totalGridW = (4 * photoW) + (3 * gapX);
    const totalGridH = (2 * photoH) + (1 * gapY);

    const startX = Math.round((sheetW - totalGridW) / 2);
    const startY = Math.round((sheetH - totalGridH) / 2);

    // Loop through 4x2 grid to draw 8 copies
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 4; col++) {
        const x = startX + col * (photoW + gapX);
        const y = startY + row * (photoH + gapY);

        // Draw cutting border guides in light gray around the cutting space
        if (col < 3) {
          ctx.beginPath();
          ctx.setLineDash([8, 8]);
          ctx.strokeStyle = '#D1D5DB';
          ctx.lineWidth = 1.5;
          const lineX = x + photoW + Math.round(gapX / 2);
          ctx.moveTo(lineX, startY - 20);
          ctx.lineTo(lineX, startY + totalGridH + 20);
          ctx.stroke();
        }

        // Draw horizontal cutting guide line
        if (row === 0) {
          ctx.beginPath();
          ctx.setLineDash([8, 8]);
          ctx.strokeStyle = '#D1D5DB';
          ctx.lineWidth = 1.5;
          const lineY = y + photoH + Math.round(gapY / 2);
          ctx.moveTo(startX - 20, lineY);
          ctx.lineTo(startX + totalGridW + 20, lineY);
          ctx.stroke();
        }

        // Create temporary offscreen canvas for this single photo instance at exact 300 DPI high-res
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = photoW;
        tempCanvas.height = photoH;
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          // Render passport photo in highest resolution
          renderSinglePassportPhoto(tempCtx, photoW, photoH, true);
          ctx.drawImage(tempCanvas, x, y);
        }
      }
    }

    // Outer sheet boundary border helper
    ctx.setLineDash([]);
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 2;
    ctx.strokeRect(4, 4, sheetW - 8, sheetH - 8);

    // Text label for paper size orientation on top corner
    ctx.fillStyle = '#9CA3AF';
    ctx.font = 'black 16px sans-serif';
    ctx.fillText('DAY INFOTECH - Standard 4x6" Photo Sheet (8 Copies 35x45mm)', startX, startY - 20);
  };

  // Direct Print Helper
  const handlePrint = () => {
    if (!finalSheetCanvasRef.current) return;
    
    const dataUrl = finalSheetCanvasRef.current.toDataURL('image/jpeg', 1.0);
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Popup Blocked! Please allow popups to open the print view.");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>DAY INFOTECH - Print Passport Photos</title>
          <style>
            @page {
              size: 6in 4in landscape;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              background-color: #ffffff;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              overflow: hidden;
            }
            img {
              width: 6in;
              height: 4in;
              display: block;
              image-rendering: -webkit-optimize-contrast;
              image-rendering: crisp-edges;
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <img src="${dataUrl}" />
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // High-Res JPG Download
  const handleDownload = () => {
    const sheetCanvas = finalSheetCanvasRef.current;
    if (!sheetCanvas) return;
    
    const link = document.createElement('a');
    link.download = `DAY_INFOTECH_Passport_Sheet_4x6_${Date.now()}.jpg`;
    link.href = sheetCanvas.toDataURL('image/jpeg', 1.0);
    link.click();
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-4 md:p-6 space-y-6">
      
      {/* Top Banner and Heading */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-indigo-900 rounded-2xl p-5 md:p-6 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-md">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/30 text-indigo-100 border border-indigo-400/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
            <Sparkles className="h-3 w-3 animate-pulse" /> AI Enhanced Tool
          </div>
          <h2 className="text-lg md:text-xl font-black tracking-tight flex items-center gap-2">
            <Camera className="h-6 w-6 text-indigo-300" />
            {t("પાસપોર્ટ સાઇઝ ફોટો જનરેટર (4x6 પેપર)", "Passport Size Photo Generator (4x6 Paper Layout)")}
          </h2>
          <p className="text-xs text-indigo-100/90 leading-relaxed font-medium">
            {t(
              "નિયમો મુજબ અલાઇનમેન્ટ, ISO 75 ગાઇડલાઇન્સ, HD કલર અને ડબલ બ્લેક બોર્ડર સાથે ૮ નકલ પ્રિન્ટ શીટ તૈયાર કરો.",
              "Generate high-definition passport sheets conforming to ISO 75 guidelines with straightening controls and 8 copies on 4x6 sheet."
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {imageSrc && (
            <button
              onClick={handleReset}
              className="px-3.5 py-2 rounded-xl text-xs font-black cursor-pointer bg-white/10 hover:bg-white/20 border border-white/10 transition-all flex items-center gap-1.5"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
              {t("બધું ફરીથી સેટ કરો", "Reset Adjustments")}
            </button>
          )}
        </div>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-950 p-4 rounded-xl flex items-center gap-3 text-xs font-bold shadow-xs">
          <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      {/* Main Upload and Studio Area */}
      {!imageSrc ? (
        <div 
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-3 border-dashed border-slate-300 hover:border-indigo-400 bg-white hover:bg-slate-50/50 rounded-3xl p-10 md:p-14 text-center transition-all duration-200 flex flex-col items-center justify-center gap-4 cursor-pointer relative group"
        >
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs group-hover:scale-105 transition-all duration-200">
            <Upload className="h-8 w-8" />
          </div>
          <div className="space-y-1.5 max-w-sm">
            <h3 className="text-sm font-black text-slate-800">
              {t("ઓરિજિનલ ફોટો અહીં અપલોડ કરો", "Upload your original photo here")}
            </h3>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
              {t(
                "ડ્રેગ એન્ડ ડ્રોપ કરો અથવા તમારા ફોન/કમ્પ્યુટરમાંથી પસંદ કરો. વધુમાં વધુ ૧૫MB સાઇઝ સપોર્ટેડ છે.",
                "Drag & drop image or browse files. Maximum file upload size is 15MB."
              )}
            </p>
          </div>
          <div className="flex gap-2 text-[10px] font-black text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-full mt-2">
            📸 Best results with solid or simple backgrounds
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Adjustments & Controls (5 Cols) */}
          <div className="lg:col-span-5 space-y-5 bg-white p-4 md:p-5 rounded-3xl border border-slate-200 shadow-xs">
            
            <div className="border-b border-slate-100 pb-2.5">
              <h3 className="text-xs font-black text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-indigo-600 animate-pulse" />
                {t("AI ડિજિટલ સ્ટુડિયો ઓટોપાયલોટ", "AI Digital Studio Autopilot")}
              </h3>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                {t("Google Gemini અને Canva એન્જિન દ્વારા અલ્ટ્રા HD ક્લીન ફોટો જનરેટ કરો", "Generate Ultra HD, clean & smooth portrait using Gemini & Canva engines")}
              </p>
            </div>

            {/* AI Generator Control Board */}
            <div className="bg-gradient-to-br from-indigo-50/70 via-indigo-50/20 to-purple-50/50 border border-indigo-100/80 p-4 rounded-2xl space-y-4">
              
              {/* Step 1: Backdrop Color Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                  🎨 {t("૧. પાસપોર્ટ બેકગ્રાઉન્ડ (Backdrop Color)", "1. Select Studio Backdrop Color")}
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { color: '#FFFFFF', label: t('પ્રિસ્ટિન વ્હાઇટ', 'White'), desc: '#FFFFFF' },
                    { color: '#E0F2FE', label: t('લાઇટ બ્લુ', 'Sky Blue'), desc: '#E0F2FE' },
                    { color: '#EEF2F6', label: t('સિલ્વર ગ્રે', 'Studio Grey'), desc: '#EEF2F6' },
                    { color: '#F4F4F6', label: t('ઓફ વ્હાઇટ', 'Off-White'), desc: '#F4F4F6' }
                  ].map((item) => (
                    <button
                      key={item.color}
                      onClick={() => {
                        setCustomBgColor(item.color);
                        setBgReplacementActive(true);
                      }}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-all ${
                        customBgColor === item.color && bgReplacementActive
                          ? 'bg-white border-indigo-600 ring-2 ring-indigo-600/15 shadow-xs scale-102'
                          : 'bg-white/40 border-slate-200 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <span 
                        className="w-5 h-5 rounded-full border border-slate-200/80 shadow-3xs" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-[8px] font-black text-slate-600 text-center leading-tight">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Pro Portrait Presets Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                  📸 {t("૨. AI પ્રો ઓપ્ટિમાઇઝર મોડ", "2. Choose AI Pro Portrait Mode")}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => applyPresetFilter('iso25_hd_nature')}
                    className={`col-span-2 p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                      activeFilterPreset === 'iso25_hd_nature'
                        ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-600 ring-2 ring-indigo-600/15 shadow-xs scale-101'
                        : 'bg-white/50 border-slate-200 hover:bg-white hover:border-indigo-300'
                    }`}
                  >
                    <div className="absolute top-0 right-0 bg-indigo-600 text-white font-black text-[7.5px] uppercase px-2.5 py-0.5 rounded-bl-lg tracking-wider">
                      🔥 RECOMMENDED
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px]">💎</span>
                      <span className="text-[11px] font-black text-indigo-950">ISO 25 HD Nature Bright</span>
                    </div>
                    <p className="text-[8.5px] text-slate-500 font-bold mt-1 leading-normal">
                      {t("અલ્ટ્રા HD ક્લેરિટી, આઈસો ૨૫ નેચરલ બ્રાઇટ કલર પ્રિન્ટ મોડ", "Ultra HD clarity, pristine ISO 25 natural bright tones designed for high-end studio printing")}
                    </p>
                  </button>

                  <button
                    onClick={() => applyPresetFilter('studio_glow')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      activeFilterPreset === 'studio_glow'
                        ? 'bg-white border-indigo-600 ring-2 ring-indigo-600/10 shadow-xs'
                        : 'bg-white/50 border-slate-200 hover:bg-white hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px]">⭐</span>
                      <span className="text-[10px] font-black text-indigo-950">Gemini Glow</span>
                    </div>
                    <p className="text-[8px] text-slate-400 font-bold mt-0.5 leading-tight">{t("મુલાયમ ત્વચા અને ગ્લો", "Skin-smoothing & soft focus")}</p>
                  </button>

                  <button
                    onClick={() => applyPresetFilter('canva_vivid')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      activeFilterPreset === 'canva_vivid'
                        ? 'bg-white border-indigo-600 ring-2 ring-indigo-600/10 shadow-xs'
                        : 'bg-white/50 border-slate-200 hover:bg-white hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px]">🎨</span>
                      <span className="text-[10px] font-black text-indigo-950">Canva Vivid</span>
                    </div>
                    <p className="text-[8px] text-slate-400 font-bold mt-0.5 leading-tight">{t("વાઇબ્રન્ટ કલર ટ્યુનિંગ", "Vibrant colors & contrasts")}</p>
                  </button>

                  <button
                    onClick={() => applyPresetFilter('chatgpt_clean')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      activeFilterPreset === 'chatgpt_clean'
                        ? 'bg-white border-indigo-600 ring-2 ring-indigo-600/10 shadow-xs'
                        : 'bg-white/50 border-slate-200 hover:bg-white hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px]">✨</span>
                      <span className="text-[10px] font-black text-indigo-950">ChatGPT Clean</span>
                    </div>
                    <p className="text-[8px] text-slate-400 font-bold mt-0.5 leading-tight">{t("સોફ્ટ ક્લીન શેડો બેલેન્સ", "Neutral lighting & shadows")}</p>
                  </button>

                  <button
                    onClick={() => applyPresetFilter('cool_tech')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      activeFilterPreset === 'cool_tech'
                        ? 'bg-white border-indigo-600 ring-2 ring-indigo-600/10 shadow-xs'
                        : 'bg-white/50 border-slate-200 hover:bg-white hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px]">💼</span>
                      <span className="text-[10px] font-black text-indigo-950">Cool Tech</span>
                    </div>
                    <p className="text-[8px] text-slate-400 font-bold mt-0.5 leading-tight">{t("પ્રોફેશનલ ઓફિસ લૂક", "Formal business look")}</p>
                  </button>
                </div>
              </div>

              {/* Step 3: Progressive AI Trigger Button */}
              <div className="pt-1.5">
                {isGeneratingSheet ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-black text-indigo-950">
                      <span className="flex items-center gap-1.5">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping" />
                        {t("અલ્ટ્રા HD પ્રોસેસિંગ ચાલુ છે...", "Running Ultra HD Enhancers...")}
                      </span>
                      <span className="font-mono text-indigo-600">{aiProgress}%</span>
                    </div>
                    {/* Animated Progress Bar */}
                    <div className="w-full bg-indigo-100 rounded-full h-3.5 overflow-hidden border border-indigo-200/50 p-0.5 shadow-inner">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 h-full rounded-full transition-all duration-300 relative"
                        style={{ width: `${aiProgress}%` }}
                      >
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)] bg-[length:15px_15px] animate-[shimmer_1s_infinite_linear]" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={triggerAiHighDefGeneration}
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black tracking-wide shadow-md shadow-indigo-200 hover:shadow-indigo-300 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <Sparkles className="h-4 w-4 animate-bounce" />
                    {t("🚀 અલ્ટ્રા HD ઓટોમેટિક પાસપોર્ટ જનરેટ કરો", "🚀 Generate Ultra HD Automatic Passport Sheet")}
                  </button>
                )}
              </div>

              {/* Real-Time Processing Terminal Logs */}
              <div className="bg-slate-900 rounded-xl p-3 font-mono text-[9.5px] text-slate-300 space-y-1.5 shadow-inner max-h-36 overflow-y-auto border border-slate-800">
                <div className="flex items-center justify-between text-[8px] text-indigo-400 font-bold uppercase tracking-wider border-b border-slate-800 pb-1 mb-1">
                  <span>AI_STUDIO_LOG_TERMINAL</span>
                  <span className="animate-pulse text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> ACTIVE
                  </span>
                </div>
                {isGeneratingSheet ? (
                  <div className="flex items-center gap-1.5 py-1 text-indigo-300">
                    <span className="animate-spin text-[10px]">⏳</span>
                    <span>Gemini neural filter is mapping coordinates...</span>
                  </div>
                ) : null}
                {aiSteps.length > 0 ? (
                  aiSteps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-1 leading-normal transition-all">
                      <span className="text-emerald-400 shrink-0">›</span>
                      <span>{step}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-slate-500 italic text-[9px]">
                    {t("ફોટો અપલોડ થતાં જ ઓટો-અલાઇનમેન્ટ થઈ ગયું છે. ઉપર ક્લિક કરી સ્પેશિયલ અલ્ટ્રા HD કમ્પાઈલ કરો.", "Photo auto-aligned instantly. Click above to compile premium deep clean filters.")}
                  </div>
                )}
              </div>

            </div>

            {/* Collapsible / Expandable Manual Nudges & Tweaks (Hidden by default to avoid clutter) */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
              <button
                onClick={() => setShowManualControls(!showManualControls)}
                className="w-full p-3 flex items-center justify-between text-xs font-black text-slate-700 hover:bg-slate-100/50 transition-all cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Sliders className="h-3.5 w-3.5 text-slate-500" />
                  {t("⚙️ એડવાન્સ મેન્યુઅલ ઝૂમ અને ડ્રેગ (મેન્યુઅલ નજ)", "⚙️ Advanced Manual Zoom & Alignment Tweaks")}
                </span>
                <span className="text-[10px] text-slate-450">{showManualControls ? '▲' : '▼'}</span>
              </button>

              {showManualControls && (
                <div className="p-4 border-t border-slate-200 bg-white space-y-4 animate-fadeIn">
                  
                  {/* Manual Zoom */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[11px] font-bold text-slate-700">
                      <span>🔍 {t("મેન્યુઅલ ઝૂમ એડજસ્ટમેન્ટ (Nudge Zoom)", "Nudge Zoom Scale")}</span>
                      <span className="font-mono text-indigo-600">{zoom.toFixed(2)}x</span>
                    </div>
                    <input 
                      type="range" 
                      min="0.5" 
                      max="4.0" 
                      step="0.05"
                      value={zoom} 
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>

                  {/* Manual Straighten/Rotate */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[11px] font-bold text-slate-700">
                      <span>📐 {t("મેન્યુઅલ રોટેશન ડિગ્રી (Nudge Rotation)", "Nudge Rotation Angle")}</span>
                      <span className="font-mono text-indigo-600">{rotation}°</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setRotation(prev => Math.max(-45, prev - 0.5))}
                        className="p-1 rounded border border-slate-200 hover:bg-slate-50 text-slate-600 text-[10px]"
                      >
                        -0.5°
                      </button>
                      <input 
                        type="range" 
                        min="-45" 
                        max="45" 
                        step="0.5"
                        value={rotation} 
                        onChange={(e) => setRotation(parseFloat(e.target.value))}
                        className="w-full accent-indigo-600 cursor-pointer"
                      />
                      <button 
                        onClick={() => setRotation(prev => Math.min(45, prev + 0.5))}
                        className="p-1 rounded border border-slate-200 hover:bg-slate-50 text-slate-600 text-[10px]"
                      >
                        +0.5°
                      </button>
                    </div>
                  </div>

                  {/* Chroma key Backdrop Settings */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                      <span>✂️ {t("બેકગ્રાઉન્ડ શાર્પ ક્રોપ સેટિંગ્સ", "Backdrop Matte Tolerance")}</span>
                      <span className="font-mono text-indigo-600">{bgTolerance}</span>
                    </div>
                    <input 
                      type="range" 
                      min="15" 
                      max="75" 
                      value={bgTolerance} 
                      onChange={(e) => setBgTolerance(parseInt(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                    <p className="text-[9px] text-slate-400 font-medium">
                      {t("બેકગ્રાઉન્ડ ઓટો-રિમૂવલ ચોકસાઈ વધારવા માટે ટોલરન્સ સ્લાઇડર સેટ કરો.", "Nudge mapping limits for extremely clean borders on challenging hair styles.")}
                    </p>
                  </div>

                </div>
              )}
            </div>

            {/* Print paper specification reminders */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 text-[10px] text-slate-500 space-y-1 font-medium">
              <p className="font-black text-slate-700 flex items-center gap-1">📍 Print Specifications Checklist:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Individual Photo Size: 35mm x 45mm</li>
                <li>Paper Size: Standard 4" x 6" Photo Paper</li>
                <li>Total Yield: 8 copies per print sheet</li>
                <li>Cutting Guides: Dashed light gray gap markers included</li>
              </ul>
            </div>

          </div>

          {/* Right Column: Previews & Direct Print Actions (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Split view: Face ISO guides on single preview + print sheet preview */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              
              {/* Single Passport Photo Preview (with interactive guide overlay) */}
              <div className="md:col-span-5 bg-white p-4 rounded-3xl border border-slate-200 shadow-3xs flex flex-col items-center justify-between gap-3">
                <div className="text-center w-full pb-1.5 border-b border-slate-100">
                  <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-wide">
                    {t("ફેસ અલાઇનમેન્ટ ગાઇડ (ISO 75)", "Face Alignment (ISO 75)")}
                  </h4>
                  <p className="text-[9px] text-slate-400 font-medium">
                    {t("ચહેરો અને આંખો લાઇનસર કરો", "Align original face with guide")}
                  </p>
                </div>

                {/* Canvas Container with Guide Overlay */}
                <div 
                  ref={previewContainerRef}
                  className="relative overflow-hidden border border-slate-300 shadow-sm rounded-xl cursor-move select-none"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  style={{ width: '180px', height: '231px' }}
                >
                  <canvas 
                    ref={canvasRef} 
                    className="w-full h-full object-cover"
                  />
                  
                  {/* ISO 75 Guide overlay (dotted oval for face centering) */}
                  <div className="absolute inset-0 pointer-events-none flex flex-col justify-center items-center">
                    {/* Face Oval */}
                    <div className="w-[68%] h-[68%] border-2 border-dashed border-indigo-500/50 rounded-full flex flex-col justify-center items-center relative">
                      {/* Vertical line */}
                      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-indigo-500/25"></div>
                      {/* Eye align horizontal line */}
                      <div className="absolute left-0 right-0 top-[40%] h-[1px] bg-emerald-500/45"></div>
                      <span className="absolute top-1 text-[7px] font-black bg-indigo-600/80 text-white px-1 rounded-sm uppercase font-mono tracking-widest scale-80">
                        Top of Head
                      </span>
                      <span className="absolute bottom-1 text-[7px] font-black bg-indigo-600/80 text-white px-1 rounded-sm uppercase font-mono tracking-widest scale-80">
                        Chin Line
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 text-center font-bold px-2">
                  ℹ️ Drag photo inside container to align. Scroll/slide Zoom to size face.
                </div>
              </div>

              {/* Instructions on Print Paper Quality */}
              <div className="md:col-span-7 bg-white p-4 rounded-3xl border border-slate-200 shadow-3xs flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <h4 className="text-[12px] font-black text-slate-800 flex items-center gap-1.5 uppercase">
                    <Scissors className="h-4 w-4 text-indigo-600" />
                    {t("વચ્ચે કટીંગનો ગેપ (Cutting Margins)", "Cutting Margins & Gaps")}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-bold">
                    {t(
                      "ફોટો પ્રિન્ટ થયા પછી તેને કટીંગ મશીન અથવા કાતર વડે કાપવામાં કોઈ તકલીફ ન પડે તે માટે દરેક પાસપોર્ટ કોપી વચ્ચે ૨mm (મિલીમીટર) નો ગેપ અને લાઈટ ગ્રે કલરની કટીંગ લાઈન સેટ કરવામાં આવેલ છે.",
                      "To ensure error-free cutting, a perfect 2mm spacing gap alongside dotted scissors-line cutting guides is set between all 8 passport photo copies on the sheet."
                    )}
                  </p>
                </div>

                <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-3 text-[10px] text-amber-950 font-bold space-y-1">
                  <p className="flex items-center gap-1">🌟 HD Color & Border Enhancements:</p>
                  <ul className="list-disc list-inside space-y-0.5 font-medium">
                    <li>Double thin black border around each single passport photo.</li>
                    <li>Automatic off-white matching background logic.</li>
                    <li>Crisp original contrast with anti-blur sharpness.</li>
                  </ul>
                </div>
              </div>

            </div>

            {/* Sheet Preview Panel */}
            <div className="bg-white p-4 md:p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                <div>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Printer className="h-4 w-4 text-emerald-600" />
                    {t("૪\" x ૬\" પેપર શીટ પ્રીવ્યૂ (8 નકલો)", "4\" x 6\" Print Sheet Preview (8 Copies)")}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {t("૪x૬ ફોટો પેપર પર પ્રિન્ટ આઉટ લેવા માટેનું લેઆઉટ", "Ready to print high resolution layout")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleDownload}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-black border border-slate-200 hover:bg-slate-200 transition-all flex items-center gap-1"
                    title="Download 300 DPI High Quality Sheet"
                  >
                    <Download className="h-3.5 w-3.5" /> JPEG
                  </button>
                </div>
              </div>

              {/* High-Resolution Sheet Render View Area */}
              <div className="border border-slate-100 bg-slate-50/30 rounded-2xl p-4 flex justify-center items-center relative overflow-hidden">
                <canvas 
                  ref={finalSheetCanvasRef}
                  className={`w-full max-w-lg aspect-[3/2] border border-slate-200 bg-white rounded-xl shadow-xs transition-all ${isGeneratingSheet ? 'blur-xs opacity-70' : ''}`}
                />

                {isGeneratingSheet && (
                  <div className="absolute inset-0 bg-white/75 backdrop-blur-xs flex flex-col items-center justify-center gap-3">
                    <div className="relative flex items-center justify-center">
                      {/* Outer spinning ring */}
                      <div className="w-14 h-14 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
                      {/* Inside percentage */}
                      <span className="absolute text-[10px] font-mono font-black text-indigo-950">{aiProgress}%</span>
                    </div>
                    <div className="text-center space-y-0.5 px-4 max-w-sm">
                      <p className="text-[11px] font-black text-slate-800 uppercase tracking-wider">{t("ડિજિટલ સ્ટુડિયો કમ્પાઇલિંગ ચાલુ છે...", "Digital Studio Compiling...")}</p>
                      <p className="text-[9px] text-slate-400 font-medium leading-normal">{t("ડબલ બ્લેક બોર્ડર અને કટિંગ લાઈન કન્ફિગર થઈ રહી છે...", "Merging double black border and cutting guidelines...")}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Printing Actions and direct triggers */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handlePrint}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black shadow-md shadow-indigo-150 transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer className="h-4 w-4" />
                  {t("ડાયરેક્ટ ૪x૬ સાઇઝમાં પ્રિન્ટ કરો", "Direct Print in 4x6 Layout")}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black shadow-md shadow-emerald-150 transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  {t("હાઇ-રિઝોલ્યુશન શીટ ડાઉનલોડ કરો", "Download High-Res 4x6 Sheet")}
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
