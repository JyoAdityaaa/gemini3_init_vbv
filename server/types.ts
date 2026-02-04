/* ---------- INPUT TYPE ---------- */
export interface ArchitectureMetadata {
    provider: string;
    users: string;
    budget: string;
    uptime: string;
    description: string;
    image?: string; // base64 image (optional)
  }
  
  /* ---------- AGENT OUTPUT ---------- */
  export interface AgentFinding {
    agentName: string;
    findings: string[];
    warnings: string[];
    reasoning: string;
  }
  
  /* ---------- FINAL ANALYSIS RESULT ---------- */
  export interface AnalysisResult {
    riskScore: number;
    monthlyCost: string;
    bottlenecks: string[];
    spof: string[];
    securityRisks: string[];
    scalabilityLimits: string[];
    suggestedImprovements: string[];
    agentData: AgentFinding[];
  }