"use client";

import { ChevronDown, UserRound } from "lucide-react";
import { Candidate } from "../types";

interface CandidateSelectorProps {
  candidates: Candidate[];
  selectedCandidateId: string;
  onChange: (candidateId: string) => void;
}

export default function CandidateSelector({
  candidates,
  selectedCandidateId,
  onChange,
}: CandidateSelectorProps) {
  return (
    <div>
      <label
        htmlFor="candidate"
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        Select candidate
      </label>

      <div className="relative">
        <UserRound
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <select
          id="candidate"
          value={selectedCandidateId}
          onChange={(event) => onChange(event.target.value)}
          className="h-13 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-11 pr-11 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
        >
          {candidates.map((candidate) => (
            <option key={candidate.id} value={candidate.id}>
              {candidate.name}
            </option>
          ))}
        </select>

        <ChevronDown
          size={18}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>
    </div>
  );
}
