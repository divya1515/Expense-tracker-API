import { createClient } from "redis";

const redisClient=createClient({
    url:process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on(
    'error',
    (err)=>console.error('redis Client error',err))

await redisClient.connect();

export default redisClient;