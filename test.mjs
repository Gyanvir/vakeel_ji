import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const match = env.match(/GOOGLE_GENERATIVE_AI_API_KEY=(.*)/);
if (!match) throw new Error("No API key found in .env.local");

const key = match[1].trim();
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

fetch(url)
  .then(res => res.json())
  .then(data => {
    if (data.error) {
       console.error("API Error:", data.error);
    } else {
       console.log("AVAILABLE MODELS:");
       data.models.filter(m => m.supportedGenerationMethods.includes("generateContent")).forEach(m => {
           console.log("- " + m.name);
       });
    }
  })
  .catch(err => console.error(err));
