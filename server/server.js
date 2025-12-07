import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import connectDB from './src/config/db.js';
import socketManager from './src/sockets/socketManager.js';
import { connectRedis } from './src/config/redis.js';
import authRoutes from './src/routes/auth.js';
import userRoutes from './src/routes/user.js';
import contentRoutes from './src/routes/content.js'; 

const app = express();
connectDB();
connectRedis(); 

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/content', contentRoutes); 

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

socketManager(io);

app.get('/', (req, res) => {
  res.send('MonkeRivals Backend is Running...');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});