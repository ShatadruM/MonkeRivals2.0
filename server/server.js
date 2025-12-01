import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import connectDB from './src/config/db.js';
import socketManager from './src/sockets/socketManager.js';
import { connectRedis } from './src/config/redis.js';

// --- NEW: Import Auth Routes ---
import authRoutes from './src/routes/auth.js'; 

// 1. Initialize App & DB Connections
const app = express();
connectDB();
connectRedis(); 

// 2. Middleware
app.use(cors());
app.use(express.json()); // <--- Crucial for reading JSON bodies

// --- NEW: Register Auth Routes ---
// This tells Express: "If a request starts with /api/auth, send it to authRoutes"
app.use('/api/auth', authRoutes); 

// 3. Create HTTP Server & Socket.io Server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

// 4. Setup Socket Logic
socketManager(io);

// 5. Basic API Routes (Health Check)
app.get('/', (req, res) => {
  res.send('MonkeRivals Backend is Running...');
});

// 6. Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});