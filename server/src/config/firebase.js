import admin from 'firebase-admin';
import { createRequire } from 'module';

// Native ESM import for JSON is experimental, so we use createRequire
const require = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccountKey.json');

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("Firebase Admin Initialized");
} catch (error) {
  console.error("Firebase Admin Initialization Error:", error);
}

export default admin;