import { motion } from "framer-motion";
import { AGENTS, AgentRole } from "@/lib/simulation-data";
import { cn } from "@/lib/utils";

interface AgentCardProps {
  role: AgentRole;
  isActive: boolean;
  isSpeaking: boolean;
  latestMessage?: string;
}

export function AgentCard({ role, isActive, isSpeaking, latestMessage }: AgentCardProps) {
  const agent = AGENTS[role];
  const Icon = agent.icon;

  return (
    <motion.div 
      animate={{ 
        scale: isSpeaking ? 1.05 : 1,
        borderColor: isSpeaking ? agent.color : "hsl(var(--border))",
        boxShadow: isSpeaking ? `0 0 20px ${agent.color}40` : "none"
      }}
      className={cn(
        "glass-panel p-4 rounded-lg border transition-colors duration-500 flex flex-col relative overflow-hidden",
        isActive ? "opacity-100" : "opacity-50 grayscale"
      )}
      style={{
        "--agent-color": agent.color
      } as React.CSSProperties}
    >
      {/* Scanline effect when active */}
      {isSpeaking && <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--agent-color)]/10 to-transparent opacity-20 animate-pulse pointer-events-none" />}

      <div className="flex items-center gap-3 mb-3 z-10">
        <div 
          className="w-10 h-10 rounded bg-black/50 flex items-center justify-center border border-white/10"
          style={{ color: agent.color }}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-mono font-bold text-sm tracking-wider uppercase text-white">{agent.name}</h3>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{agent.role}</p>
        </div>
      </div>

      <div className="flex-1 z-10">
        <div className="text-[10px] uppercase text-muted-foreground mb-1 font-mono">Core Directive</div>
        <p className="text-xs text-white/80 border-l-2 pl-2" style={{ borderColor: agent.color }}>
          {agent.priority}
        </p>
      </div>

      {latestMessage && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-2 bg-black/40 rounded border border-white/5 text-xs font-mono text-[var(--agent-color)]"
        >
          <span className="opacity-50 mr-2">{">"}</span>
          {latestMessage.slice(0, 60)}...
        </motion.div>
      )}
    </motion.div>
  );
}
