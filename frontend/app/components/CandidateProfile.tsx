import { BriefcaseBusiness, Mail, MapPin, UserRound } from "lucide-react";
import { Candidate } from "../types";

interface CandidateProfileProps {
  candidate: Candidate;
}

export default function CandidateProfile({ candidate }: CandidateProfileProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-lg font-bold text-white">
          {candidate.name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()}
        </div>

        <div className="min-w-0">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Candidate
          </p>

          <h2 className="truncate text-xl font-bold text-slate-950">
            {candidate.name}
          </h2>
        </div>
      </div>

      <div className="space-y-3 text-sm text-slate-600">
        <div className="flex items-center gap-3">
          <BriefcaseBusiness size={17} className="text-slate-400" />

          <span>{candidate.experience} years experience</span>
        </div>

        <div className="flex items-center gap-3">
          <MapPin size={17} className="text-slate-400" />

          <span>{candidate.location}</span>
        </div>

        <div className="flex items-center gap-3">
          <Mail size={17} className="text-slate-400" />

          <span className="truncate">{candidate.email}</span>
        </div>
      </div>
    </section>
  );
}
