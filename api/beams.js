import PushNotifications from "@pusher/push-notifications-server";
import { Redis } from "@upstash/redis";
const redis = Redis.fromEnv();

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    try {
        const user = await getConnecterUser(request);
        if (!user) {
            console.log("Not connected");
            return unauthorizedResponse();
        }
        if (request.method !== "GET") {
            return new Response(JSON.stringify({ message: "Method Not Allowed" }), {
                status: 405,
                headers: { 'content-type': 'application/json' },
            });
        }

        const userIDInQueryParam = new URL(request.url).searchParams.get("user_id");

        if (!user || user.externalId !== userIDInQueryParam) {
            console.log("Not connected");
            return unauthorizedResponse();
        }

        const beamsClient = new PushNotifications({
            instanceId: process.env.PUSHER_INSTANCE_ID,
            secretKey: process.env.PUSHER_SECRET_KEY,
        });

        const beamsToken = beamsClient.generateToken(user.externalId);
        return new Response(JSON.stringify(beamsToken), {
            status: 200,
            headers: { 'content-type': 'application/json' },
        });

    } catch (error) {
        console.error("Error generating beams token:", error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), {
            status: 500,
            headers: { 'content-type': 'application/json' },
        });
    }
}

async function getConnecterUser(request) {
    let token = new Headers(request.headers).get('Authorization');
    if (!token) {
        return null;
    } else {
        token = token.replace("Bearer ", "");
    }
    const user = await redis.get(token);
    return user;
}

function unauthorizedResponse() {
    const error = { code: "UNAUTHORIZED", message: "Session expired" };
    return new Response(JSON.stringify(error), {
        status: 401,
        headers: { 'content-type': 'application/json' },
    });
}