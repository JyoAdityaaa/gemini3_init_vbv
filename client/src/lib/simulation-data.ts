import { Activity, CircleDollarSign, ShieldAlert, Scale, BrainCircuit } from "lucide-react";

export type AgentRole = "performance" | "cost" | "reliability" | "consensus";

export interface AgentMessage {
  id?: string; // Optional id since we generate it at runtime
  role: AgentRole;
  content: string;
  timestamp?: number; // Optional timestamp since we generate it at runtime
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
        content: "Analyzing input requirements: High-scale e-commerce backend. Constraints: Black Friday traffic spikes, limited initial budget.",
        type: "proposal"
      }
    ]
  },
  {
    phase: "proposal",
    messages: [
      {
        role: "performance",
        content: "Proposing Microservices Architecture with Event Sourcing. We need aggressive Redis caching at the edge. Separate Read/Write paths (CQRS) are mandatory to handle the read volume during spikes. Async processing for all write operations.",
        type: "proposal"
      },
      {
        role: "cost",
        content: "Rejecting Microservices. The infrastructure overhead is too high for the initial budget. Kubernetes cluster management costs will bleed us dry. Proposing a Modular Monolith on a single large instance with vertical scaling.",
        type: "critique"
      },
      {
        role: "reliability",
        content: "Single instance is a single point of failure. Unacceptable. We need at least an Active-Passive DB setup and a message queue (Kafka/SQS) to ensure no orders are dropped if the service crashes.",
        type: "critique"
      }
    ]
  },
  {
    phase: "debate",
    messages: [
      {
        role: "performance",
        content: "A monolith will choke on DB locks during checkout. We need to at least split the 'Checkout' service to scale independently.",
        type: "critique"
      },
      {
        role: "cost",
        content: "Agreed on splitting Checkout, but keep it simple. No Kafka. Use a managed Postgres with a simple job queue table first.",
        type: "proposal"
      },
      {
        role: "reliability",
        content: "Job queue table in Postgres will cause bloat and locking issues under load. We MUST use a managed queue service like SQS. It's cheap and reliable.",
        type: "critique"
      }
    ]
  },
  {
    phase: "consensus",
    messages: [
      {
        role: "consensus",
        content: "Synthesizing Final Architecture: Hybrid Approach.\n1. Core System: Modular Monolith for Product/User domains (Low Cost).\n2. Hot Path: Extracted 'Checkout Service' (Performance).\n3. Resilience: Managed SQS for order buffering (Reliability).\n4. Data: Primary Postgres + Redis for Product Catalog cache.",
        type: "resolution"
      }
    ]
  }
];

export const FINAL_JSON = {
  architecture_summary: "Hybrid Modular Monolith with Extracted Checkout Service",
  selected_tradeoffs: [
    "Accepted higher latency on inventory updates for eventual consistency",
    "Chose operational complexity of SQS over DB-as-queue for reliability",
    "Deferred full microservices to save infrastructure costs"
  ],
  components: [
    { name: "API Gateway", type: "Service", status: "Active" },
    { name: "Product Service", type: "Module", status: "Monolith" },
    { name: "Checkout Service", type: "Service", status: "Microservice" },
    { name: "Order Queue", type: "Infra", status: "SQS" },
    { name: "Postgres Primary", type: "DB", status: "PaaS" },
    { name: "Redis Cache", type: "Cache", status: "Cluster" }
  ]
};
