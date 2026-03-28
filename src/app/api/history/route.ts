import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  const user = await currentUser();
  
  // This is a mock response for the prototype. In production, this would query Prisma.
  return NextResponse.json({
    chats: [
      { id: "1", title: "Property dispute in Delhi", createdAt: new Date().toISOString() },
      { id: "2", title: "RTI filing procedure", createdAt: new Date(Date.now() - 86400000).toISOString() },
      { id: "3", title: "Traffic violation fine", createdAt: new Date(Date.now() - 172800000).toISOString() },
    ]
  });
}
