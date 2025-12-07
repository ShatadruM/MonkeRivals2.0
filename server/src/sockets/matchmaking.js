import TypingContent from '../models/TypingContent.js';
import { redisClient } from '../config/redis.js'; 

const MATCH_QUEUE_KEY = 'matchmaking_queue';
const FALLBACK_TEXT = "The quick brown fox jumps over the lazy dog to demonstrate the typing test mechanics.";

const activeSockets = new Map();

const addToQueue = async (io, socket) => {
  activeSockets.set(socket.id, socket);

  await redisClient.lPush(MATCH_QUEUE_KEY, socket.id);
  console.log(`User ${socket.id} joined the Redis queue.`);

  const queueLength = await redisClient.lLen(MATCH_QUEUE_KEY);
  
  if (queueLength >= 2) {
    const player1Id = await redisClient.rPop(MATCH_QUEUE_KEY);
    const player2Id = await redisClient.rPop(MATCH_QUEUE_KEY);

    const player1 = io.sockets.sockets.get(player1Id);
    const player2 = io.sockets.sockets.get(player2Id);

    if (player1 && player2 && player1.id !== player2.id) {
        
        activeSockets.delete(player1Id);
        activeSockets.delete(player2Id);

        const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        player1.join(roomId);
        player2.join(roomId);

        // --- IMPROVED RANDOM FETCHING ---
        let content = FALLBACK_TEXT;
        try {
            // Use MongoDB Aggregation $sample to get 1 random document
            const randomDocs = await TypingContent.aggregate([
                { $sample: { size: 1 } }
            ]);

            if (randomDocs.length > 0) {
                content = randomDocs[0].text;
            }
        } catch (err) {
            console.error("Error fetching content:", err);
        }

        // Clean content
        content = content.trim();

        console.log(`Match found! Room: ${roomId}`);

        player1.emit('match_found', {
            roomId,
            content,
            opponent: { id: player2.id, name: `Rival-${player2.id.substring(0, 4)}` }, 
            startTime: Date.now() + 3000
        });
        
        player2.emit('match_found', {
            roomId,
            content,
            opponent: { id: player1.id, name: `Rival-${player1.id.substring(0, 4)}` },
            startTime: Date.now() + 3000 
        });
    } else {
        console.warn("Invalid player pair found in queue. Re-queuing.");
        if (player1 && activeSockets.has(player1.id)) await redisClient.lPush(MATCH_QUEUE_KEY, player1.id);
        if (player2 && activeSockets.has(player2.id)) await redisClient.lPush(MATCH_QUEUE_KEY, player2.id);
    }
  }
};

const removeFromQueue = async (socket) => {
  await redisClient.lRem(MATCH_QUEUE_KEY, 0, socket.id);
  activeSockets.delete(socket.id);
  console.log(`User ${socket.id} removed from queue.`);
};

export { addToQueue, removeFromQueue };