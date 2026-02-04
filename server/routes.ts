import type { Express } from "express";
import type { Server } from "http";
import { analyzeArchitecture } from "./geminiService.ts";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  console.log("✅ registerRoutes called");
  // Health check
  app.get("/api/health", (_req, res) => {
    res
      .status(200)
      .set("Content-Type", "application/json")
      .send(JSON.stringify({ status: "ok" }));
  });

  // Core Gemini multi-agent analysis
  app.post("/api/analyze", async (req, res, next) => {
    try {
      const result = await analyzeArchitecture(req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  return httpServer;
}