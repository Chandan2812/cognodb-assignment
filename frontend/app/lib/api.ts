import {
  Candidate,
  CandidateGraph,
  Company,
  Job,
  Recommendation,
  Skill,
} from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

const fetchApi = async <T>(endpoint: string): Promise<T> => {
  const url = `${API_URL}${endpoint}`;

  console.log("API REQUEST:", url);

  try {
    const response = await fetch(url);

    console.log("API STATUS:", response.status, response.statusText);

    const result: ApiResponse<T> = await response.json();

    console.log("API RESPONSE:", result);

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Something went wrong");
    }

    return result.data;
  } catch (error) {
    console.error("API FETCH ERROR:", error);

    throw error;
  }
};

export const getCandidates = async (): Promise<Candidate[]> => {
  return fetchApi<Candidate[]>("/api/candidates");
};

export const getCandidate = async (candidateId: string): Promise<Candidate> => {
  return fetchApi<Candidate>(`/api/candidates/${candidateId}`);
};

export const getRecommendations = async (
  candidateId: string,
): Promise<Recommendation[]> => {
  return fetchApi<Recommendation[]>(
    `/api/candidates/${candidateId}/recommendations`,
  );
};

export const getJobs = async (): Promise<Job[]> => {
  return fetchApi<Job[]>("/api/jobs");
};

export const getJob = async (jobId: string): Promise<Job> => {
  return fetchApi<Job>(`/api/jobs/${jobId}`);
};

export const getSkills = async (): Promise<Skill[]> => {
  return fetchApi<Skill[]>("/api/skills");
};

export const getCompanies = async (): Promise<Company[]> => {
  return fetchApi<Company[]>("/api/companies");
};

export const getCandidateGraph = async (
  candidateId: string,
): Promise<CandidateGraph> => {
  return fetchApi<CandidateGraph>(`/api/graph/candidate/${candidateId}`);
};
