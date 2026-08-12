import { ArrowUpRight, Building2, CheckCircle2, MapPin } from "lucide-react";
import { Recommendation } from "../types";

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export default function RecommendationCard({
  recommendation,
}: RecommendationCardProps) {
  const percentage = recommendation.matchPercentage;

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white">
              <Building2 size={19} />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-950">
                {recommendation.job}
              </h3>

              <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                <MapPin size={14} />
                {recommendation.location}
              </div>
            </div>
          </div>

          <p className="max-w-2xl text-sm leading-6 text-slate-600">
            {recommendation.description}
          </p>
        </div>

        <div className="shrink-0">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-slate-100">
            <span className="text-sm font-bold text-slate-950">
              {percentage}%
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Skill match
          </p>

          <p className="text-xs font-semibold text-slate-500">
            {recommendation.matchedSkillCount}/
            {recommendation.totalRequiredSkills} skills
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {recommendation.matchedSkills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700"
            >
              <CheckCircle2 size={13} />
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400">Employment</p>

          <p className="mt-1 text-sm font-semibold text-slate-700">
            {recommendation.employmentType}
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition group-hover:bg-slate-800"
        >
          View details
          <ArrowUpRight size={16} />
        </button>
      </div>
    </article>
  );
}
