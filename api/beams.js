import { getConnecterUser } from '../lib/session';
import PushNotifications from "@pusher/push-notifications-server";

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    try {
        const user = await getConnecterUser(request);
        if (!user) {
            console.log("Not connected");
            return new Response(JSON.stringify({ code: "UNAUTHORIZED", message: "Session expired" }), {
                status: 401,
                headers: { 'content-type': 'application/json' },
            });
        }
        if (request.method !== "GET") {
            return new Response(JSON.stringify({ message: "Method Not Allowed" }), {
                status: 405,
                headers: { 'content-type': 'application/json' },
            });
        }

        const userIDInQueryParam = new URL(request.url).searchParams.get("user_id");

        console.log("PushToken : " + userIDInQueryParam + " -> " + JSON.stringify(user));

        if (!user || user.externalId !== userIDInQueryParam) {
            console.log("Not connected");
            return new Response(JSON.stringify({ code: "UNAUTHORIZED", message: "Session expired" }), {
                status: 401,
                headers: { 'content-type': 'application/json' },
            });
        }

        console.log("Using push instance : " + process.env.PUSHER_INSTANCE_ID);
        const beamsClient = new PushNotifications({
            instanceId: process.env.PUSHER_INSTANCE_ID,
            secretKey: process.env.PUSHER_SECRET_KEY,
        });

        const beamsToken = beamsClient.generateToken(user.externalId);
        console.log(JSON.stringify(beamsToken));
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