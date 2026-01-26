import { motion } from "framer-motion";
import { FINAL_JSON } from "@/lib/simulation-data";
import { Box, Database, Globe, Layers, Zap, ShieldCheck } from "lucide-react";

interface ArchitectureDiagramProps {
  isVisible: boolean;
}

export function ArchitectureDiagram({ isVisible }: ArchitectureDiagramProps) {
  if (!isVisible) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="w-full h-full p-8 flex flex-col items-center justify-center bg-black/40 overflow-hidden">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full h-full grid grid-rows-3 gap-8"
      >
        {/* Top Layer: Entry */}
        <div className="flex justify-center items-center relative">
          <motion.div 
            variants={itemVariants}
            className="group relative flex flex-col items-center"
          >
            <div className="w-14 h-14 rounded-xl border border-cyan-500/50 bg-cyan-500/10 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all">
              <Globe className="w-7 h-7" />
            </div>
            <span className="mt-2 text-[10px] font-mono uppercase tracking-tighter text-cyan-400/80">API Gateway</span>
            
            {/* Flow lines down */}
            <div className="absolute top-full h-8 w-px bg-gradient-to-b from-cyan-500/50 to-transparent" />
          </motion.div>
        </div>

        {/* Middle Layer: Services */}
        <div className="flex justify-around items-center gap-12 relative px-4">
          <motion.div variants={itemVariants} className="flex flex-col items-center group">
            <div className="w-16 h-16 rounded-lg border border-purple-500/50 bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <Layers className="w-8 h-8" />
            </div>
            <span className="mt-2 text-[10px] font-mono uppercase text-purple-400/80">Product Monolith</span>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col items-center group">
             <div className="relative">
                <div className="absolute -inset-1 bg-green-500/20 blur-sm rounded-full animate-pulse" />
                <div className="relative w-16 h-16 rounded-lg border border-green-500/50 bg-green-500/10 flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform">
                  <Zap className="w-8 h-8" />
                </div>
             </div>
            <span className="mt-2 text-[10px] font-mono uppercase text-green-400/80">Checkout Service</span>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col items-center group">
            <div className="w-16 h-16 rounded-lg border border-orange-500/50 bg-orange-500/10 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <span className="mt-2 text-[10px] font-mono uppercase text-orange-400/80">SQS Buffer</span>
          </motion.div>
        </div>

        {/* Bottom Layer: Data */}
        <div className="flex justify-center gap-16 items-center border-t border-white/5 pt-4">
          <motion.div variants={itemVariants} className="flex items-center gap-3 glass-panel px-4 py-2 rounded-md border-blue-500/30">
            <Database className="w-4 h-4 text-blue-400" />
            <div className="flex flex-col">
              <span className="text-[9px] text-white/40 uppercase font-mono">Persistence</span>
              <span className="text-xs text-blue-200 font-mono">PostgreSQL</span>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-center gap-3 glass-panel px-4 py-2 rounded-md border-red-500/30">
            <Box className="w-4 h-4 text-red-400" />
            <div className="flex flex-col">
              <span className="text-[9px] text-white/40 uppercase font-mono">Cache</span>
              <span className="text-xs text-red-200 font-mono">Redis Cluster</span>
            </div>
          </motion.div>
        </div>

        {/* Animated Background SVG for connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" preserveAspectRatio="none">
          <defs>
            <linearGradient id="grad-line" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="cyan" />
              <stop offset="100%" stopColor="purple" />
            </linearGradient>
          </defs>
          <motion.path 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 1 }}
            d="M 50% 15% L 25% 45% M 50% 15% L 50% 45% M 50% 15% L 75% 45%" 
            stroke="url(#grad-line)" 
            strokeWidth="1" 
            fill="none"
          />
        </svg>
      </motion.div>
    </div>
  );
}
