
const Redis = require("ioredis");

const redis = new Redis("redis://127.0.0.1:6379");

redis.on('connect', () => {
  console.log("✅ Connected to Redis");
});

redis.on('error', (err) => {
  console.error("❌ Redis connection error:", err);
});

(async () => {
  try {
    const pong = await redis.ping();
    console.log("Redis PING response:", pong); // Should be: PONG

    await redis.set("test_key", "hello");
    const val = await redis.get("test_key");
    console.log("Value from Redis:", val); // Should be: hello
  } catch (err) {
    console.error("Error during Redis operations:", err);
  } finally {
    redis.disconnect();
  }
})();
