import { useState } from "react";
import { Cpu, Play } from "lucide-react";
import { AGENTS } from "@/lib/simulation-data"; // only for agent labels/icons
import { AgentCard } from "@/components/AgentCard";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function SimulationPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [input, setInput] = useState(
    "Design a high-scale e-commerce backend handling Black Friday traffic spikes."
  );

  async function runSimulation() {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "AWS",
          users: "custom",
          budget: "custom",
          uptime: "custom",
          description: input,
        }),
      });

      const text = await res.text();
      if (!text) throw new Error("Empty response");

      const data = JSON.parse(text);
      setResult(data);
    } catch (err) {
      console.error("Simulation failed", err);
      setResult({
        riskScore: 100,
        monthlyCost: "Simulation failed",
        bottlenecks: ["Backend or Gemini error"],
        spof: [],
        securityRisks: [],
        scalabilityLimits: [],
        suggestedImprovements: [],
        agentData: [],
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen p-6 bg-background text-foreground">
      {/* Header */}
      <header className="flex justify-between items-center glass-panel p-4 mb-6">
        <div className="flex items-center gap-3">
          <Cpu className="text-primary" />
          <h1 className="font-mono font-bold text-xl">
            MULTI-AGENT ARCHITECT
          </h1>
        </div>

        <Button
          onClick={runSimulation}
          disabled={loading}
          className="font-mono font-bold"
        >
          <Play className="w-4 h-4 mr-2" />
          {loading ? "ANALYZING..." : "RUN"}
        </Button>
      </header>

      <div className="grid grid-cols-12 gap-6">
        {/* Agents */}
        <div className="col-span-3 grid grid-rows-4 gap-4">
          {Object.keys(AGENTS).map((role) => (
            <AgentCard
              key={role}
              role={role as any}
              isActive={!!result}
              isSpeaking={false}
              latestMessage={
                result?.agentData?.find((a: any) =>
                  a.agentName.toLowerCase().includes(role)
                )?.reasoning
              }
            />
          ))}
        </div>

        {/* Input + Output */}
        <div className="col-span-6 flex flex-col gap-4">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={6}
            className="font-mono"
          />

          {result && (
            <pre className="glass-panel p-4 text-xs overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </div>

        {/* Diagram */}
        <div className="col-span-3 glass-panel">
          <ArchitectureDiagram isVisible={!!result} />
        </div>
      </div>
    </div>
  );
}