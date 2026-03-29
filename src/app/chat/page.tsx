import { redirect } from "next/navigation";
import crypto from "crypto";

export default function ChatRoot() {
  const id = crypto.randomUUID();
  redirect(`/chat/${id}`);
}
