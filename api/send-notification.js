import PushNotifications from "@pusher/push-notifications-server";
import { Redis } from "@upstash/redis";
import { sql } from "@vercel/postgres";
const redis = Redis.fromEnv();

const beamsClient = new PushNotifications({
    instanceId: process.env.PUSHER_INSTANCE_ID,
    secretKey: process.env.PUSHER_SECRET_KEY,
});

export default async function handler(request) {
    try {
        const user = await getConnecterUser(request);
        if (!user) {
            console.log("Not connected");
            return unauthorizedResponse();
        }

        if (request.method !== "POST") {
            return new Response(JSON.stringify({ message: "Method Not Allowed" }), {
                status: 405,
                headers: { 'content-type': 'application/json' },
            });
        }

        const { recipientId, messageContent } = await request.json();
        const { rowCount, rows } = await sql`SELECT external_id, username FROM users WHERE user_id = ${recipientId}`;
        if (rowCount === 0) {
            return new Response(JSON.stringify({ message: "User not found" }), {
                status: 404,
                headers: { 'content-type': 'application/json' },
            });
        }

        const externalId = rows[0].external_id;
        const currentUsername = rows[0].username;

        await beamsClient.publishToUsers([externalId], {
            web: {
                notification: {
                    title: currentUsername,
                    body: `New message: ${messageContent}`,
                    deep_link: 'https://your-app.com/messages',
                },
            },
        });

        return new Response(JSON.stringify({ message: "Notification sent" }), {
            status: 200,
            headers: { 'content-type': 'application/json' },
        });
    } catch (error) {
        console.error("Error sending notification:", error);
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