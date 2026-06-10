import dotenv from "dotenv";
dotenv.config();

import { app } from "./app";
import { Request, Response } from "express";

const PORT = process.env.PORT || 5000;

app.get("/", (_req: Request, res: Response) => {
  res.send(
    "<p style='color:#6C63FF;font-family:sans-serif;font-size:1.5rem'>🎬 Video Carousel API is running</p>"
  );
});

app.listen(PORT, () => {
  console.log(`✅ Server running  → http://localhost:${PORT}`);
  console.log(`📼 Videos API      → http://localhost:${PORT}/api/v1/videos`);
});