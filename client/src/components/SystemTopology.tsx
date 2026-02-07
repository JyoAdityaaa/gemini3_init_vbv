import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Server, Database, Cloud, Shield, Cpu } from "lucide-react";

// Helper to pick icons
const getIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes("db") || lower.includes("sql") || lower.includes("storage")) return <Database className="w-4 h-4 text-blue-400" />;
  if (lower.includes("web") || lower.includes("client") || lower.includes("browser")) return <Globe className="w-4 h-4 text-green-400" />;
  if (lower.includes("firewall") || lower.includes("security")) return <Shield className="w-4 h-4 text-red-400" />;
  if (lower.includes("lambda") || lower.includes("function")) return <Cpu className="w-4 h-4 text-orange-400" />;
  return <Server className="w-4 h-4 text-purple-400" />;
};

export function SystemTopology({ diagram }: { diagram: string }) {
  // Enhanced Parser
  const parseMermaid = (text: string) => {
    const nodeDefs = new Map<string, string>();
    const connections: { from: string; to: string }[] = [];

    const lines = text.split('\n');
    
    // 1. First pass: Find all [Label] definitions and NodeIDs
    lines.forEach(line => {
      // Find ID[Label] or ID["Label"] or ID([Label])
      const defMatch = line.match(/(\w+)\s*[\[\({]+(.*?)[\]\)}]+/g);
      if (defMatch) {
         defMatch.forEach(m => {
           const parts = m.match(/(\w+)\s*[\[\({]+(.*?)[\]\)}]+/);
           if (parts) {
             nodeDefs.set(parts[1], parts[2].replace(/"/g, ''));
           }
         });
      }
    });

    // 2. Second pass: Find connections
    lines.forEach(line => {
      if (line.includes('-->')) {
        const parts = line.split('-->');
        if (parts.length >= 2) {
          const fromId = parts[0].trim().match(/(\w+)/)?.[1];
          const toId = parts[1].trim().match(/(\w+)/)?.[1];
          
          if (fromId && toId) {
            connections.push({
              from: nodeDefs.get(fromId) || fromId,
              to: nodeDefs.get(toId) || toId
            });
          }
        }
      }
    });

    return connections;
  };

  const connections = parseMermaid(diagram);

  if (connections.length === 0) {
    return (
      <Card className="h-full border-green-500/20 bg-black/40">
        <CardHeader>
          <CardTitle className="text-xs font-mono uppercase text-muted-foreground tracking-widest">
            System Topology Tree
          </CardTitle>
        </CardHeader>
        <CardContent className="font-mono text-sm p-4">
          <div className="text-muted-foreground italic">Waiting for architecture analysis...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full border-green-500/20 bg-black/40 flex flex-col">
      <CardHeader className="py-3 border-b border-white/10">
        <CardTitle className="text-xs font-mono uppercase text-muted-foreground tracking-widest flex items-center gap-2">
          <Server className="w-4 h-4" /> System Topology Tree
        </CardTitle>
      </CardHeader>
      <CardContent className="font-mono text-sm p-4 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
        {connections.map((conn, i) => (
          <div key={i} className="flex items-center gap-2 group">
            <div className="flex items-center gap-2 text-cyan-300">
              {getIcon(conn.from)}
              <span>{conn.from}</span>
            </div>
            <div className="text-muted-foreground opacity-50">──────▶</div>
            <div className="flex items-center gap-2 text-purple-300">
              {getIcon(conn.to)}
              <span>{conn.to}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
