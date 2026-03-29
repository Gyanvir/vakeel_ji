"use client";

import { use, useRef, useEffect } from "react";
// @ts-ignore
import { useChat } from "ai/react";
import { Send, Paperclip, Bot, User, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatPage({ params }: { params: Promise<{ chatId: string }> }) {
  const { chatId } = use(params);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    id: chatId,
    body: {
      chatId,
    },
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: "Namaste! I am Vakeel Ji, your AI legal assistant. How can I help you understand Indian laws or compliance today?",
      },
    ],
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto w-full p-4 md:p-8 space-y-6">
        <div className="max-w-3xl mx-auto space-y-8">
          {messages.map((m) => (
            <div key={m.id} className="flex gap-4">
              <div
                className={`flex shrink-0 h-8 w-8 items-center justify-center rounded-lg ${
                  m.role === "assistant" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                {m.role === "assistant" ? <Bot size={18} /> : <User size={18} />}
              </div>
              <div className="flex-1 space-y-2 pt-1">
                <div className="font-semibold text-slate-900 text-sm">
                  {m.role === "assistant" ? "Vakeel Ji" : "You"}
                </div>
                <div className="text-slate-700 leading-relaxed max-w-[85%] prose prose-sm prose-slate max-w-none prose-p:leading-relaxed prose-pre:bg-slate-800 prose-pre:text-slate-100">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {String((m as any).content || (m as any).text || "")}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <div className="flex shrink-0 h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
                <Loader2 size={18} className="animate-spin" />
              </div>
              <div className="flex-1 space-y-2 pt-1">
                <div className="font-semibold text-slate-900 text-sm">Vakeel Ji</div>
                <div className="text-slate-500 text-sm">Drafting response...</div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="w-full bg-gradient-to-t from-white via-white to-transparent pb-6 pt-10 px-4 md:px-8 shrink-0">
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto relative flex items-center shadow-sm border border-slate-200 rounded-2xl bg-slate-50 overflow-hidden focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-400 transition-all"
        >
          <button
            type="button"
            className="p-3 text-slate-400 hover:text-slate-600 transition-colors shrink-0 ml-1"
            title="Upload Document"
          >
            <Paperclip size={20} />
          </button>
          
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about Indian laws, compliance, or upload a document..."
            className="flex-1 bg-transparent py-4 px-2 outline-none text-slate-900 placeholder:text-slate-400"
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 mr-2 text-white bg-slate-900 rounded-xl hover:bg-slate-800 disabled:bg-slate-300 disabled:text-slate-500 transition-colors shrink-0"
          >
            <Send size={18} />
          </button>
        </form>
        <div className="text-center text-xs text-slate-400 mt-3 font-medium">
          Vakeel Ji can make mistakes. Verify important information.
        </div>
      </div>
    </div>
  );
}
