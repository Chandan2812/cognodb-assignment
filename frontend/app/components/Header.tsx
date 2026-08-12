import { Network, Sparkles } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
            <Network size={21} />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-950">
              TalentGraph
            </h1>

            <p className="hidden text-xs text-slate-500 sm:block">
              Graph-powered talent discovery
            </p>
          </div>
        </div>

        <a
          href="#graph-explorer"
          className="hidden items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:flex"
        >
          <Sparkles size={16} />
          Graph Explorer
        </a>
      </div>
    </header>
  );
}
