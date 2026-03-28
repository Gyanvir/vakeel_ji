"use client";

import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { ChevronDown, MapPin } from "lucide-react";

const STATES = [
  "Delhi",
  "Maharashtra",
  "Karnataka",
  "Tamil Nadu",
  "Uttar Pradesh",
  "Gujarat",
  "West Bengal", // Add more as needed
];

export function Topbar() {
  const [selectedState, setSelectedState] = useState("Delhi");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shrink-0">
      <div className="flex items-center">
        {/* Jurisdiction Selector */}
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <MapPin size={16} className="text-slate-400" />
            {selectedState}
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute top-full mt-1 w-48 rounded-lg border border-slate-200 bg-white shadow-lg py-1 z-10">
              <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                Select Jurisdiction
              </div>
              <div className="max-h-64 overflow-y-auto">
                {STATES.map((s) => (
                  <button
                    key={s}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 ${
                      selectedState === s ? "bg-slate-50 text-slate-900 font-medium" : "text-slate-600"
                    }`}
                    onClick={() => {
                      setSelectedState(s);
                      setDropdownOpen(false);
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* User Account / Settings */}
        <UserButton />
      </div>
    </header>
  );
}
