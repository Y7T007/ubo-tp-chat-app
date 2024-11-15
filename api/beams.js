const { getConnecterUser } = require('../lib/session');
const PushNotifications = require("@pusher/push-notifications-server");
const { sql } = require("@vercel/postgres");

async function handler(request, response) {
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

async function publishNotificationToUsers(userIds, notification) {
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
    } catch (error) {
        console.error("Error publishing notification:", error);
    }
}

module.exports = { handler, publishNotificationToUsers };

if (require.main === module) {
    // Example usage
    const http = require('http');
    const url = require('url');

    const server = http.createServer((req, res) => {
        const parsedUrl = url.parse(req.url, true);
        req.query = parsedUrl.query;
        handler(req, res);
    });

    server.listen(3000, () => {
        console.log('Server running at http://localhost:3000/');
    });
}