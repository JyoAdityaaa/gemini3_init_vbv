import { motion } from "framer-motion";
import { FINAL_JSON } from "@/lib/simulation-data";

interface ArchitectureDiagramProps {
  isVisible: boolean;
}

export function ArchitectureDiagram({ isVisible }: ArchitectureDiagramProps) {
  if (!isVisible) return null;

  return (
    <div className="w-full h-full p-6 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-2xl aspect-video border border-white/10 bg-black/80 rounded-lg p-8 grid grid-cols-3 gap-8"
      >
        {/* Abstract diagram generation */}
        <div className="col-span-1 flex flex-col justify-center items-center gap-4 border-r border-white/10 pr-8">
            <div className="w-16 h-16 rounded-full border-2 border-cyan-500 flex items-center justify-center text-cyan-500 font-bold bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                WEB
            </div>
            <div className="h-12 w-0.5 bg-gradient-to-b from-cyan-500 to-white/20"></div>
            <div className="w-24 h-12 rounded border border-white/30 flex items-center justify-center text-xs text-white bg-white/5">
                API GATEWAY
            </div>
        </div>

        <div className="col-span-2 relative">
            <div className="absolute inset-0 grid grid-cols-2 gap-4">
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="border border-purple-500/50 bg-purple-500/10 rounded p-4 flex flex-col gap-2"
                 >
                    <span className="text-[10px] text-purple-400 uppercase">Core System</span>
                    <div className="flex-1 bg-black/40 rounded border border-white/10 flex items-center justify-center text-sm">
                        Product Monolith
                    </div>
                 </motion.div>

                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="border border-green-500/50 bg-green-500/10 rounded p-4 flex flex-col gap-2"
                 >
                    <span className="text-[10px] text-green-400 uppercase">Hot Path</span>
                    <div className="flex-1 bg-black/40 rounded border border-white/10 flex items-center justify-center text-sm">
                        Checkout Svc
                    </div>
                 </motion.div>

                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="border border-orange-500/50 bg-orange-500/10 rounded p-4 flex flex-col gap-2 col-span-2"
                 >
                    <span className="text-[10px] text-orange-400 uppercase">Persistence Layer</span>
                    <div className="flex gap-4 h-full">
                        <div className="flex-1 bg-black/40 rounded border border-white/10 flex items-center justify-center text-xs">
                             Primary DB (PG)
                        </div>
                        <div className="flex-1 bg-black/40 rounded border border-white/10 flex items-center justify-center text-xs">
                             Redis Cluster
                        </div>
                        <div className="flex-1 bg-black/40 rounded border border-white/10 flex items-center justify-center text-xs text-orange-400">
                             SQS Queue
                        </div>
                    </div>
                 </motion.div>
            </div>
        </div>
        
        {/* Connecting lines overlay - simplified */}
        <svg className="absolute inset-0 pointer-events-none w-full h-full opacity-30">
            <path d="M 150 150 L 300 100" stroke="white" fill="none" strokeDasharray="4 4" />
            <path d="M 150 150 L 300 250" stroke="white" fill="none" strokeDasharray="4 4" />
        </svg>

        <div className="absolute top-4 right-4 text-xs font-mono text-white/50 border px-2 py-1 rounded border-white/10">
            v1.0.4-release
        </div>
      </motion.div>
    </div>
  );
}
