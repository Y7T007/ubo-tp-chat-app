import { getConnecterUser, unauthorizedResponse } from "../lib/session";
import { sql } from "@vercel/postgres";
import { Redis } from "@upstash/redis";
import { put } from "@vercel/blob";

const redis = Redis.fromEnv();

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    try {
        const user = await getConnecterUser(request);
        if (!user) return unauthorizedResponse();

        if (request.method === "GET") {
            const toUserId = new URL(request.url).searchParams.get("toUserId");
            if (!toUserId) {
                return new Response(JSON.stringify({ message: "Bad Request" }), {
                    status: 400,
                    headers: { 'content-type': 'application/json' },
                });
            }

            const { rowCount, rows } = await sql`
                SELECT * FROM messages
                WHERE (to_user = ${user.id} AND from_user = ${toUserId})
                   OR (to_user = ${toUserId} AND from_user = ${user.id})
                ORDER BY created_on ASC
            `;
            return new Response(JSON.stringify(rowCount === 0 ? [] : rows), {
                status: 200,
                headers: { 'content-type': 'application/json' },
            });
        }

        if (request.method === "POST") {
            const formData = await request.formData();
            const content = formData.get("content");
            const to = formData.get("to");
            const image = formData.get("image");

            if ((!content && !image) || !to) {
                return new Response(JSON.stringify({ message: "Bad Request" }), {
                    status: 400,
                    headers: { 'content-type': 'application/json' },
                });
            }

            let imageUrl = null;
            if (image) {
                const imageBuffer = await image.arrayBuffer();
                const blob = await put(`image_${Date.now()}`, imageBuffer, {
                    access: 'public',
                });
                imageUrl = blob.url;
            }

            await sql`
                INSERT INTO messages (from_user, to_user, content, image_url, created_on)
                VALUES (${user.id}, ${to}, ${content}, ${imageUrl}, NOW())
            `;

            try {
                let token = request.headers.get('Authorization')?.replace("Bearer ", "");
                if (!token) return null;

                await fetch(`${request.headers.get('origin')}/api/send-notification`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ recipientId: to, messageContent: content || "Image" }),
                });

                console.log("Notification request status:");
            } catch (fetchError) {
                console.error("Error sending notification request:", fetchError);
            }

            return new Response(JSON.stringify({ message: "Message sent" }), {
                status: 201,
                headers: { 'content-type': 'application/json' },
            });
        }

        return new Response(JSON.stringify({ message: "Method Not Allowed" }), {
            status: 405,
            headers: { 'content-type': 'application/json' },
        });
    } catch (error) {
        console.error("Handler error:", error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), {
            status: 500,
            headers: { 'content-type': 'application/json' },
        });
    }
}