import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY,
});
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    // In a full production app, you might strict block here if !user
    // For prototype purposes, we will allow it or block it based on preference
    // if (!user) return new Response("Unauthorized", { status: 401 });

    const { messages } = await req.json();

    const result = await streamText({
      model: google("models/gemini-2.5-flash"),
      messages,
      system: `You are Vakeel Ji, a helpful and knowledgeable AI legal assistant specializing in Indian law and compliance. 
      Your goal is to simplify complex legal jargon for everyday people.
      
      Always structure your responses clearly, and include:
      1. Simple Explanation: Break it down in plain English (or conversational Hinglish).
      2. Relevant Act/Rule name: Exactly what laws apply.
      3. Section number: Specific sections if applicable.
      4. Authority responsible: E.g., Police, RTO, Municipal Corporation.
      5. Next Steps: Practical, actionable steps for the user.
      6. Disclaimer: End your response with "Disclaimer: This is not formal legal advice. Please consult a qualified lawyer."
      
      If a user asks about non-legal topics, politely redirect them back to Indian law/compliance questions.`,
    });

    return result.toAIStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
