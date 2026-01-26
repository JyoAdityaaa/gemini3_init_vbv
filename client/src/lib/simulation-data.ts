import { Activity, CircleDollarSign, ShieldAlert, Scale, BrainCircuit } from "lucide-react";

export type AgentRole = "performance" | "cost" | "reliability" | "consensus";

export interface AgentMessage {
  id?: string;
  role: AgentRole;
  content: string;
  timestamp?: number;
  type: "proposal" | "critique" | "resolution";
}

export const AGENTS = {
  performance: {
    name: "Performance Architect",
    role: "performance",
    color: "var(--color-agent-perf)",
    icon: Activity,
    priority: "Latency, Throughput, Scalability"
  },
  cost: {
    name: "Cost Architect",
    role: "cost",
    color: "var(--color-agent-cost)",
    icon: CircleDollarSign,
    priority: "Efficiency, Simplicity, Budget"
  },
  reliability: {
    name: "Reliability Architect",
    role: "reliability",
    color: "var(--color-agent-rel)",
    icon: ShieldAlert,
    priority: "Uptime, Consistency, Recovery"
  },
  consensus: {
    name: "Consensus Engine",
    role: "consensus",
    color: "var(--color-agent-cons)",
    icon: Scale,
    priority: "Conflict Resolution, Final Design"
  }
} as const;

interface SimulationStep {
    phase: string;
    messages: AgentMessage[];
}

export const SIMULATION_STEPS: SimulationStep[] = [
  {
    phase: "analysis",
    messages: [
      {
        role: "consensus",
        content: "Interpreting Diagram: The input is a flowchart for a Factual Query Classifier and LLM pipeline. Key components: Query Classifier, Knowledge Base, Confidence Check, and Audit Store.",
        type: "proposal"
      }
    ]
  },
  {
    phase: "proposal",
    messages: [
      {
        role: "performance",
        content: "To minimize latency on the 'Factual Query' branch, we must cache Knowledge Base results in Redis. The 'Classify Query' step should be a lightweight model or regex-based router before hitting the heavy LLM to save cycles.",
        type: "proposal"
      },
      {
        role: "cost",
        content: "Agreed on the router. For the 'LLM Rephrases' step, we should use a smaller, quantized model for internal rephrasing tasks. No need for GPT-4 for simple formatting; it's too expensive at scale.",
        type: "proposal"
      },
      {
        role: "reliability",
        content: "The 'Store in Audit' step is critical for compliance. It must be an asynchronous write to a durable store (like S3 or DynamoDB) so that logging failures don't block the user response path.",
        type: "critique"
      }
    ]
  },
  {
    phase: "debate",
    messages: [
      {
        role: "performance",
        content: "If the confidence check fails, we route to 'Reject with Polite'. This path should be statically served or cached to prevent re-triggering the LLM router.",
        type: "critique"
      },
      {
        role: "reliability",
        content: "We need an explicit circuit breaker between the 'Fetch' and 'Knowledge Base' steps. If the KB is down, the system should gracefully degrade to the 'Reject' path rather than timing out.",
        type: "proposal"
      }
    ]
  },
  {
    phase: "consensus",
    messages: [
      {
        role: "consensus",
        content: "Final Architecture for LLM Pipeline:\n1. Router: FastAPI with local classifier.\n2. Knowledge Path: Vector DB + Redis Cache layer.\n3. Processing: Asynchronous workers for Audit logging via SQS.\n4. Fail-safe: Circuit breaker patterns on all external API calls.",
        type: "resolution"
      }
    ]
  }
];

export const FINAL_JSON = {
  diagram_interpretation: {
    identified_components: ["User Input", "Query Classifier", "Decision Node (Factual?)", "Knowledge Base/API", "Confidence Threshold", "LLM Rephraser", "Audit Store"],
    data_flows: ["Input -> Classifier -> Routing", "Factual -> KB -> Confidence -> Answer", "Non-Factual/Low-Conf -> Rejection/Logging"],
    ambiguities: ["Specific threshold value for confidence", "Downtime policy for Knowledge Base"]
  },
  final_architecture: {
    architecture_summary: "Robust LLM Inference Pipeline with Guardrails",
    db_schema: [
      "audit_logs: {id, query, response, confidence, latency, timestamp}",
      "knowledge_cache: {vector_id, query_hash, payload, ttl}"
    ],
    api_endpoints: [
      "POST /v1/query: {input} -> {response, sources}",
      "GET /v1/health: Readiness check for KB"
    ],
    selected_tradeoffs: [
      "Prioritized cost over response depth by using local classifier",
      "Accepted eventual consistency for audit logs to maintain low latency"
    ]
  }
};
