import { useState } from "react";
import { Cpu, Play } from "lucide-react";
import { AGENTS } from "@/lib/simulation-data";
import { AgentCard } from "@/components/AgentCard";
import { SystemTopology } from "@/components/SystemTopology";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import { LoadingSequence } from "@/components/LoadingSequence";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function SimulationPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();
  const [input, setInput] = useState("Design a high-scale e-commerce backend...");
  const [viewMode, setViewMode] = useState<"visual" | "markdown">("visual");

  const generateMarkdown = (data: any) => {
    if (!data) return "";
    
    // Simple ASCII Tree Generation
    const connections = data.architectureDiagram?.split(/[\n;]/)
      .filter((l: string) => l.includes('-->') || l.includes('-.->') || l.includes('==>'))
      .map((l: string) => {
         const parts = l.split(/>|>/);
         if(parts.length < 2) return null;
         const clean = (s: string) => s.replace(/\[.*?\]|["']/g, '').trim();
         return `  ${clean(parts[0])} -> ${clean(parts[parts.length-1])}`;
      }).filter(Boolean).join('\n') || "  (No topology data available)";

    return `# ARCHITECTURE DESIGN REPORT
Date: ${new Date().toLocaleDateString()}

## 1. EXECUTIVE SUMMARY
- **Risk Score**: ${data.riskScore}/100 (${data.riskScore > 50 ? 'HIGH' : 'STABLE'})
- **Est. Monthly Cost**: ${data.monthlyCost}

## 2. SYSTEM TOPOLOGY
\`\`\`text
${connections}
\`\`\`

## 3. AGENT VERDICTS
${data.agentData?.map((a: any) => `- **${a.agentName}**: ${a.reasoning}`).join('\n')}

## 4. CRITICAL BOTTLENECKS
${data.bottlenecks?.map((b: string) => `- [CRITICAL] ${b}`).join('\n') || "None detected."}

## 5. RECOMMENDED IMPROVEMENTS
${data.suggestedImprovements?.map((i: string) => `- [ACTION] ${i}`).join('\n') || "None detected."}
`;
  };

  const copyMarkdown = () => {
    const md = generateMarkdown(result);
    navigator.clipboard.writeText(md);
    toast({ title: "Copied to clipboard", description: "Analysis report is ready to paste." });
  };

  async function runSimulation() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: input }),
      });
      const data = await res.json();
      
      // Fallback Diagram if missing
      if (!data.architectureDiagram) {
        data.architectureDiagram = "Client[User] --> LB[Load Balancer]; LB --> API[Backend API]; API --> DB[Database];";
      }
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen w-full overflow-y-auto p-4 md:p-6 bg-background text-foreground pb-20 relative">
      {loading && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <LoadingSequence />
        </div>
      )}
      <header className="flex justify-between items-center glass-panel p-4 mb-6 sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="flex items-center gap-3">
          <Cpu className="text-primary" />
          <h1 className="font-mono font-bold text-xl neon-text">MULTI-AGENT ARCHITECT</h1>
        </div>
        <Button onClick={runSimulation} disabled={loading} className="font-mono font-bold">
          <Play className="w-4 h-4 mr-2" /> {loading ? "ANALYZING..." : "RUN"}
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Agents - Stack on mobile, Side on desktop */}
        <div className="col-span-1 lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 lg:grid-rows-4 gap-4">
          {Object.keys(AGENTS).map((role) => (
            <AgentCard
              key={role}
              role={role as any}
              isActive={!!result}
              isSpeaking={false}
              latestMessage={result?.agentData?.find((a:any) => a.agentName.toLowerCase().includes(role))?.reasoning}
            />
          ))}
        </div>

        {/* Input & Output */}
        <div className="col-span-1 lg:col-span-6 flex flex-col gap-4">
          <Textarea 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            rows={5} 
            className="font-mono bg-black/20" 
          />
          {result && (
            <div className="glass-panel flex flex-col max-h-[600px] overflow-hidden">
              {/* Report Header */}
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Analysis Complete</span>
                </div>
                <div className="flex gap-4 font-mono text-sm">
                  <span className="text-green-400">$$ {result.monthlyCost}</span>
                  <span className={`${result.riskScore > 50 ? "text-red-400" : "text-green-400"} font-bold`}>
                    RISK: {result.riskScore}/100
                  </span>
                </div>
                <div className="flex gap-2">
                   <Button 
                     variant="ghost" 
                     size="sm" 
                     onClick={() => setViewMode("visual")}
                     className={`h-6 text-[10px] ${viewMode === 'visual' ? 'bg-white/10 text-cyan-400' : 'text-gray-500'}`}
                   >
                     VISUAL
                   </Button>
                   <Button 
                     variant="ghost" 
                     size="sm" 
                     onClick={() => setViewMode("markdown")}
                     className={`h-6 text-[10px] ${viewMode === 'markdown' ? 'bg-white/10 text-cyan-400' : 'text-gray-500'}`}
                   >
                     TEXT/MD
                   </Button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="p-4 overflow-y-auto space-y-6 custom-scrollbar text-sm flex-1">
                
                {viewMode === 'markdown' ? (
                  <div className="relative">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={copyMarkdown}
                      className="absolute top-0 right-0 h-6 text-[10px] border-white/10 hover:bg-white/5"
                    >
                      COPY RAW
                    </Button>
                    <pre className="font-mono text-xs text-green-300/80 whitespace-pre-wrap leading-relaxed select-all bg-black/40 p-4 rounded border border-white/5">
                      {generateMarkdown(result)}
                    </pre>
                  </div>
                ) : (
                  <>
                {/* 1. Agent Reports */}
                <div className="space-y-4">
                  <h3 className="text-xs font-mono uppercase text-muted-foreground mb-2">Agent Reports</h3>
                  {result.agentData?.map((agent: any, i: number) => (
                    <div key={i} className="p-3 rounded bg-white/5 border-l-2" 
                         style={{ borderColor: agent.agentName.includes("Performance") ? "#06b6d4" : agent.agentName.includes("Cost") ? "#22c55e" : "#f97316" }}>
                      <div className="flex justify-between mb-1">
                        <span className="font-bold text-xs uppercase opacity-80" 
                              style={{ color: agent.agentName.includes("Performance") ? "#06b6d4" : agent.agentName.includes("Cost") ? "#22c55e" : "#f97316" }}>
                          {agent.agentName} Agent
                        </span>
                      </div>
                      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{agent.reasoning}</p>
                    </div>
                  ))}
                </div>

                {/* 2. Bottlenecks (Red) */}
                {result.bottlenecks?.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-mono uppercase text-red-400 mb-2 flex items-center gap-2">
                      ⚠️ Critical Bottlenecks
                    </h3>
                    <ul className="space-y-2">
                      {result.bottlenecks.map((item: string, i: number) => (
                        <li key={i} className="flex gap-2 text-red-200/80 bg-red-500/10 p-2 rounded text-xs">
                          <span className="text-red-500">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 3. Improvements (Green) */}
                {result.suggestedImprovements?.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-mono uppercase text-green-400 mb-2 flex items-center gap-2">
                      🚀 Recommended Actions
                    </h3>
                    <ul className="space-y-2">
                      {result.suggestedImprovements.map((item: string, i: number) => (
                        <li key={i} className="flex gap-2 text-green-200/80 bg-green-500/10 p-2 rounded text-xs">
                          <span className="text-green-500">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Diagram Area */}
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
          <div className="flex-1 min-h-[500px]">
            <ArchitectureDiagram 
              diagram={result?.architectureDiagram || ""} 
              isVisible={!!result}
            />
          </div>
          <div className="h-[300px]">
            <SystemTopology diagram={result?.architectureDiagram || ""} />
          </div>
        </div>
      </div>
    </div>
  );
}