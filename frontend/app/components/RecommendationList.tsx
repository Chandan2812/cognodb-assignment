import { Sparkles } from "lucide-react";

import RecommendationCard from "./RecommendationCard";
import { Recommendation } from "../types";

interface RecommendationListProps {
  recommendations: Recommendation[];
  loading?: boolean;
}

export default function RecommendationList({
  recommendations,
  loading = false,
}: RecommendationListProps) {
  return (
    <section>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Sparkles size={17} className="text-slate-500" />

            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Graph recommendations
            </span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-950">
            Recommended opportunities
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Jobs ranked by matching candidate skills.
          </p>
        </div>

        {!loading && (
          <span className="hidden rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 sm:block">
            {recommendations.length} matches
          </span>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-64 animate-pulse rounded-2xl bg-slate-100"
            />
          ))}
        </div>
      ) : recommendations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
          <p className="font-semibold text-slate-800">
            No matching opportunities found.
          </p>

          <p className="mt-1 text-sm text-slate-500">Try another candidate.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((recommendation) => (
            <RecommendationCard
              key={recommendation.jobId}
              recommendation={recommendation}
            />
          ))}
        </div>
      )}
    </section>
  );
}
