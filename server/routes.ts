import type { Express } from "express";
import type { Server } from "http";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  console.log("✅ Routes registered");

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // THE NEW N8N INTEGRATION ROUTE
  app.post("/api/analyze-architecture", async (req, res) => {
    try {
      console.log("⚡ Sending request to n8n...");

      // 1. Prepare data for n8n
      const n8nPayload = {
        description: req.body.description || "No description",
        budget: req.body.budget,
        users: req.body.users,
        uptime: req.body.uptime
      };

      // 2. Call n8n Webhook
      const N8N_URL = process.env.N8N_WEBHOOK_URL || "YOUR_N8N_WEBHOOK_URL_HERE"; 
      
      const response = await fetch(N8N_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(n8nPayload)
      });

      if (!response.ok) {
        throw new Error(`n8n Error: ${response.statusText}`);
      }

      const rawData = await response.json();
      console.log("📦 Received from n8n:", JSON.stringify(rawData).slice(0, 100) + "...");

      // 3. Handle n8n Array vs Object format
      const n8nItem = Array.isArray(rawData) ? rawData[0] : rawData;
      let data = n8nItem.json ? n8nItem.json : n8nItem;

      // Handle Gemini nested structure if present (content.parts[0].text)
      if (data.content?.parts?.[0]?.text) {
        try {
          const text = data.content.parts[0].text;
          const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || [null, text];
          const cleanJson = jsonMatch[1].trim();
          data = JSON.parse(cleanJson);
        } catch (e) {
          console.error("⚠️ Failed to parse deep nested JSON", e);
        }
      }

      console.log("🔍 N8N Data Keys:", Object.keys(data));
      const rawRisk = data.riskScore || data.score || 0;
      const riskScore = 100 - rawRisk;
      const rawDiagram = data.architectureDiagram || data.diagram || data.mermaid || "";
      console.log("Risk:", riskScore, "Diagram Size:", rawDiagram.length);

      // 4. Transform to match your UI's expected format
      const findCost = (obj: any): string => {
        if (!obj) return "N/A";
        // Check standard keys
        const keys = ["monthlyCost", "cost", "estimatedCost", "estimatedMonthlyCost", "total_cost", "totalCost", "budget"];
        for (const key of keys) {
          if (obj[key] && obj[key] !== "N/A") return String(obj[key]);
        }
        // Check nested objects
        if (obj.analysis && typeof obj.analysis === 'object') return findCost(obj.analysis);
        if (obj.consensus && typeof obj.consensus === 'object') return findCost(obj.consensus);
        if (obj.costAgent && typeof obj.costAgent === 'object') return findCost(obj.costAgent);
        
        return "N/A";
      };

      const finalCost = findCost(data);
      console.log("💰 Determined Cost:", finalCost);
      
      const uiResponse = {
        riskScore: riskScore,
        monthlyCost: finalCost,
        architectureDiagram: rawDiagram, 
        
        // Map n8n findings to specific Agent Card reasoning
        agentData: [
          {
            agentName: "Performance Architect",
            reasoning: data.reasoning || `Optimization recommendations: ${(data.recommendations || []).join(", ")}`
          },
          {
            agentName: "Cost Architect",
            reasoning: `Estimated Monthly Cost: ${finalCost}.`
          },
          {
            agentName: "Reliability Architect",
            reasoning: `System Risks: ${(data.keyFindings || data.bottlenecks || []).join(", ")}`
          },
          {
            agentName: "Consensus Engine",
            reasoning: data.reasoning || data.synthesis || data.summary || "Final architectural synthesis complete. View report for details."
          }
        ],
        
        // Fill the text boxes
        bottlenecks: data.keyFindings || data.bottlenecks || [],
        suggestedImprovements: data.recommendations || data.improvements || [],
        securityRisks: data.securityRisks || [], 
        scalabilityLimits: data.scalabilityLimits || [],
        spof: data.spof || [],
        reasoning: data.reasoning || ""
      };

      res.json(uiResponse);

    } catch (err) {
      console.error("❌ Analysis failed:", err);
      res.status(500).json({ error: "Analysis failed", details: err instanceof Error ? err.message : String(err) });
    }
  });

  // Keep compatibility for both endpoints
  app.post("/api/analyze", async (req, res) => {
    // Forward /api/analyze to the same logic
    try {
      // Re-use logic or essentially call the same handler
      // For simplicity, we can just redirect or re-run the same code block.
      // But since we are already inside registerRoutes, let's just make sure it's a POST.
      const n8nPayload = {
        description: req.body.description || "No description",
        budget: req.body.budget,
        users: req.body.users,
        uptime: req.body.uptime
      };

      const N8N_URL = process.env.N8N_WEBHOOK_URL || ""; 
      const response = await fetch(N8N_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(n8nPayload)
      });

      if (!response.ok) throw new Error(`n8n Error: ${response.statusText}`);
      
      const rawData = await response.json();
      const n8nItem = Array.isArray(rawData) ? rawData[0] : rawData;
      let data = n8nItem.json ? n8nItem.json : n8nItem;

      // Gemini/Nested parsing
      if (data.content?.parts?.[0]?.text) {
        try {
          const text = data.content.parts[0].text;
          const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || [null, text];
          data = JSON.parse(jsonMatch[1].trim());
        } catch (e) {}
      }

      const rawRisk = data.riskScore || data.score || 0;
      const riskScore = 100 - rawRisk;
      const rawDiagram = data.architectureDiagram || data.diagram || data.mermaid || "";
      const monthlyCost = data.monthlyCost || data.cost || data.budget || data.estimatedCost || "N/A";

      // Final transformation
      res.json({
        riskScore: riskScore,
        monthlyCost: monthlyCost,
        architectureDiagram: rawDiagram,
        agentData: [
          { agentName: "Performance", reasoning: data.reasoning || "Analyzing..." },
          { agentName: "Cost", reasoning: `Cost: ${monthlyCost}` },
          { agentName: "Reliability", reasoning: `Risks: ${(data.keyFindings || []).join(", ")}` },
          { agentName: "Consensus", reasoning: `Score: ${riskScore}/100` }
        ],
        bottlenecks: data.keyFindings || data.bottlenecks || [],
        suggestedImprovements: data.recommendations || data.improvements || []
      });
    } catch (err) {
      res.status(500).json({ error: "Analysis failed", details: String(err) });
    }
  });

  return httpServer;
}