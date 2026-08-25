import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));

// Lazy initializer for Gemini Client
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// API Endpoint 1: Generate Short-Form Video Storyboard (TikTok/Reels/Shorts)
app.post('/api/generate-storyboard', async (req, res) => {
  try {
    const {
      productName,
      productCategory,
      targetAudience,
      duration = '10 DETIK',
      orientation = '9:16 (VERTICAL)',
      style = 'tomkins_asmr',
      soundFocus = 'asmr',
      customPrompt = '',
    } = req.body;

    const ai = getGeminiClient();

    const promptText = `
You are an expert video director, social media content strategist, and storyboard creator for short-form video content (TikTok, Instagram Reels, YouTube Shorts).
Create a detailed, production-ready video storyboard based on the following product details:

Product Name: ${productName || 'Sepatu Sneakers Anak'}
Product Category: ${productCategory || 'Footwear'}
Target Audience: ${targetAudience || 'Orang tua / Anak Muda'}
Video Duration: ${duration}
Orientation: ${orientation}
Visual Style Preset: ${style} (Examples: 'tomkins_asmr' for ASMR close-up unboxing, 'tiny_world' for miniature construction diorama, 'ugc_vlog' for casual selfie UGC with subtitles, 'product_feature' for step-by-step feature breakdown).
Sound Focus: ${soundFocus} (ASMR, Voiceover, Music, Ambient)
Additional Guidance: ${customPrompt}

Produce a complete Indonesian language storyboard JSON object matching this strict structure:
- title: Uppercase main storyboard header (e.g. "STORYBOARD VIDEO 10 DETIK - TOMKINS SEPATU ANAK TK")
- subtitle: Engaging headline / tagline
- productName: Name of product
- productCategory: Category
- durationTotal: Total duration string (e.g. "10 DETIK")
- durationSeconds: Total seconds integer (e.g. 10)
- orientation: Video ratio (e.g. "9:16 (VERTICAL)")
- aspectRatio: "9:16", "16:9", or "1:1"
- targetAudience: Audience description
- style: Style key string
- vibe: Visual atmosphere keywords
- difficultyRating: Integer 1 to 5
- scenes: Array of exact scene items (number of scenes should fit the duration, e.g. 8-10 scenes for 10s video, 12-15 for 15s video):
  - sceneNumber: 1, 2, 3...
  - title: Short 2-4 word uppercase scene title (e.g. "BUKA BOX", "UNBOXING", "CLOSE UP DETAIL")
  - timestamp: Time range string (e.g. "0:00 - 0:01")
  - durationSeconds: Seconds float or integer (e.g. 1)
  - visualDescription: Clear description of visual frame, subjects, lighting, and placement.
  - visualPrompt: Detailed English image generation prompt for realistic photography of this scene.
  - textOnScreen: Text overlay banner if any, or "-"
  - cameraDirection: Specific camera shot, movement, angle, or lens type (e.g. "Macro close-up, 360 rotation")
  - soundDirection: Specific sound / SFX / ASMR focus (e.g. "Suara velcro direkatkan", "Suara kertas kresek lembut")
  - microAction: Human hand action or subject movement details
  - dialogSubtitle: (Optional) Spoken subtitle dialog if UGC vlog style
- continuityRules: 4-6 bullet rules for visual continuity (colors, lighting, outfits, models)
- transitions: List of transitions between scenes (e.g. "1 -> 2: Cut", "7 -> 8: Match Cut")
- asmrDetails: 4-6 bullet sound effect directions
- productionNotes: Camera, FPS, lighting, and resolution recommendations
- finalVisual: Summary of closing sequence and call-to-action
- creatorTips: 3-5 practical tips for content creators executing this shoot.

Return ONLY JSON.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            subtitle: { type: Type.STRING },
            productName: { type: Type.STRING },
            productCategory: { type: Type.STRING },
            durationTotal: { type: Type.STRING },
            durationSeconds: { type: Type.INTEGER },
            orientation: { type: Type.STRING },
            aspectRatio: { type: Type.STRING },
            targetAudience: { type: Type.STRING },
            style: { type: Type.STRING },
            vibe: { type: Type.STRING },
            difficultyRating: { type: Type.INTEGER },
            scenes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sceneNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  timestamp: { type: Type.STRING },
                  durationSeconds: { type: Type.NUMBER },
                  visualDescription: { type: Type.STRING },
                  visualPrompt: { type: Type.STRING },
                  textOnScreen: { type: Type.STRING },
                  cameraDirection: { type: Type.STRING },
                  soundDirection: { type: Type.STRING },
                  microAction: { type: Type.STRING },
                  dialogSubtitle: { type: Type.STRING },
                },
                required: ['sceneNumber', 'title', 'timestamp', 'visualDescription', 'cameraDirection'],
              },
            },
            continuityRules: { type: Type.ARRAY, items: { type: Type.STRING } },
            transitions: { type: Type.ARRAY, items: { type: Type.STRING } },
            asmrDetails: { type: Type.ARRAY, items: { type: Type.STRING } },
            productionNotes: { type: Type.ARRAY, items: { type: Type.STRING } },
            finalVisual: { type: Type.STRING },
            creatorTips: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['title', 'productName', 'scenes'],
        },
      },
    });

    const jsonText = response.text || '{}';
    const storyboardData = JSON.parse(jsonText);
    storyboardData.id = 'gen-' + Date.now();

    res.json({ success: true, storyboard: storyboardData });
  } catch (error: unknown) {
    console.error('Error generating storyboard:', error);
    const errMessage = error instanceof Error ? error.message : 'Failed to generate storyboard';
    res.status(500).json({ success: false, error: errMessage });
  }
});

// API Endpoint 2: Generate Scene Image Frame (using Gemini Image Gen)
app.post('/api/generate-scene-image', async (req, res) => {
  try {
    const { prompt, aspectRatio = '9:16' } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt is required' });
    }

    const ai = getGeminiClient();

    // Mapping aspectRatio to valid Gemini values ("1:1", "3:4", "4:3", "9:16", "16:9")
    let targetRatio = '9:16';
    if (aspectRatio === '1:1') targetRatio = '1:1';
    if (aspectRatio === '16:9') targetRatio = '16:9';
    if (aspectRatio === '4:5' || aspectRatio === '3:4') targetRatio = '3:4';

    const imageResponse = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [
          {
            text: `High quality vertical video frame photography, product commercial storyboard, cinematic lighting: ${prompt}`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: targetRatio,
        },
      },
    });

    let imageUrl = '';
    if (imageResponse.candidates?.[0]?.content?.parts) {
      for (const part of imageResponse.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          const mime = part.inlineData.mimeType || 'image/png';
          imageUrl = `data:${mime};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!imageUrl) {
      throw new Error('No image generated from Gemini model.');
    }

    res.json({ success: true, imageUrl });
  } catch (error: unknown) {
    console.error('Image generation error:', error);
    // Fallback: Return curated high quality unsplash image if API key is restricted or fails
    const fallbackImage = 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=600&q=80';
    res.json({
      success: true,
      imageUrl: fallbackImage,
      isFallback: true,
      note: 'Using curated photorealistic frame fallback',
    });
  }
});

// API Endpoint 3: Generate Lookbook Showcase
app.post('/api/generate-lookbook', async (req, res) => {
  try {
    const { items = [], model, theme = 'Original Bedroom Daylight', cameraAngle = 'Medium Shot', aspectRatio = '9:16' } = req.body;

    const ai = getGeminiClient();

    const promptText = `
You are a high-fashion lookbook photoshoot director and AI product showcase creator.
Given these lookbook items:
${JSON.stringify(items, null, 2)}
Model preferences: ${JSON.stringify(model || {}, null, 2)}
Theme: ${theme}
Camera Angle: ${cameraAngle}
Aspect Ratio: ${aspectRatio}

Generate a collection of 6 distinct photoshoot shot concepts for a product showcase grid.
Return JSON matching:
{
  "title": "Title of lookbook showcase",
  "shots": [
    {
      "id": "shot-1",
      "title": "Pose / Angle Name",
      "angle": "Camera Angle",
      "pose": "Model Pose description in Indonesian",
      "lighting": "Lighting setup in Indonesian",
      "prompt": "Detailed English image generation prompt"
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const jsonText = response.text || '{}';
    const lookbookData = JSON.parse(jsonText);

    res.json({ success: true, lookbook: lookbookData });
  } catch (error: unknown) {
    console.error('Error generating lookbook:', error);
    const errMessage = error instanceof Error ? error.message : 'Failed to generate lookbook';
    res.status(500).json({ success: false, error: errMessage });
  }
});

// Serve frontend / Vite setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer();
