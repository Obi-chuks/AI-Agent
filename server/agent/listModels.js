import 'dotenv/config';

async function listModels() {
  const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models?key=" + process.env.GOOGLE_API_KEY);
  const data = await res.json();
  console.log("Raw response:", data);
}

listModels();
