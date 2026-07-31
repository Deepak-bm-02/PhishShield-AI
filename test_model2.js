const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function testModel(modelName) {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent("Hello. Respond with OK.");
    const response = await result.response;
    console.log(`[PASS] ${modelName}: ${response.text()}`);
  } catch (error) {
    console.log(`[FAIL] ${modelName}:`, error.message);
  }
}

async function run() {
  await testModel('gemini-1.5-flash');
  await testModel('gemini-1.5-flash-8b');
  await testModel('gemini-1.5-pro');
  await testModel('gemini-2.0-flash');
}
run();
