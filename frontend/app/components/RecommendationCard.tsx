import { CheckCircle2, MapPin, Sparkles } from "lucide-react";

import { Recommendation } from "../types";

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export default function RecommendationCard({
  recommendation,
}: RecommendationCardProps) {
  const percentage = recommendation.matchPercentage;

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg sm:p-6">
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white">
              <Sparkles size={19} />
            </div>

            <div className="min-w-0">
              <h3 className="text-lg font-bold text-slate-950">
                {recommendation.job}
              </h3>

              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={14} />
                  {recommendation.location}
                </span>

                <span>{recommendation.employmentType}</span>
              </div>
            </div>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
            {recommendation.description}
          </p>
        </div>

        {/* Match Score */}

        <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:gap-1">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-slate-100">
            <span className="text-sm font-bold text-slate-950">
              {percentage}%
            </span>
          </div>

          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Match
          </span>
        </div>
      </div>

      {/* ==================================================
          SKILL MATCH
      ================================================== */}

      <div className="mt-6 border-t border-slate-100 pt-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Skill match
          </p>

          <p className="text-xs font-semibold text-slate-500">
            {recommendation.matchedSkillCount}/
            {recommendation.totalRequiredSkills} skills
          </p>
        </div>

        {/* Progress */}

        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-slate-900 transition-all duration-700"
            style={{
              width: `${Math.min(percentage, 100)}%`,
            }}
          />
        </div>

        {/* Matched Skills */}

        <div className="mt-4 flex flex-wrap gap-2">
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

      {/* ==================================================
          WHY THIS MATCH
      ================================================== */}

      <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4">
        <div className="flex items-center gap-2">
          <Sparkles size={15} className="text-slate-500" />

          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Why this match?
          </p>
        </div>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          This opportunity matches{" "}
          <span className="font-bold text-slate-900">
            {recommendation.matchedSkillCount}
          </span>{" "}
          of{" "}
          <span className="font-bold text-slate-900">
            {recommendation.totalRequiredSkills}
          </span>{" "}
          required skills based on the candidate's graph connections.
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="rounded-lg bg-white px-2.5 py-2 text-slate-700 shadow-sm">
            Candidate
          </span>

          <span className="text-slate-400">→</span>

          <span className="rounded-lg bg-white px-2.5 py-2 text-slate-700 shadow-sm">
            HAS_SKILL
          </span>

          <span className="text-slate-400">→</span>

          <span className="rounded-lg bg-white px-2.5 py-2 text-slate-700 shadow-sm">
            {recommendation.matchedSkillCount} matched skills
          </span>

          <span className="text-slate-400">→</span>

          <span className="rounded-lg bg-white px-2.5 py-2 text-slate-700 shadow-sm">
            REQUIRES
          </span>

          <span className="text-slate-400">→</span>

          <span className="rounded-lg bg-white px-2.5 py-2 text-slate-700 shadow-sm">
            {recommendation.job}
          </span>
        </div>
      </div>

      {/* ==================================================
          FOOTER
      ================================================== */}

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <div>
          <p className="text-xs text-slate-400">Employment</p>

          <p className="mt-1 text-sm font-semibold text-slate-700">
            {recommendation.employmentType}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-slate-400">Salary</p>

          <p className="mt-1 text-sm font-bold text-slate-900">
            ₹{recommendation.salary.toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </article>
  );
}
