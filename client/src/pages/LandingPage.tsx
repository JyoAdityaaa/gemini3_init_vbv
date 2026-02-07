import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Cpu, Zap, Shield, BarChart3, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary overflow-x-hidden">
      {/* BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <nav className="container mx-auto h-20 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-primary/10 border border-primary/50 flex items-center justify-center neon-text text-primary">
              <Cpu className="w-6 h-6" />
            </div>
            <span className="font-mono font-black tracking-tighter uppercase text-lg">
              Architect <span className="text-primary italic">AI</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/app">
              <Button variant="outline" className="font-mono text-xs border-white/10 hover:bg-white/5 px-6">
                LAUNCH APP
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-primary mb-6 block neon-text">
              Autonomous Infrastructure Reasoning
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-8 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
              BUILD UNBREAKABLE <br />
              <span className="text-primary italic">CLOUD ARCHITECTURE</span> <br />
              WITH AI.
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Deploy a fleet of specialized AI agents—FinOps, SRE, and Performance—to validate your system before you write a single line of code.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link href="/app">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono font-bold tracking-widest px-10 h-14 shadow-[0_0_30px_rgba(0,255,255,0.2)] hover:shadow-[0_0_50px_rgba(0,255,255,0.4)] transition-all duration-500 hover:scale-105 active:scale-95 group">
                START SIMULATION
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<BarChart3 className="text-secondary" />}
              title="The FinOps Agent"
              description="Predicts cloud costs with 95% accuracy by analyzing resource allocation and traffic patterns."
              color="hsl(150 100% 45%)"
            />
            <FeatureCard 
              icon={<Shield className="text-orange-500" />}
              title="The SRE Agent"
              description="Identifies Single Points of Failure and resilience gaps instantly across your entire stack."
              color="hsl(35 100% 55%)"
            />
            <FeatureCard 
              icon={<Zap className="text-primary" />}
              title="The Architect"
              description="Optimizes for scalability and performance, resolving trade-offs before they become bottlenecks."
              color="hsl(180 100% 50%)"
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/5 bg-black/20">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 opacity-40 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5" />
            <span className="font-mono text-xs uppercase tracking-widest">Architect AI v1.0</span>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-center">
            Designed for high-scale distributed systems analysis
          </p>
          <div className="flex gap-6 font-mono text-xs">
            <a href="#" className="hover:text-primary">GITHUB</a>
            <a href="#" className="hover:text-primary">DOCS</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-panel p-8 relative overflow-hidden group"
    >
      <div 
        className="absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity" 
        style={{ backgroundColor: color }}
      />
      <div className="w-12 h-12 rounded bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-2xl">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 tracking-tight">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
