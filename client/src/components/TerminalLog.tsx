import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AgentMessage, AGENTS } from "@/lib/simulation-data";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface TerminalLogProps {
  messages: AgentMessage[];
  isPending?: boolean;
}

export function TerminalLog({ messages, isPending }: TerminalLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="font-mono text-sm h-full flex flex-col">
      <div className="flex items-center justify-between p-2 border-b border-white/10 bg-black/40">
        <span className="text-xs uppercase tracking-widest text-muted-foreground">System Log</span>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500/50" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
          <div className="w-2 h-2 rounded-full bg-green-500/50" />
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
      >
        <AnimatePresence mode="popLayout">
          {messages.map((msg, idx) => {
            const agent = AGENTS[msg.role];
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="group"
              >
                <div className="flex gap-3 text-xs mb-1 opacity-50 group-hover:opacity-100 transition-opacity">
                  <span style={{ color: agent.color }}>[{agent.name.toUpperCase()}]</span>
                  <span>{new Date().toLocaleTimeString()}</span>
                </div>
                <div 
                  className={cn(
                    "p-3 border-l-2 bg-white/5",
                    msg.type === "critique" ? "border-red-500/50 bg-red-500/5" :
                    msg.type === "resolution" ? "border-purple-500/50 bg-purple-500/5" :
                    `border-[${agent.color}]`
                  )}
                  style={{ borderColor: agent.color }}
                >
                  <p className="text-white/90 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {isPending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 p-3 border-l-2 border-primary/30 bg-primary/5 italic text-primary/70"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs font-mono uppercase tracking-widest animate-pulse">
              System analyzing architecture...
            </span>
          </motion.div>
        )}
        
        {messages.length === 0 && !isPending && (
          <div className="text-white/20 italic text-center mt-10">
            Waiting for system input...
          </div>
        )}
      </div>
    </div>
  );
}
