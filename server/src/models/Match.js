import mongoose from 'mongoose';

const MatchSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  participants: [{ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Link to User Profile
    socketId: String,
    wpm: Number,
    accuracy: Number,
    rank: Number // 1 = Winner, 2 = Loser
  }],
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  playedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Match = mongoose.model('Match', MatchSchema);
export default Match;