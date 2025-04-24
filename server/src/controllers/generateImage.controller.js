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
      `Describe this outfit. Then suggest detailed fashion stylizations for the same outfit for three occasions: Office, Party, and Vacation — in the tone of a Pinterest editorial stylist. Format output as JSON with keys "Office", "Party", and "Vacation".`,
    ]);

    const rawText = result.response.text().trim();

    let styleVariants;
    try {
      styleVariants = JSON.parse(rawText);
    } catch (err) {
      const fixed = rawText.replace(/```(json)?/g, "");
      styleVariants = JSON.parse(fixed);
    }

    const imageUrls = {};

    for (const occasion of ["Office", "Party", "Vacation"]) {
      const prompt = `Create a Pinterest-style editorial fashion image for the following style: ${styleVariants[occasion]}`;
      const buffer = await generateImagesWithAI(prompt);
      const tempPath = `temp-${occasion}-${Date.now()}.png`;
      fs.writeFileSync(tempPath, buffer);

      const upload = await cloudinary.uploader.upload(tempPath, {
        folder: "ai-fashions",
        public_id: `style-${occasion.toLowerCase()}-${Date.now()}`
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
