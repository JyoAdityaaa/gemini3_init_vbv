import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Loader2, Terminal } from "lucide-react";

const steps = [
  "Initializing Secure Handshake...",
  "Deploying FinOps Agent for Cost Analysis...",
  "SRE Agent is stress-testing failure points...",
  "Performance Architect is optimizing latency...",
  "Agents are debating architectural trade-offs...",
  "Consensus Engine: resolving conflicts...",
  "Generating Final Architecture Diagram..."
];

export function LoadingSequence() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  // Cycle through steps every 9 seconds
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 9000);

    return () => clearInterval(stepInterval);
  }, []);

  // Slowly fill progress bar (reaches ~95% in 120s)
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 30) return prev + 0.5;
        if (prev < 60) return prev + 0.3;
        if (prev < 90) return prev + 0.1;
        if (prev < 98) return prev + 0.02;
        return prev;
      });
    }, 500);

    return () => clearInterval(progressInterval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-8 max-w-md w-full animate-in fade-in zoom-in duration-500">
      <div className="relative group">
        <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-all duration-500 animate-pulse" />
        <div className="relative w-24 h-24 rounded-full border-2 border-primary/50 flex items-center justify-center neon-text text-primary overflow-hidden">
          <Terminal className="w-10 h-10 animate-bounce" />
          <div className="absolute inset-0 border-t-2 border-primary animate-spin" />
        </div>
      </div>

      <div className="w-full space-y-4">
        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.3em] text-primary">
          <span>Simulation in progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        
        <Progress 
          value={progress} 
          className="h-1 bg-white/5 overflow-hidden" 
        />
        
        <div className="bg-black/40 border border-primary/20 rounded p-4 font-mono text-xs space-y-2 min-h-[80px] flex flex-col justify-center">
          <div className="flex items-center gap-2 text-cyan-400">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span className="animate-pulse">{steps[currentStep]}</span>
            <span className="w-1.5 h-3 bg-primary animate-blink" />
          </div>
          <div className="text-muted-foreground opacity-50 overflow-hidden whitespace-nowrap">
            {`> SECURE_CORE_IDENTIFIED: [SUCCESS]`}
          </div>
          <div className="text-muted-foreground opacity-50 overflow-hidden whitespace-nowrap">
            {`> AGENT_ORCHESTRATION_LAYER: [ACTIVE]`}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground animate-pulse">
          Establishing multi-agent consensus
        </p>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div 
              key={i} 
              className="w-1 h-1 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
