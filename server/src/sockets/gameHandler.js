import Match from '../models/Match.js';
import User from '../models/User.js';

// Map to store temporary results: { roomId: [ { userId, wpm, time } ] }
const roomResults = new Map();

const handleGameEvents = (io, socket) => {
    
    //  Progress Update
    socket.on('update_progress', (data) => {
      socket.to(data.roomId).emit('opponent_progress', {
        userId: socket.id,
        percentage: data.percentage,
        wpm: data.wpm
      });
    });
  
    // Game Finished
    socket.on('game_finished', async (data) => {
      console.log(`[DEBUG] RECEIVED game_finished from ${socket.id}`);
      console.log(`[DEBUG] Payload:`, data);

      const { roomId, wpm, accuracy, mongoUserId } = data; 
      const finishTime = Date.now();

      if (!roomResults.has(roomId)) {
        roomResults.set(roomId, []);
      }

      const results = roomResults.get(roomId);
      
      // Prevent duplicate submissions
      if (results.some(r => r.socketId === socket.id)) {
          console.log(`[DEBUG] Duplicate submission blocked for ${socket.id}`);
          return;
      }

      // Add this player's result
      results.push({
        socketId: socket.id,
        mongoUserId: mongoUserId || null,
        wpm,
        accuracy: accuracy || 0,
        time: finishTime
      });

      console.log(`[DEBUG] Room ${roomId} results count: ${results.length}/2`);

      // CHECK: Have both players finished?
      if (results.length === 2) {
        console.log(`[DEBUG] Both players finished. Calculating winner...`);
        
        // Sort by WPM (descending). Tie-breaker: Time (ascending)
        results.sort((a, b) => {
            if (b.wpm !== a.wpm) return b.wpm - a.wpm;
            return a.time - b.time; 
        });

        // Assign Ranks
        results.forEach((r, index) => r.rank = index + 1);

        const winner = results[0];

         // Broadcast Results
        io.to(roomId).emit('game_over', {
          results: results, 
          winnerId: winner.socketId
        });

        roomResults.delete(roomId);

        // --- SAVE TO DATABASE ---
        try {
            const hasLoggedInUser = results.some(r => r.mongoUserId);
            console.log(`[DEBUG] Has logged in user? ${hasLoggedInUser}`);

            if (hasLoggedInUser) {
                
                // Create Match Record
                const matchRecord = new Match({
                    roomId,
                    participants: results.map(r => ({
                        user: r.mongoUserId, 
                        socketId: r.socketId,
                        wpm: r.wpm,
                        accuracy: r.accuracy,
                        rank: r.rank
                    })),
                    winner: winner.mongoUserId
                });
                
                console.log(`[DEBUG] Saving Match to MongoDB...`);
                await matchRecord.save();
                console.log(`[DEBUG] Match saved! ID: ${matchRecord._id}`);

                // Update User Stats & MMR
                for (const r of results) {
                    if (r.mongoUserId) {
                        const user = await User.findById(r.mongoUserId);
                        if (user) {
                            user.stats.matchesPlayed += 1;
                            if (r.rank === 1) user.stats.wins += 1;
                            
                            const currentTotal = user.stats.matchesPlayed;
                            const oldTotalWpm = user.stats.avgWpm * (currentTotal - 1);
                            user.stats.avgWpm = Math.round((oldTotalWpm + r.wpm) / currentTotal);
                            
                            if (r.wpm > user.stats.bestWpm) user.stats.bestWpm = r.wpm;

                            const mmrChange = r.rank === 1 ? 30 : -20;
                            user.stats.mmr += mmrChange;
                            if (user.stats.mmr < 0) user.stats.mmr = 0;

                            await user.save();
                            console.log(`[DEBUG] Updated stats for ${user.username}: MMR ${user.stats.mmr}`);
                        } else {
                            console.log(`[DEBUG] User not found in DB: ${r.mongoUserId}`);
                        }
                    }
                }
            } else {
                console.log(`[DEBUG] Skipping DB save (No logged-in users)`);
            }
        } catch (err) {
            console.error("[DEBUG] Error saving match data:", err);
        }

       

      } else {
        console.log(`[DEBUG] Waiting for opponent in room ${roomId}`);
        socket.emit('waiting_for_opponent');
        socket.to(roomId).emit('opponent_finished', { wpm });
      }
    });
};
  
export default handleGameEvents;