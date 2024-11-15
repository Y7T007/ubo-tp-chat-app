import PushNotifications from "@pusher/push-notifications-server";

const beamsClient = new PushNotifications({
    instanceId: process.env.PUSHER_INSTANCE_ID,
    secretKey: process.env.PUSHER_SECRET_KEY,
});

export default async function handler(request, response) {
    try {
        const { userIds, title, body } = request.body;
        if (!userIds || !title || !body) {
            return response.status(400).json({ message: "Bad Request" });
        }

        const publishResponse = await beamsClient.publishToUsers(userIds, {
            web: {
                notification: {
                    title: title,
                    body: body,
                },
            },
        });

        return response.status(200).json({ message: "Notification sent", publishId: publishResponse.publishId });
    } catch (error) {
        console.error("Error sending notification:", error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
}