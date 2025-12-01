import admin from '../config/firebase.js';

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the ID token sent from the client
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Attach user info to request
    req.user = decodedToken; 
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(403).json({ error: 'Unauthorized: Invalid token' });
  }
};