import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { getMembers } from "./routes/members";
import { getSessions } from "./routes/sessions";
import { getReports } from "./routes/reports";
import { createSession } from "./routes/sessions-create";
import { loginChef } from "./routes/login";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Debug endpoint
  app.get("/api/health", (_req, res) => {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    res.json({
      status: "ok",
      supabaseUrl: supabaseUrl ? supabaseUrl.substring(0, 30) + "..." : "NOT SET",
      hasServiceKey: !!supabaseServiceKey,
    });
  });

  // Data endpoints (using Service Role Key for RLS bypass)
  app.post("/api/login", loginChef);
  app.get("/api/members", getMembers);
  app.get("/api/sessions", getSessions);
  app.post("/api/sessions", createSession);
  app.get("/api/reports", getReports);

  return app;
}
