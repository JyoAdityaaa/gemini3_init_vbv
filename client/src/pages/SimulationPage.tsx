import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw, Cpu } from "lucide-react";
import { AgentCard } from "@/components/AgentCard";
import { TerminalLog } from "@/components/TerminalLog";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { AGENTS, SIMULATION_STEPS, AgentMessage, FINAL_JSON, AgentRole } from "@/lib/simulation-data";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function SimulationPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [activeSpeaker, setActiveSpeaker] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [userInput, setUserInput] = useState("Design a high-scale E-commerce backend handling Black Friday traffic spikes. The team is small, so we want to avoid over-engineering, but we cannot afford downtime.");

  useEffect(() => {
    if (!isRunning || currentStep >= SIMULATION_STEPS.length) {
      if (isRunning && currentStep >= SIMULATION_STEPS.length) {
        setShowResult(true);
        setIsRunning(false);
      }
      return;
    }

    const stepData = SIMULATION_STEPS[currentStep];
    let messageIndex = 0;

    const interval = setInterval(() => {
      if (messageIndex >= stepData.messages.length) {
        clearInterval(interval);
        setTimeout(() => setCurrentStep((prev) => prev + 1), 1000);
        return;
      }

      const msg = stepData.messages[messageIndex];
      setActiveSpeaker(msg.role);
      
      setMessages((prev) => [
        ...prev, 
        { 
          ...msg, 
          role: msg.role as AgentRole, // Explicit cast to fix type error
          id: Math.random().toString(), 
          timestamp: Date.now() 
        }
      ]);

      setTimeout(() => setActiveSpeaker(null), 2000); // Stop speaking after 2s
      messageIndex++;
    }, 2500); // Delay between messages

    return () => clearInterval(interval);
  }, [isRunning, currentStep]);

  const handleStart = () => {
    setMessages([]);
    setCurrentStep(0);
    setShowResult(false);
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setMessages([]);
    setShowResult(false);
    setActiveSpeaker(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 flex flex-col gap-6 overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between glass-panel p-4 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/20 rounded flex items-center justify-center border border-primary/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Cpu className="text-primary w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="font-mono font-bold text-xl tracking-tighter">MULTI-AGENT <span className="text-primary">ARCHITECT</span></h1>
            <p className="text-xs text-muted-foreground tracking-widest uppercase">System Design Reasoning Engine v1.0</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           {!isRunning && !showResult && (
             <Button onClick={handleStart} className="bg-primary hover:bg-primary/80 text-black font-bold font-mono">
                <Play className="w-4 h-4 mr-2" /> INITIALIZE SIMULATION
             </Button>
           )}
           {(isRunning || showResult) && (
             <Button onClick={handleReset} variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10 font-mono">
                <RotateCcw className="w-4 h-4 mr-2" /> TERMINATE
             </Button>
           )}
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6 flex-1 h-[calc(100vh-140px)]">
        
        {/* Left Col: Agents */}
        <div className="col-span-3 grid grid-rows-4 gap-4 h-full">
            {(Object.keys(AGENTS) as Array<keyof typeof AGENTS>).map((role) => (
                <AgentCard 
                    key={role}
                    role={role}
                    isActive={isRunning || showResult}
                    isSpeaking={activeSpeaker === role}
                    latestMessage={messages.findLast(m => m.role === role)?.content}
                />
            ))}
        </div>

        {/* Center: Terminal / Visualization */}
        <div className="col-span-6 flex flex-col gap-4 h-full">
            {/* Input Area */}
            <div className="h-32 glass-panel p-4 rounded-lg border-primary/20 flex flex-col gap-2 relative group">
                <label className="text-[10px] uppercase font-mono text-primary tracking-wider">System Constraints Input</label>
                <Textarea 
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="flex-1 bg-black/40 border-none resize-none font-mono text-sm text-white/80 focus-visible:ring-1 focus-visible:ring-primary/50"
                    disabled={isRunning}
                />
                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                </div>
            </div>

            {/* Terminal Output */}
            <div className="flex-1 glass-panel rounded-lg overflow-hidden border-white/10 relative">
                <TerminalLog messages={messages} />
                {isRunning && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-primary/20 overflow-hidden">
                        <div className="h-full bg-primary/50 animate-progress w-full origin-left scale-x-0" />
                    </div>
                )}
            </div>
        </div>

        {/* Right Col: Output/JSON */}
        <div className="col-span-3 glass-panel rounded-lg border-white/10 flex flex-col overflow-hidden h-full">
            <div className="p-3 border-b border-white/10 bg-black/40 flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-muted-foreground">Architecture Output</span>
                {showResult && <span className="text-[10px] text-green-400 font-mono">CONVERGED</span>}
            </div>
            
            <div className="flex-1 overflow-hidden relative">
                {!showResult ? (
                    <div className="absolute inset-0 flex items-center justify-center flex-col gap-4 opacity-30">
                        <div className="w-16 h-16 border-2 border-dashed border-white/20 rounded-full animate-spin-slow" />
                        <p className="text-xs font-mono text-center px-8">Waiting for consensus...</p>
                    </div>
                ) : (
                    <div className="h-full overflow-y-auto p-4 font-mono text-xs text-green-400/80 scrollbar-none">
                        <pre>{JSON.stringify(FINAL_JSON, null, 2)}</pre>
                    </div>
                )}
            </div>

            <div className="h-64 border-t border-white/10 bg-black/20">
                 <div className="p-2 border-b border-white/5 text-[10px] font-mono uppercase text-muted-foreground flex justify-between items-center">
                    <span>System Visualizer</span>
                    <div className="flex gap-1">
                        <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                        <div className="w-1 h-1 rounded-full bg-primary/50 animate-pulse delay-75" />
                        <div className="w-1 h-1 rounded-full bg-primary/20 animate-pulse delay-150" />
                    </div>
                 </div>
                 <div className="h-[calc(100%-25px)] w-full bg-black/50 relative overflow-hidden">
                    <ArchitectureDiagram isVisible={showResult} />
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
}
