import { GoogleGenAI } from "@google/genai";
import type { ArchitectureMetadata, AnalysisResult } from "./types";

/* ======================================================
   GEMINI CLIENT
====================================================== */

if (!process.env.API_KEY) {
  throw new Error("❌ API_KEY is not set in environment variables");
}

const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY,
});

/* ======================================================
   MODEL SELECTION (VALID MODELS ONLY)
====================================================== */

const MODELS = {
  FAST: "gemini-1.5-flash",
  SMART: "gemini-1.5-pro",
};

/* ======================================================
   ARCHITECT AGENTS
====================================================== */

const AGENTS = [
  "Performance Architect",
  "Cost Architect",
  "Reliability Architect",
  "Security Architect",
] as const;

/* ======================================================
   JSON SAFE PARSER
====================================================== */

function safeJsonParse(text: string) {
  try {
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start === -1 || end === -1) {
      throw new Error("No JSON object found");
    }

    return JSON.parse(cleaned.slice(start, end + 1));
  } catch (err) {
    console.error("❌ JSON parse failed. Raw text:\n", text);
    throw new Error("Model returned invalid JSON");
  }
}

/* ======================================================
   GENERATION HELPER
====================================================== */

async function generate(prompt: string, retries = 1): Promise<any> {
  try {
    const res = await ai.models.generateContent({
      model: MODELS.FAST,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text =
      res.candidates?.[0]?.content?.parts
        ?.map((p: any) => p.text)
        .join("") ?? "";

    if (!text) {
      console.error("❌ Empty Gemini response", res);
      throw new Error("Empty Gemini response");
    }

    return safeJsonParse(text);
  } catch (err) {
    console.error("❌ Gemini generation error:", err);

    if (retries > 0) return generate(prompt, retries - 1);
    throw err;
  }
}

/* ======================================================
   MAIN ANALYSIS FUNCTION
====================================================== */

export async function analyzeArchitecture(
  metadata: ArchitectureMetadata
): Promise<AnalysisResult> {
  const constraintMode =
    metadata.description?.includes("Constraint Mode: HARD")
      ? "HARD"
      : "SOFT";

  const baseContext = `
SYSTEM CONSTRAINTS:
- Cloud Provider: ${metadata.provider}
- Expected Users: ${metadata.users}
- Monthly Budget: ${metadata.budget}
- Uptime Target: ${metadata.uptime}
- Description: ${metadata.description}

Constraint Mode: ${constraintMode}

IMPORTANT RULES:
- Do NOT assume ideal infrastructure
- Explicitly state violated constraints
- Be brutally honest
`;

  /* ---------- AGENT PHASE ---------- */

  const agentResults = [];

  for (const agent of AGENTS) {
    const prompt = `
You are acting as a ${agent}.

Optimize ONLY for your domain.

Return ONLY valid JSON:

{
  "findings": string[],
  "warnings": string[],
  "violatedConstraints": string[],
  "reasoning": string
}

${baseContext}
`;

    const result = await generate(prompt);

    agentResults.push({
      agentName: agent,
      findings: result.findings ?? [],
      warnings: result.warnings ?? [],
      violatedConstraints: result.violatedConstraints ?? [],
      reasoning: result.reasoning ?? "",
    });
  }

  /* ---------- CONSENSUS PHASE ---------- */

  const consensusPrompt = `
You are a Consensus Architecture Engine.

Return ONLY valid JSON:

{
  "riskScore": number,
  "monthlyCost": string,
  "bottlenecks": string[],
  "spof": string[],
  "securityRisks": string[],
  "scalabilityLimits": string[],
  "suggestedImprovements": string[],
  "architectureSummary": string
}

Agent Analyses:
${JSON.stringify(agentResults, null, 2)}

${baseContext}
`;

  const final = await generate(consensusPrompt);

  return {
    riskScore: final.riskScore ?? 100,
    monthlyCost: final.monthlyCost ?? "Unknown",
    bottlenecks: final.bottlenecks ?? [],
    spof: final.spof ?? [],
    securityRisks: final.securityRisks ?? [],
    scalabilityLimits: final.scalabilityLimits ?? [],
    suggestedImprovements: final.suggestedImprovements ?? [],
    agentData: agentResults,
  };
}