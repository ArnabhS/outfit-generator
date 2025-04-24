import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";


import { generateImagesWithAI } from "../services/generateImages.js";
import path from "path";

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
  
      // ✅ Structure contents like the Gemini format
      const contents =
        `Create a Pinterest-style, editorial fashion image of the outfit: ` +
        `\nOffice: ${styleVariants.Office}\n` +
        `Party: ${styleVariants.Party}\n` +
        `Vacation: ${styleVariants.Vacation}`;
  
      const buffer = await generateImagesWithAI(contents);
  
      

      // Save image to public/images
      const fileName = `gemini-style-${Date.now()}.png`;
      const outputPath = path.join("public", "images", fileName);
      fs.writeFileSync(outputPath, buffer);
  
      const imageUrl = `/images/${fileName}`;
  
      return res.json({
        success: true,
        styles: styleVariants,
        imageUrl,
      });
    } catch (error) {
      console.error(" Gemini error:", error.message);
      res.status(500).json({ error: "Failed to process image." });
    }
  };
  
