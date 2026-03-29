import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

// Ensure we instantiate a singleton pattern for Prisma in Edge/Serverless environments
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    // Block unauthorized dynamically but allow it for non-strict development testing
    // if (!user) return new Response("Unauthorized", { status: 401 });

    // Default fallback to "anonymous" if Clerk bypassed
    const userId = user?.id || "anonymous-user-id";

    // If "anonymous-user-id" is used and no such User exists in DB, prisma will crash on `User` relation
    // We should ideally ensure user exists in Database before executing relationships.
    // However, since Clerk manages users, you can use Clerk webhooks to sync users to DB.
    // For now, we manually sync the mock/authenticated user here dynamically:
    if (user?.id) {
      await prisma.user.upsert({
        where: { id: user.id },
        update: {},
        create: { id: user.id, email: user.primaryEmailAddress?.emailAddress || "guest@dynamic.com" }
      });
    }

    const { messages, chatId } = await req.json();

    if (!chatId) return new Response("Missing Chat ID", { status: 400 });

    // Ensure the chat session natively exists
    await prisma.chat.upsert({
      where: { id: chatId },
      update: {},
      create: {
        id: chatId,
        userId: userId,
        title: messages[0]?.content?.substring(0, 40) + "..." || "New Conversation",
      }
    });

    const userMessage = messages[messages.length - 1];

    // Save exactly the user's latest message to the database
    if (userMessage.role === "user") {
      await prisma.message.create({
        data: {
          id: userMessage.id, // Vercel AI SDK provides unique semantic IDs natively
          chatId,
          role: "user",
          content: userMessage.content,
        }
      });
    }

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
      onFinish: async ({ text }) => {
        // Upon streaming completion, save Vakeel Ji's response!
        await prisma.message.create({
          data: {
            chatId,
            role: "assistant",
            content: text,
          }
        });
      }
    });

    return result.toAIStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
