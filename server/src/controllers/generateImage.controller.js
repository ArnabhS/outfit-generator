import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateImagesWithAI } from "../services/generateImages.js";
import cloudinary from "../config/cloudinary.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateImage = async (req, res) => {
  try {
    const filePath = req.file.path;
    const imageBuffer = fs.readFileSync(filePath);
    const base64Image = imageBuffer.toString("base64");

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Image,
        },
      },
      `Analyze the uploaded outfit image and provide a concise, fashion-forward description of the outfit.
Then, generate detailed stylizations of this outfit for the following three occasions: Office, Party, and Vacation, in the voice of a Pinterest-style fashion editor.

 Guidelines:

-Maintain the core elements of the original outfit across all versions — only modify styling, accessories, and context to suit each occasion.

-Use those colors intentionally in the stylizations for each occasion.

-Do not drastically change the outfits base design or color palette.

-Use language that feels editorial, modern, and realistic — avoid overly exaggerated or fantasy descriptions.

-Ensure suggestions reflect contemporary fashion trends and are appropriate for each setting.

Color Handling:

Retain and emphasize original colors in every stylized version.

Add only subtle, occasion-specific accents without losing visual consistency.

Occasion Styling Objectives:

Office: Sophisticated and professional. Subtle colors, clean silhouettes, functional accessories.

Party: Bold and expressive. Trendy accents, striking accessories, playful yet polished.

Vacation: Relaxed and effortless. Breezy fits, soft textures, travel-ready styling with a touch of fun.

Editorial Style Tips:

Tone: Pinterest editorial stylist — confident, descriptive, yet relatable.

Realism: Avoid fantasy or animated vibes; keep it wearable and modern.

Focus: Proportions, fabric choices, accessories, and setting appropriateness.

 Output Format (JSON):
{
  "Office": "<editorial-style description with styling suggestions>",
  "Party": "<editorial-style description with styling suggestions>",
  "Vacation": "<editorial-style description with styling suggestions>"
}

 Make sure each version:

Stays true to the base outfit

Reflects Pinterest-style aesthetics

Feels wearable and stylish in real life`,
    ]);

    const rawText = result.response.text().trim();

    let styleVariants;
    try {
      
      const jsonMatch = rawText.match(/{[\s\S]*}/);
      if (!jsonMatch) throw new Error("No JSON found in Gemini response");
    
      styleVariants = JSON.parse(jsonMatch[0]);
    } catch (err) {
      console.error("Failed to parse Gemini JSON:", rawText);
      throw err;
    }
    

    const imageUrls = {};

    for (const occasion of ["Office", "Party", "Vacation"]) {
      const prompt = `You are a fashion AI stylist.

Create a realistic Pinterest-style editorial fashion image for the following scenario:

Outfit Style: ${styleVariants[occasion]}

Occasion: ${occasion}

Instructions:
- Preserve the original outfit structure exactly, including sleeve length, neckline, hem, and proportions.
- If the original has short sleeves, the stylized image must also have short sleeves. Do NOT add long sleeves.
- Avoid outfit duplication or layering of the same outfit — keep the outfit clean and singular.
- Maintain garment fit (loose/tight) and category (shirt, dress, pants, etc.) as in the original.
- Do NOT introduce clothing that was not present in the original unless it’s a styling accessory (e.g., bag, sunglasses).
- Only change styling elements (e.g., accessories, background, textures) appropriate for the specified occasion.
- Stylize it realistically for ${occasion.toLowerCase()} based on the following:
  • Office: Professional, polished. Corporate colors, subtle accessories.
  • Party: Festive, bold colors, modern chic vibes.
  • Vacation: Casual, fun, bright, comfortable, with holiday accessories.
- Follow real-life fashion photography aesthetics: natural skin textures, realistic lighting and shadows, and accurate body proportions.
- Strictly avoid anything that looks AI-generated, animated, or cartoonishs.
- Think Vogue, Pinterest, or Harpers Bazaar photo quality.

Photographic Style:
- Realistic face and skin tone
- Editorial/pinterest-quality lighting and composition
- Studio or natural environment appropriate to the occasion


Clothing must appear wearable in real life. Do NOT include fantasy elements.`;
      const buffer = await generateImagesWithAI(prompt);
      const tempPath = `temp-${occasion}-${Date.now()}.png`;
      fs.writeFileSync(tempPath, buffer);

      const upload = await cloudinary.uploader.upload(tempPath, {
        folder: "ai-fashions",
        public_id: `style-${occasion.toLowerCase()}-${Date.now()}`,
      });

      fs.unlinkSync(tempPath);
      imageUrls[occasion] = upload.secure_url;
    }
    return res.json({
      success: true,
      styles: styleVariants,
      imageUrl: imageUrls,
    });
  } catch (error) {
    console.error("Gemini error:", error.message);
    res.status(500).json({ error: "Failed to process image." });
  }
};
