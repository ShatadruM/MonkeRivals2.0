import { createClient } from 'redis';

// Initialize the Redis client using the environment variable
const redisClient = createClient({
  url: process.env.REDIS_URI || 'redis://localhost:6379'
});

// Error handling for monitoring
redisClient.on('error', (err) => console.error('Redis Client Error', err));

// Connect function
const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Redis Client Connected');
  } catch (err) {
    console.error('Redis connection failed:', err);
    process.exit(1);
  }
};

export { redisClient, connectRedis };