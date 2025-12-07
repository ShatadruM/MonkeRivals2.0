import User from '../models/User.js';
import Match from '../models/Match.js';

export const getUserProfile = async (req, res) => {
  const { uid } = req.user; // From verifyToken middleware

  try {
    const user = await User.findOne({ firebaseUid: uid });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Fetch last 10 matches
    const matches = await Match.find({ "participants.user": user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('participants.user', 'username') // Get opponent names
      .populate('winner', 'username');

    res.json({ user, matches });
  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};