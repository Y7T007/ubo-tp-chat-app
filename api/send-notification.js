import PushNotifications from "@pusher/push-notifications-server";
import { Redis } from "@upstash/redis";
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

        const { recipientId, messageContent } = await request.body;
        if (!recipientId || !messageContent) {
            return new Response(JSON.stringify({ message: "Bad Request" }), {
                status: 400,
                headers: { 'content-type': 'application/json' },
            });
        }

        try {
            await beamsClient.publishToUsers([recipientId], {
                interests: [recipientId],
                web: {
                    notification: {
                        title: "New Message",
                        body: `New message: ${messageContent}`,
                        deep_link: 'https://your-app.com/messages',
                    },
                }
            });
            console.log("Notification sent successfully");
            return new Response(JSON.stringify({ message: "Notification sent" }), {
                status: 200,
                headers: { 'content-type': 'application/json' },
            });
        } catch (notificationError) {
            console.error("Error sending notification:", notificationError);
            return new Response(JSON.stringify({ message: "Error sending notification" }), {
                status: 500,
                headers: { 'content-type': 'application/json' },
            });
        }
    } catch (error) {
        console.error("Error:", error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), {
            status: 500,
            headers: { 'content-type': 'application/json' },
        });
    }
}

export async function getConnecterUser(request) {
    let token = new Headers(request.headers).get('Authorization');
    if (!token) {
        return null;
    } else {
        token = token.replace("Bearer ", "");
    }
    console.log("checking " + token);
    const user = await redis.get(token);
    if (user) {
        console.log("Got user : " + user.username);
    }
    return user;
}

export function unauthorizedResponse() {
    const error = { code: "UNAUTHORIZED", message: "Session expired" };
    return new Response(JSON.stringify(error), {
        status: 401,
        headers: { 'content-type': 'application/json' },
    });
}