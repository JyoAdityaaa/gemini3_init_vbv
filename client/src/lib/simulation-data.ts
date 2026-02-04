import {
  Activity,
  CircleDollarSign,
  ShieldAlert,
  Scale,
} from "lucide-react";

/* ======================================================
   AGENT DEFINITIONS (UI ONLY)
   - NO MOCK DATA
   - NO STATIC RESULTS
====================================================== */

export type AgentRole =
  | "performance"
  | "cost"
  | "reliability"
  | "security"
  | "consensus";

export interface AgentUIConfig {
  name: string;
  role: AgentRole;
  color: string;
  icon: any;
  priority: string;
}

/* ======================================================
   AGENT METADATA (used only for rendering)
====================================================== */

export const AGENTS: Record<AgentRole, AgentUIConfig> = {
  performance: {
    name: "Performance Architect",
    role: "performance",
    color: "var(--color-agent-perf)",
    icon: Activity,
    priority: "Latency, Throughput, Scalability",
  },
  cost: {
    name: "Cost Architect",
    role: "cost",
    color: "var(--color-agent-cost)",
    icon: CircleDollarSign,
    priority: "Efficiency, Budget, Simplicity",
  },
  reliability: {
    name: "Reliability Architect",
    role: "reliability",
    color: "var(--color-agent-rel)",
    icon: ShieldAlert,
    priority: "Uptime, Fault Tolerance, Recovery",
  },
  security: {
    name: "Security Architect",
    role: "security",
    color: "var(--color-agent-sec)",
    icon: ShieldAlert,
    priority: "Threat Modeling, Data Protection, IAM",
  },
  consensus: {
    name: "Consensus Engine",
    role: "consensus",
    color: "var(--color-agent-cons)",
    icon: Scale,
    priority: "Conflict Resolution, Final Judgment",
  },
};

/* ======================================================
   IMPORTANT
====================================================== */

/**
 * 🚫 DO NOT PUT:
 * - SIMULATION_STEPS
 * - FINAL_JSON
 * - HARDCODED FINDINGS
 *
 * ✅ Gemini output must ONLY come from `/api/analyze`
 *
 * This file exists ONLY to support UI rendering.
 */