import User from '../models/User.js';

export const syncUser = async (req, res) => {
  const { uid, email, name, picture } = req.user; // Data from Firebase Token

  try {
    // Check if user exists in our DB
    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      // First time login: Create new user
      console.log(`Creating new user for ${email}`);
      user = new User({
        firebaseUid: uid,
        username: name || email.split('@')[0], // Fallback username
        email: email,
        avatar: picture
      });
      await user.save();
    }

    // Return the Mongodb User Document (contains MMR, stats)
    res.status(200).json(user);
  } catch (error) {
    console.error("Auth Sync Error:", error);
    res.status(500).json({ error: "Server error during auth sync" });
  }
};