import { GoogleGenAI, Modality } from "@google/genai";
import * as fs from "node:fs";
import { Buffer } from "node:buffer";


export async function generateImagesWithAI(contents) {

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

 

  // Set responseModalities to include "Image" so the model can generate  an image
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-exp-image-generation",
    contents: contents,
    config: {
      responseModalities: [Modality.TEXT, Modality.IMAGE],
    },
  });
  for (const part of response.candidates[0].content.parts) {
   
    if (part.text) {
      console.log(part.text);
    } else if (part.inlineData) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, "base64");
      fs.writeFileSync("gemini-native-image.png", buffer);
      console.log("Image saved as gemini-native-image.png");
      return buffer;
      
    }
  }
  
}

