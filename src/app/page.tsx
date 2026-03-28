import Link from "next/link";
import { ArrowRight, Scale } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 text-slate-900 px-4">
      <main className="flex flex-col items-center text-center max-w-3xl space-y-8">
        <div className="flex items-center justify-center h-20 w-20 rounded-2xl bg-slate-900 text-slate-50 shadow-sm mb-4">
          <Scale size={40} />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900">
          Vakeel Ji.
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-600 font-medium leading-relaxed">
          Your AI legal assistant for India. <br className="hidden md:block" />
          Understand laws, rights, and compliance documentation simply.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full justify-center">
          <Link 
            href="/chat" 
            className="group flex h-14 items-center justify-center gap-2 rounded-full bg-slate-900 px-8 text-lg font-medium text-slate-50 hover:bg-slate-800 transition-colors"
          >
            Start Chatting
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </main>

      <footer className="absolute bottom-8 text-sm text-slate-500">
        This is an AI assistant, not formal legal advice.
      </footer>
    </div>
  );
}
