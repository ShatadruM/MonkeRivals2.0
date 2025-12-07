import mongoose from 'mongoose';

const MatchSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  participants: [{ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    socketId: String,
    wpm: Number,
    accuracy: Number,
    rank: Number // 1st, 2nd
  }],
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  playedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Match = mongoose.model('Match', MatchSchema);
export default Match;