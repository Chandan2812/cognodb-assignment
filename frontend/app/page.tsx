"use client";

import { useEffect, useState } from "react";
import { Candidate, CandidateGraph, Recommendation } from "./types";
import {
  getCandidate,
  getCandidateGraph,
  getCandidates,
  getRecommendations,
} from "./lib/api";
import Header from "./components/Header";
import CandidateSelector from "./components/CandidateSelector";
import CandidateProfile from "./components/CandidateProfile";
import SkillsList from "./components/SkillsList";
import RecommendationList from "./components/RecommendationList";
import GraphExplorer from "./components/GraphExplorer";

export default function Home() {
  // --------------------------------------------------
  // Candidates
  // --------------------------------------------------

  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const [selectedCandidateId, setSelectedCandidateId] = useState("");

  // --------------------------------------------------
  // Selected candidate
  // --------------------------------------------------

  const [candidate, setCandidate] = useState<Candidate | null>(null);

  // --------------------------------------------------
  // Recommendations
  // --------------------------------------------------

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  // --------------------------------------------------
  // Graph
  // --------------------------------------------------

  const [graph, setGraph] = useState<CandidateGraph | null>(null);

  // --------------------------------------------------
  // Loading states
  // --------------------------------------------------

  const [loadingCandidates, setLoadingCandidates] = useState(true);

  const [loadingCandidate, setLoadingCandidate] = useState(false);

  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  const [loadingGraph, setLoadingGraph] = useState(false);

  // --------------------------------------------------
  // Error
  // --------------------------------------------------

  const [error, setError] = useState<string | null>(null);

  // ==================================================
  // 1. LOAD ALL CANDIDATES
  // ==================================================

  useEffect(() => {
    const loadCandidates = async () => {
      try {
        setError(null);
        setLoadingCandidates(true);

        console.log("Loading candidates...");

        const data = await getCandidates();

        console.log("Candidates received:", data);

        setCandidates(data);

        // Automatically select first candidate
        if (data.length > 0) {
          setSelectedCandidateId(data[0].id);
        }
      } catch (error) {
        console.error("Candidate list error:", error);

        setError(
          error instanceof Error ? error.message : "Unable to fetch candidates",
        );
      } finally {
        setLoadingCandidates(false);
      }
    };

    loadCandidates();
  }, []);

  // ==================================================
  // 2. LOAD SELECTED CANDIDATE DATA
  // ==================================================

  useEffect(() => {
    // Don't make API calls until a candidate
    // has been selected.
    if (!selectedCandidateId) {
      return;
    }

    const loadCandidateData = async () => {
      try {
        setError(null);

        setLoadingCandidate(true);
        setLoadingRecommendations(true);
        setLoadingGraph(true);

        console.log("Loading candidate:", selectedCandidateId);

        const [candidateData, recommendationData, graphData] =
          await Promise.all([
            getCandidate(selectedCandidateId),

            getRecommendations(selectedCandidateId),

            getCandidateGraph(selectedCandidateId),
          ]);

        console.log("Candidate:", candidateData);

        console.log("Recommendations:", recommendationData);

        console.log("Graph:", graphData);

        setCandidate(candidateData);

        setRecommendations(recommendationData);

        setGraph(graphData);
      } catch (error) {
        console.error("Candidate data error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load candidate data",
        );
      } finally {
        setLoadingCandidate(false);
        setLoadingRecommendations(false);
        setLoadingGraph(false);
      }
    };

    loadCandidateData();
  }, [selectedCandidateId]);

  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main>
        {/* ==================================================
            HERO
        ================================================== */}

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
            <div className="max-w-3xl">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                Graph-powered talent discovery
              </p>

              <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                Find opportunities that
                <span className="text-slate-500"> match your talent.</span>
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Explore relationships between candidates, skills, jobs and
                companies using a graph-powered recommendation engine.
              </p>
            </div>

            {/* Candidate selector */}

            <div className="mt-10 max-w-xl">
              {loadingCandidates ? (
                <div className="h-[52px] animate-pulse rounded-xl bg-slate-100" />
              ) : candidates.length > 0 ? (
                <CandidateSelector
                  candidates={candidates}
                  selectedCandidateId={selectedCandidateId}
                  onChange={setSelectedCandidateId}
                />
              ) : (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  No candidates found.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ==================================================
            MAIN CONTENT
        ================================================== */}

        <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
          {/* Error */}

          {error && (
            <div className="mb-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {/* ==================================================
              LOADING CANDIDATE
          ================================================== */}

          {loadingCandidate ? (
            <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="h-64 animate-pulse rounded-2xl bg-slate-200" />

              <div className="h-64 animate-pulse rounded-2xl bg-slate-200" />
            </div>
          ) : candidate ? (
            <>
              {/* ==================================================
                  PROFILE + SKILLS
              ================================================== */}

              <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
                <CandidateProfile candidate={candidate} />

                <SkillsList candidate={candidate} />
              </div>

              {/* ==================================================
                  RECOMMENDATIONS
              ================================================== */}

              <div className="mt-12">
                <RecommendationList
                  recommendations={recommendations}
                  loading={loadingRecommendations}
                />
              </div>

              {/* ==================================================
                  GRAPH EXPLORER
              ================================================== */}

              <div className="mt-12">
                <GraphExplorer graph={graph} loading={loadingGraph} />
              </div>
            </>
          ) : (
            // No candidate selected yet
            !loadingCandidates && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <p className="font-semibold text-slate-800">
                  Select a candidate to continue.
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Candidate information, recommendations and graph relationships
                  will appear here.
                </p>
              </div>
            )
          )}
        </section>
      </main>
    </div>
  );
}
