import { GoogleGenerativeAI } from "@google/generative-ai";
import KEY from "../constants/gemini_api";

const genAI = new GoogleGenerativeAI(KEY);

async function run(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([prompt]);

    // Extracting the text from the response and returning it
    const generatedText = result?.response?.text();
    if (!generatedText) throw new Error("No content generated");

    return generatedText;
  } catch (error) {
    console.error("Error during content generation:", error);
    throw error;
  }
}

export { run };
