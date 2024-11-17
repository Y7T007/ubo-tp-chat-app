import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    const key = new URL(request.url).searchParams.get("key");
    if (!key) {
        return new Response(JSON.stringify({ message: "Bad Request" }), {
            status: 400,
            headers: { 'content-type': 'application/json' },
        });
    }

    const imageBase64 = await redis.get(key);
    if (!imageBase64) {
        return new Response(JSON.stringify({ message: "Not Found" }), {
            status: 404,
            headers: { 'content-type': 'application/json' },
        });
    }

    return new Response(imageBase64, {
        status: 200,
        headers: { 'content-type': 'text/plain' },
    });
}