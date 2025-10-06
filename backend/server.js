// server.js - Render Deployment Ready
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import http from "http";
import { Server } from "socket.io";

import userRoutes from "./routes/userRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: [
      "https://eventorams.vercel.app/", 
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

const prisma = new PrismaClient();

(async () => {
  try {
    await prisma.$connect();
    console.log("✅ Connected to MySQL Database via Prisma");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  }
})();

const io = new Server(server, {
  cors: {
    origin: [
      "https://eventorams.vercel.app/", 
      "http://localhost:5173",
    ],
  },
});

app.set("io", io);

app.get("/", (req, res) => res.send("API running ✅"));

app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);

const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
