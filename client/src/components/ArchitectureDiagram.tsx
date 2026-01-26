import { motion } from "framer-motion";
import { Globe, Search, ShieldCheck, Zap, Database, AlertCircle, FileText, CheckCircle2 } from "lucide-react";

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
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1 }
  };

  return (
    <div className="w-full h-full p-2 flex flex-col items-center justify-center bg-black/20 overflow-hidden">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full h-full flex flex-col gap-2 relative max-w-md"
      >
        {/* Step 1: Input & Classifier */}
        <div className="flex justify-center gap-4">
          <motion.div variants={itemVariants} className="flex flex-col items-center">
            <div className="w-8 h-8 rounded border border-white/20 bg-white/5 flex items-center justify-center text-white/50">
              <Globe className="w-4 h-4" />
            </div>
            <span className="text-[7px] mt-0.5 uppercase opacity-50 font-mono">Input</span>
          </motion.div>
          <div className="w-4 h-px bg-white/10 self-center mt-[-10px]" />
          <motion.div variants={itemVariants} className="flex flex-col items-center">
            <div className="w-8 h-8 rounded border border-blue-500/50 bg-blue-500/10 flex items-center justify-center text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
              <Search className="w-4 h-4" />
            </div>
            <span className="text-[7px] mt-0.5 uppercase text-blue-400 font-mono">Classifier</span>
          </motion.div>
        </div>

        {/* Step 2: Routing Logic */}
        <div className="flex justify-center items-center gap-12 py-1">
          <motion.div variants={itemVariants} className="relative">
            <div className="w-10 h-10 rotate-45 border border-white/30 bg-black/40 flex items-center justify-center">
                <div className="-rotate-45 text-[8px] font-mono text-white/60">FACT?</div>
            </div>
            {/* Yes path */}
            <div className="absolute top-1/2 left-full w-4 h-px bg-green-500/30" />
            {/* No path */}
            <div className="absolute top-full left-1/2 w-px h-4 bg-red-500/30" />
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full border border-green-500/50 bg-green-500/10 flex items-center justify-center text-green-400">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-[7px] mt-0.5 uppercase text-green-400 font-mono">KB Fetch</span>
          </motion.div>
        </div>

        {/* Step 3: Confidence & LLM */}
        <div className="flex justify-center gap-4">
          <motion.div variants={itemVariants} className="flex flex-col items-center opacity-50">
            <div className="w-8 h-8 rounded border border-red-500/50 bg-red-500/10 flex items-center justify-center text-red-400">
              <AlertCircle className="w-4 h-4" />
            </div>
            <span className="text-[7px] mt-0.5 uppercase text-red-400 font-mono">Reject</span>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex flex-col items-center">
             <div className="w-10 h-10 rounded border border-purple-500/50 bg-purple-500/10 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[7px] mt-0.5 uppercase text-purple-400 font-mono">LLM Rephrase</span>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col items-center">
            <div className="w-10 h-10 rounded border border-orange-500/50 bg-orange-500/10 flex items-center justify-center text-orange-400">
              <Database className="w-5 h-5" />
            </div>
            <span className="text-[7px] mt-0.5 uppercase text-orange-400 font-mono">Audit Store</span>
          </motion.div>
        </div>

        {/* Final Step */}
        <div className="flex justify-center mt-1">
          <motion.div variants={itemVariants} className="flex flex-col items-center">
            <div className="px-3 py-1 rounded-full border border-primary/50 bg-primary/10 flex items-center gap-2 text-primary">
              <CheckCircle2 className="w-3 h-3" />
              <span className="text-[8px] font-mono uppercase font-bold">Return Answer</span>
            </div>
          </motion.div>
        </div>

        {/* Connection Overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10" preserveAspectRatio="none">
          <motion.path 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            d="M 50% 10% L 50% 25% M 50% 40% L 75% 40% M 75% 55% L 50% 70% M 50% 80% L 50% 90%" 
            stroke="white" 
            strokeWidth="0.5" 
            fill="none"
          />
        </svg>
      </motion.div>
    </div>
  );
}
