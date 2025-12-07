import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true, 
    index: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  avatar: String,
  stats: {
    mmr: { type: Number, default: 1000 }, // Starting MMR
    matchesPlayed: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    avgWpm: { type: Number, default: 0 },
    bestWpm: { type: Number, default: 0 }
  }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
export default User;