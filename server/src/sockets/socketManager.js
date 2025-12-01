import handleGameEvents from './gameHandler.js';
import { addToQueue, removeFromQueue } from './matchmaking.js';

const setupSockets = (io) => {
  io.on('connection', (socket) => {
    console.log(`New Client Connected: ${socket.id}`);

    // --- Matchmaking Events ---
    socket.on('join_queue', () => {
      addToQueue(io, socket);
    });

    socket.on('leave_queue', () => {
      removeFromQueue(socket);
    });

    // --- In-Game Events ---
    handleGameEvents(io, socket);

    // --- Disconnect ---
    socket.on('disconnect', () => {
      console.log(`Client Disconnected: ${socket.id}`);
      removeFromQueue(socket); // Ensure they are removed from queue
    });
  });
};

export default setupSockets;