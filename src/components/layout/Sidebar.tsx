"use client";

import Link from "next/link";
import { MessageSquare, Plus, Scale, Settings } from "lucide-react";

export function Sidebar() {
  const dummyChats = [
    { id: "1", title: "Property dispute in Delhi" },
    { id: "2", title: "RTI filing procedure" },
    { id: "3", title: "Traffic violation fine" },
  ];

  return (
    <div className="flex h-full w-64 flex-col border-r border-slate-200 bg-slate-50/50">
      <div className="flex h-16 items-center px-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
            <Scale size={18} />
          </div>
          <span className="font-semibold text-slate-900">Vakeel Ji.</span>
        </div>
      </div>

      <div className="p-4">
        <Link
          href="/chat"
          className="flex w-full items-center gap-2 rounded-lg bg-white border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50 transition-colors"
        >
          <Plus size={16} />
          New Chat
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
          Recent
        </div>
        <div className="flex flex-col gap-1">
          {dummyChats.map((chat) => (
            <Link
              key={chat.id}
              href={`/chat/${chat.id}`}
              className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-600 hover:bg-slate-100 transition-colors truncate"
            >
              <MessageSquare size={16} className="shrink-0 text-slate-400" />
              <span className="truncate">{chat.title}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-200 p-4">
        <button className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-600 hover:bg-slate-100 transition-colors">
          <Settings size={18} />
          Settings
        </button>
      </div>
    </div>
  );
}
