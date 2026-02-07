import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LayoutGrid, AlertCircle, CheckCircle2, Zap } from "lucide-react";

interface SystemBlueprintProps {
  data: {
    bottlenecks?: string[];
    suggestedImprovements?: string[];
    riskScore?: number;
    monthlyCost?: string;
  };
}

export function SystemBlueprint({ data }: SystemBlueprintProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="border-primary/20 bg-black/40 overflow-hidden">
        <CardHeader className="bg-primary/5 border-b border-primary/10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-mono uppercase tracking-[0.3em] text-primary flex items-center gap-2">
              <LayoutGrid className="w-4 h-4" />
              Architecture Blueprint
            </CardTitle>
            <Badge variant="outline" className="border-primary/50 text-primary font-mono text-[10px]">
              V1.0.RC
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Summary Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-white/5 border border-white/10 rounded space-y-1">
              <div className="text-[10px] font-mono text-muted-foreground uppercase">Estimated Cost</div>
              <div className="text-lg font-mono font-bold text-secondary">{data.monthlyCost || "N/A"}</div>
            </div>
            <div className="p-3 bg-white/5 border border-white/10 rounded space-y-1">
              <div className="text-[10px] font-mono text-muted-foreground uppercase">Risk Level</div>
              <div className="text-lg font-mono font-bold text-primary">{data.riskScore || 0}%</div>
            </div>
          </div>

          {/* Critical Analysis */}
          <div className="space-y-4">
            <div>
              <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-red-400 mb-3 flex items-center gap-2">
                <AlertCircle className="w-3 h-3" />
                Detected Bottlenecks
              </h3>
              <div className="space-y-2">
                {data.bottlenecks && data.bottlenecks.length > 0 ? (
                  data.bottlenecks.map((item, i) => (
                    <div key={i} className="text-xs font-mono text-muted-foreground border-l-2 border-red-500/50 pl-3 py-1 bg-red-500/5">
                      {item}
                    </div>
                  ))
                ) : (
                  <div className="text-xs font-mono text-muted-foreground opacity-50 italic">No critical bottlenecks identified.</div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-green-400 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3" />
                Strategic Improvements
              </h3>
              <div className="space-y-2">
                {data.suggestedImprovements && data.suggestedImprovements.length > 0 ? (
                  data.suggestedImprovements.map((item, i) => (
                    <div key={i} className="text-xs font-mono text-muted-foreground border-l-2 border-green-500/50 pl-3 py-1 bg-green-500/5">
                      {item}
                    </div>
                  ))
                ) : (
                  <div className="text-xs font-mono text-muted-foreground opacity-50 italic">No specific improvements suggested.</div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-4 justify-center py-4 grayscale opacity-30">
        <Zap className="w-4 h-4" />
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <span className="text-[8px] font-mono uppercase tracking-[0.5em]">System Logic Confirmed</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
    </div>
  );
}
