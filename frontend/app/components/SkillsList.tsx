import { Code2 } from "lucide-react";
import { Candidate } from "../types";

interface SkillsListProps {
  candidate: Candidate;
}

export default function SkillsList({ candidate }: SkillsListProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Candidate graph
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-950">Skills</h2>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
          <Code2 size={19} className="text-slate-700" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {candidate.skills?.map((skill) => (
          <div
            key={skill.id}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
          >
            <p className="text-sm font-semibold text-slate-800">{skill.name}</p>

            {skill.proficiency && (
              <p className="mt-0.5 text-xs text-slate-500">
                {skill.proficiency}
                {skill.years !== undefined && ` · ${skill.years}y`}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
