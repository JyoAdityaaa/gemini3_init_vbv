import { apiRequest } from "./queryClient"; // Assuming you have a queryClient helper, or use fetch

export interface AnalysisInput {
  description: string;
  budget?: string;
  users?: string;
  uptime?: string;
}

export interface AnalysisResult {
  riskScore: number;
  keyFindings: string[];
  recommendations: string[];
  reasoning: string;
  monthlyCost: string;
  architectureDiagram: string; // Mermaid Markdown
}

export async function analyzeArchitecture(input: AnalysisInput): Promise<AnalysisResult> {
  const response = await fetch("/api/analyze-architecture", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to analyze architecture");
  }

  return response.json();
}
