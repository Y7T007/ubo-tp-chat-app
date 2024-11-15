import { getConnecterUser } from '../lib/session';
import PushNotifications from "@pusher/push-notifications-server";

export default async function handler(request, response) {
    try {
        const user = await getConnecterUser(request);
        if (!user) {
            console.log("Not connected");
            return response.status(401).json({ code: "UNAUTHORIZED", message: "Session expired" });
        }
        if (request.method !== "GET") {
            return response.status(405).json({ message: "Method Not Allowed" });
        }

        const userIDInQueryParam = request.query.user_id;

        console.log("PushToken : " + userIDInQueryParam + " -> " + JSON.stringify(user));

        if (!user || user.externalId !== userIDInQueryParam) {
            console.log("Not connected");
            return response.status(401).json({ code: "UNAUTHORIZED", message: "Session expired" });
        }

        console.log("Using push instance : " + process.env.PUSHER_INSTANCE_ID);
        const beamsClient = new PushNotifications({
            instanceId: process.env.PUSHER_INSTANCE_ID,
            secretKey: process.env.PUSHER_SECRET_KEY,
        });

        const beamsToken = beamsClient.generateToken(user.externalId);
        console.log(JSON.stringify(beamsToken));
        return response.status(200).json(beamsToken);

    } catch (error) {
        console.error("Error generating beams token:", error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
}

export async function publishNotificationToUsers(userIds, notification) {
    try {
        const beamsClient = new PushNotifications({
            instanceId: process.env.PUSHER_INSTANCE_ID,
            secretKey: process.env.PUSHER_SECRET_KEY,
        });

        const publishResponse = await beamsClient.publishToUsers(userIds, notification);
        console.log("Just published:", publishResponse.publishId);
    } catch (error) {
        console.error("Error publishing notification:", error);
    }
}