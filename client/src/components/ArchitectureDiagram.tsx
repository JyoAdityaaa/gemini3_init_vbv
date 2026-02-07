import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Maximize2, Minimize2, AlertCircle, Code } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ArchitectureDiagramProps {
  diagram: string;
  isVisible: boolean;
}

export default function ArchitectureDiagram({ diagram, isVisible }: ArchitectureDiagramProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showRaw, setShowRaw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: "dark",
      securityLevel: "loose",
      fontFamily: "Inter, sans-serif",
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis'
      }
    });
  }, []);

  const superParse = (raw: string) => {
    if (!raw) return "";

    // 1. Clean markdown blocks
    let clean = raw.replace(/```mermaid\n?([\s\S]*?)\n?```/g, "$1")
                   .replace(/```/g, "")
                   .trim();
    
    let lines = clean.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    // 2. Ensure header
    const hasHeader = lines.some(l => /^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|gantt|pie|gitGraph)/i.test(l));
    if (!hasHeader && lines.length > 0) {
       lines.unshift("graph TD");
    }

    // 3. Robust Line Parsing
    return lines.map(line => {
      // Logic for preserving subgraphs and ends
      if (line.toLowerCase().startsWith('subgraph') || line.toLowerCase().startsWith('end')) {
        return line;
      }

      // Logic for cleaning connections
      if (line.includes('-->') || line.includes('-.->') || line.includes('==>')) {
        const separator = line.includes('-->') ? '-->' : line.includes('-.->') ? '-.->' : '==>';
        return line.split(separator).map(part => {
          let text = part.trim();
          if (!text) return "";

          // Match ID[Label] or ID(Label) or ID{Label}
          const match = text.match(/^([\w\.\-]+)?\s*[\[\(\{\>](.*)[\]\)\}\>]$/);
          if (match) {
            const id = (match[1] || match[2]).replace(/[^\w]/g, '_');
            const label = match[2].trim();
            const startBracket = text.match(/[\[\(\{\>]/)?.[0] || '[';
            const endBracket = text.match(/[\]\)\}\>]/)?.[0] || ']';
            return `${id}${startBracket}"${label.replace(/"/g, "'")}"${endBracket}`;
          }
          
          // Raw text cleanup
          const safeId = text.replace(/[^\w]/g, '_');
          return `${safeId}["${text.replace(/"/g, "'")}"]`;
        }).join(` ${separator} `);
      }
      return line;
    }).join('\n');
  };

  useEffect(() => {
    if (isVisible && diagram && elementRef.current) {
      const cleanDiagram = superParse(diagram);
      const renderId = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
      
      elementRef.current.innerHTML = '';
      setError(null);

      try {
        mermaid.render(renderId, cleanDiagram).then(({ svg }) => {
          if (elementRef.current) {
            elementRef.current.innerHTML = svg;
          }
        }).catch(err => {
          console.error("Mermaid async error:", err);
          setError("Render failed. Using fallback view.");
        });
      } catch (err) {
        console.error("Mermaid sync error:", err);
        setError("Syntax error detected.");
      }
    }
  }, [diagram, isVisible]);

  if (!isVisible) return null;

  return (
    <Card className={`transition-all duration-300 bg-black/40 border-white/10 ${isExpanded ? "fixed inset-4 z-50 h-[95vh]" : "h-full"}`}>
      <CardHeader className="flex flex-row items-center justify-between py-3 border-b border-white/5">
        <CardTitle className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-cyan-500 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          SYSTEM BLUEPRINT
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRaw(!showRaw)}
            className="h-7 text-[9px] font-mono border-white/10 hover:bg-white/5 px-2 flex items-center gap-1"
          >
            {showRaw ? <Code className="w-3 h-3" /> : <Code className="w-3 h-3 opacity-50" />}
            {showRaw ? "VIEW DIAGRAM" : "VIEW CODE"}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 text-white/50 hover:text-white"
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="h-[calc(100%-50px)] w-full overflow-hidden bg-black/20 p-2">
        {showRaw ? (
          <div className="w-full h-full bg-black/40 p-4 font-mono text-xs text-cyan-300/70 overflow-auto custom-scrollbar rounded border border-white/5">
            <pre className="whitespace-pre-wrap">{superParse(diagram)}</pre>
          </div>
        ) : (
          <div className="w-full h-full overflow-auto flex items-center justify-center custom-scrollbar">
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10 p-6 text-center">
                <div className="flex flex-col items-center gap-2 max-w-xs">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                  <p className="text-xs font-mono text-red-400">{error}</p>
                  <Button variant="outline" size="sm" onClick={() => setShowRaw(true)} className="mt-2 text-[10px]">
                    DEBUG CODE
                  </Button>
                </div>
              </div>
            )}
            <div 
              ref={elementRef} 
              className="w-full h-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:h-auto"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
