import { getConnecterUser, unauthorizedResponse } from "../lib/session";
import { sql } from "@vercel/postgres";

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

        if (request.method === "GET") {
            const { rowCount, rows } = await sql`
                SELECT * FROM messages
                WHERE to_user = ${user.id}
                  AND created_on >= NOW() - INTERVAL '2 minutes'
                ORDER BY created_on DESC
            `;

            if (rowCount > 0) {
                // Send a notification using Pusher Beams
                const pusherResponse = await fetch("https://cbb93ff3-7b76-4414-9c3c-9a8b2d20902b.pushnotifications.pusher.com/publish_api/v1/instances/cbb93ff3-7b76-4414-9c3c-9a8b2d20902b/publishes", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${process.env.PUSHER_BEAMS_AUTH_TOKEN}`,
                    },
                    body: JSON.stringify({
                        interests: [user.id.toString()],
                        web: {
                            notification: {
                                title: "New Message",
                                body: rows[0].content,
                                icon: "https://www.univ-brest.fr/themes/custom/ubo_parent/favicon.ico",
                                deep_link: ""
                            }
                        }
                    })
                });

                if (!pusherResponse.ok) {
                    console.error("Failed to send push notification");
                }
            }

            return new Response(JSON.stringify(rows), {
                status: 200,
                headers: { 'content-type': 'application/json' },
            });
        } else {
            return new Response(JSON.stringify({ message: "Method Not Allowed" }), {
                status: 405,
                headers: { 'content-type': 'application/json' },
            });
        }
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), {
            status: 500,
            headers: { 'content-type': 'application/json' },
        });
    }
}