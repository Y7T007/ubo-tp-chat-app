import PushNotifications from "@pusher/push-notifications-server";
import { sql } from "@vercel/postgres";

export default async function handler(request, response) {
    if (request.method !== "POST") {
        return response.status(405).json({ message: "Method Not Allowed" });
    }

    const { userIds, notification } = request.body;

    try {
        const beamsClient = new PushNotifications({
            instanceId: process.env.PUSHER_INSTANCE_ID,
            secretKey: process.env.PUSHER_SECRET_KEY,
        });

        const externalIds = [];
        for (const userId of userIds) {
            const { rows } = await sql`SELECT external_id FROM users WHERE user_id = ${userId}`;
            if (rows.length > 0) {
                externalIds.push(rows[0].external_id);
            }
        }

        const publishResponse = await beamsClient.publishToUsers(externalIds, notification);
        console.log("Just published:", publishResponse.publishId);
        return response.status(200).json({ message: "Notification published" });
    } catch (error) {
        console.error("Error publishing notification:", error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
}