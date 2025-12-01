// Map to store temporary results: { roomId: [ { userId, wpm, time } ] }
const roomResults = new Map();

const handleGameEvents = (io, socket) => {
    
    // 1. Progress Update
    // Broadcasts live WPM/Progress to the opponent so their bar moves
    socket.on('update_progress', (data) => {
      socket.to(data.roomId).emit('opponent_progress', {
        userId: socket.id,
        percentage: data.percentage,
        wpm: data.wpm
      });
    });
  
    // 2. Game Finished (Wait for both players logic)
    socket.on('game_finished', (data) => {
      const { roomId, wpm } = data;
      const finishTime = Date.now();

      // Initialize room array if it doesn't exist yet
      if (!roomResults.has(roomId)) {
        roomResults.set(roomId, []);
      }

      const results = roomResults.get(roomId);
      
      // Safety: Prevent duplicate submissions from the same user
      if (results.some(r => r.userId === socket.id)) return;

      // Add this player's result to the list
      results.push({
        userId: socket.id,
        wpm: wpm,
        time: finishTime
      });

      // CHECK: Have both players finished? (Assuming 2-player limit)
      if (results.length === 2) {
        // --- BOTH FINISHED ---
        
        // Sort by WPM (descending). If WPM is tied, the faster time wins.
        results.sort((a, b) => {
            if (b.wpm !== a.wpm) return b.wpm - a.wpm;
            return a.time - b.time; 
        });

        const winner = results[0];

        console.log(`Match ${roomId} Complete. Winner: ${winner.userId}`);

        // Broadcast final results to everyone in the room
        io.to(roomId).emit('game_over', {
          results: results, 
          winnerId: winner.userId
        });

        // Cleanup memory
        roomResults.delete(roomId);

      } else {
        // --- ONLY THIS PLAYER FINISHED ---
        
        // 1. Tell THIS player to wait
        socket.emit('waiting_for_opponent');
        
        // 2. Notify the opponent that this player has finished (adds pressure)
        socket.to(roomId).emit('opponent_finished', { wpm });
      }
    });
};
  
export default handleGameEvents;