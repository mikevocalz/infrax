import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Data for v1
  const assets = [
    { id: 'site-001', name: 'Northern Virginia Hub', type: 'Data Center', provider: 'Equinix', capacity_mw: 15, status: 'Active', location: 'Ashburn, VA' },
    { id: 'site-002', name: 'West Coast AI Cluster', type: 'Cloud', provider: 'AWS', capacity_mw: 5, status: 'Provisioning', location: 'us-west-2' },
    { id: 'site-003', name: 'European Edge Node', type: 'Edge', provider: 'Digital Realty', capacity_mw: 2, status: 'Active', location: 'Frankfurt, DE' },
  ];

  const signals = [
    { id: 'sig-001', category: 'GRID', text: 'PJM Interconnect queue delays extending to 36 months.', severity: 'High' },
    { id: 'sig-002', category: 'POLICY', text: 'New EU Data Sovereignty laws impacting cross-border AI training.', severity: 'Medium' },
    { id: 'sig-003', category: 'CAPACITY', text: 'Off-market 20MW capacity identified in secondary Ohio market.', severity: 'Low' },
  ];

  // API Routes
  app.get("/api/v1/assets", (req, res) => {
    res.json(assets);
  });

  app.get("/api/v1/intel/signals", (req, res) => {
    res.json(signals);
  });

  app.get("/api/v1/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`InFraAlign™ OS Server running on http://localhost:${PORT}`);
  });
}

startServer();
