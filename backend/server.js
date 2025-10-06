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


const ALLOWED_ORIGINS = [
    "https://eventora-n7whhvu07-avitapope-gmailcoms-projects.vercel.app", 
    "https://eventorams.vercel.app", 
    "http://localhost:5173",
];

const corsOptions = {
    origin: (origin, callback) => {
      
        if (!origin || ALLOWED_ORIGINS.includes(origin)) {
            callback(null, true);
        } else {
            console.error(`CORS blocked request from: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, 
};

app.use(cors(corsOptions));

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
    origin: (origin, callback) => {
        if (!origin || ALLOWED_ORIGINS.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
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