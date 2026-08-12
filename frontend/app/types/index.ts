export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency?: string;
  years?: number;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  experience: number;
  location: string;
  skills?: Skill[];
}

export interface Company {
  id: string;
  name: string;
  location: string;
  industry: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  experienceRequired: number;
  location: string;
  employmentType: string;
  salary: number;
  company: Company | null;
  skills: Skill[];
}

export interface Recommendation {
  candidate: string;
  jobId: string;
  job: string;
  description: string;
  location: string;
  employmentType: string;
  salary: number;
  matchedSkills: string[];
  matchedSkillCount: number;
  totalRequiredSkills: number;
  matchPercentage: number;
}

export interface GraphNode {
  id: string;
  label: string;
  type: "Candidate" | "Skill" | "Job" | "Company" | string;
  properties?: Record<string, unknown>;
}

export interface GraphLink {
  source: string;
  target: string;
  relationship: string;
}

export interface CandidateGraph {
  nodes: GraphNode[];
  links: GraphLink[];
}
