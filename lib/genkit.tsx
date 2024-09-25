import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI("AIzaSyCVYMvzIXC4DjoVxxnp4AVGr-3HAQo2YH8");

async function run(prompt: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent([prompt]);
  console.log(result.response.text());
}

export { run };
