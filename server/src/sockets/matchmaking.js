import TypingContent from '../models/TypingContent.js';
import { redisClient } from '../config/redis.js'; 

// The Redis key for the queue
const MATCH_QUEUE_KEY = 'matchmaking_queue';
const FALLBACK_TEXT = "The quick brown";

// In-memory map to quickly retrieve connected socket objects by ID
// Redis stores ID strings, but we need the actual socket object to emit events.
const activeSockets = new Map();

const addToQueue = async (io, socket) => {
  // Store the socket object temporarily in a Map
  activeSockets.set(socket.id, socket);

  // 1. Add player ID to the Redis list (LPUSH)
  await redisClient.lPush(MATCH_QUEUE_KEY, socket.id);
  console.log(`User ${socket.id} joined the Redis queue.`);

  // 2. Check queue length (LLEN)
  const queueLength = await redisClient.lLen(MATCH_QUEUE_KEY);
  
  if (queueLength >= 2) {
    // 3. Pop two players from the queue (RPOP)
    const player1Id = await redisClient.rPop(MATCH_QUEUE_KEY);
    const player2Id = await redisClient.rPop(MATCH_QUEUE_KEY);

    // Retrieve the actual socket objects
    const player1 = io.sockets.sockets.get(player1Id);
    const player2 = io.sockets.sockets.get(player2Id);

    // --- Validation and Match Creation ---
    if (player1 && player2 && player1.id !== player2.id) {
        
        // Remove from the temporary map
        activeSockets.delete(player1Id);
        activeSockets.delete(player2Id);

        // Create the room
        const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        player1.join(roomId);
        player2.join(roomId);

        // Fetch random content (MongoDB logic)
        let content = FALLBACK_TEXT;
        try {
            const count = await TypingContent.countDocuments();
            if (count > 0) {
                const random = Math.floor(Math.random() * count);
                const doc = await TypingContent.findOne().skip(random);
                if (doc) content = doc.text;
            }
        } catch (err) {
            console.error("Error fetching content:", err);
        }

        console.log(`Match found! Room: ${roomId} | P1: ${player1.id} | P2: ${player2.id}`);

        // Emit 'match_found' to P1
        player1.emit('match_found', {
            roomId,
            content,
            opponent: { id: player2.id, name: `Rival-${player2.id.substring(0, 4)}` }, 
            startTime: Date.now() + 3000
        });
        
        // Emit 'match_found' to P2
        player2.emit('match_found', {
            roomId,
            content,
            opponent: { id: player1.id, name: `Rival-${player1.id.substring(0, 4)}` },
            startTime: Date.now() + 3000 
        });
    } else {
        // Re-add players if one disconnected or was already matched
        console.warn("Invalid player pair found in queue. Re-queuing valid players.");
        if (player1 && activeSockets.has(player1.id)) await redisClient.lPush(MATCH_QUEUE_KEY, player1.id);
        if (player2 && activeSockets.has(player2.id)) await redisClient.lPush(MATCH_QUEUE_KEY, player2.id);
    }
  }
};

const removeFromQueue = async (socket) => {
  // Remove socket ID from Redis list (LREM 0: remove all occurrences)
  await redisClient.lRem(MATCH_QUEUE_KEY, 0, socket.id);
  activeSockets.delete(socket.id);
  
  // Optional: Log queue size for debugging
  const len = await redisClient.lLen(MATCH_QUEUE_KEY);
  console.log(`User ${socket.id} removed from queue. Queue size: ${len}`);
};

export { addToQueue, removeFromQueue };