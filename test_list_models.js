const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("NO API KEY LOADED!");
  process.exit(1);
}
// Note: GoogleGenerativeAI in 0.21.0 might not expose listModels directly.
// We can just fetch via native fetch.
async function listModels() {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await res.json();
    console.log("AVAILABLE MODELS:", data.models?.map(m => m.name));
  } catch(e) {
    console.error(e);
  }
}
listModels();
