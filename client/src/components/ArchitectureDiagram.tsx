import { motion } from "framer-motion";
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
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="w-full h-full p-4 flex flex-col items-center justify-center bg-black/20 overflow-hidden">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full h-full flex flex-col justify-between py-2 relative"
      >
        {/* Top Layer: Entry */}
        <div className="flex justify-center items-center z-10">
          <motion.div 
            variants={itemVariants}
            className="flex flex-col items-center"
          >
            <div className="w-10 h-10 rounded-lg border border-cyan-500/50 bg-cyan-500/10 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Globe className="w-5 h-5" />
            </div>
            <span className="mt-1 text-[8px] font-mono uppercase tracking-tighter text-cyan-400/80">API Gateway</span>
          </motion.div>
        </div>

        {/* Middle Layer: Services */}
        <div className="flex justify-around items-center gap-4 z-10">
          <motion.div variants={itemVariants} className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-lg border border-purple-500/50 bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Layers className="w-6 h-6" />
            </div>
            <span className="mt-1 text-[8px] font-mono uppercase text-purple-400/80">Monolith</span>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-lg border border-green-500/50 bg-green-500/10 flex items-center justify-center text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
              <Zap className="w-6 h-6" />
            </div>
            <span className="mt-1 text-[8px] font-mono uppercase text-green-400/80">Checkout</span>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-lg border border-orange-500/50 bg-orange-500/10 flex items-center justify-center text-orange-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="mt-1 text-[8px] font-mono uppercase text-orange-400/80">SQS</span>
          </motion.div>
        </div>

        {/* Bottom Layer: Data */}
        <div className="flex justify-center gap-6 items-center z-10">
          <motion.div variants={itemVariants} className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded border border-blue-500/30">
            <Database className="w-3 h-3 text-blue-400" />
            <span className="text-[9px] text-blue-200 font-mono uppercase tracking-tighter">PostgreSQL</span>
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded border-red-500/30">
            <Box className="w-3 h-3 text-red-400" />
            <span className="text-[9px] text-red-200 font-mono uppercase tracking-tighter">Redis</span>
          </motion.div>
        </div>

        {/* Connection Overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" preserveAspectRatio="none">
          <motion.path 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            d="M 50% 15% L 25% 45% M 50% 15% L 50% 45% M 50% 15% L 75% 45% M 25% 55% L 40% 85% M 50% 55% L 50% 85% M 75% 55% L 60% 85%" 
            stroke="white" 
            strokeWidth="0.5" 
            fill="none"
          />
        </svg>
      </motion.div>
    </div>
  );
}
