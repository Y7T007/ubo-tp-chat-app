import { getConnecterUser, unauthorizedResponse } from "../lib/session";
import { sql } from "@vercel/postgres";

export const config = {
    runtime: 'edge',
};

export default async function handler(request, response) {
    try {
        const user = await getConnecterUser(request);
        if (!user) return unauthorizedResponse(response);

        if (request.method === "GET") {
            const roomId = new URL(request.url).searchParams.get("roomId");
            if (!roomId) {
                return jsonResponse(response, { message: "Bad Request" }, 400);
            }

            const { rowCount, rows } = await sql`
                SELECT messages.*, users.username as user
                FROM messages
                JOIN users ON messages.from_user = users.user_id
                WHERE to_room = ${roomId}
                ORDER BY created_on ASC
            `;
            return jsonResponse(response, rowCount === 0 ? [] : rows, 200);
        }

        if (request.method === "POST") {
            const formData = await request.formData();
            const content = formData.get("content");
            const roomId = formData.get("roomId");
            const image = formData.get("image");

            if ((!content && !image) || !roomId) {
                return jsonResponse(response, { message: "Bad Request" }, 400);
            }

            let imageUrl = null;
            if (image) {
                const uploadResponse = await fetch(`${request.headers.get('origin')}/api/upload-image`, {
                    method: 'POST',
                    headers: {
                        'Authorization': request.headers.get('Authorization'),
                    },
                    body: formData,
                });

                const uploadResponseText = await uploadResponse.text();
                console.log("Upload response text:", uploadResponseText);

                const uploadResult = JSON.parse(uploadResponseText);
                imageUrl = uploadResult.imageUrl;
            }

            await sql`
                INSERT INTO messages (from_user, to_room, content, image_url, created_on)
                VALUES (${user.id}, ${roomId}, ${content}, ${imageUrl}, NOW())
            `;

            try {
                const { rowCount, rows } = await sql`
                    SELECT external_id FROM users WHERE user_id = ${user.id}
                `;
                if (rowCount === 0) {
                    return jsonResponse(response, { message: "User not found" }, 404);
                }
                const externalId = rows[0].external_id;

                const { rowCount: userRowCount, rows: userRows } = await sql`
                    SELECT username FROM users WHERE user_id = ${user.id}
                `;
                if (userRowCount === 0) {
                    return jsonResponse(response, { message: "Sender not found" }, 404);
                }
                const senderUsername = userRows[0].username;

                let token = request.headers.get('Authorization')?.replace("Bearer ", "");
                if (!token) return null;
                console.log("The origin URL is : ", request.headers.get('origin'));
                await fetch(`${request.headers.get('origin')}/api/send-notification`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ recipientId: externalId, messageContent: content || "Image", senderUsername }),
                });

                console.log("Notification request status:");
            } catch (fetchError) {
                console.error("Error sending notification request:", fetchError);
            }

            return jsonResponse(response, { message: "Message sent" }, 201);
        }

        return jsonResponse(response, { message: "Method Not Allowed" }, 405);
    } catch (error) {
        console.error("Handler error:", error);
        return jsonResponse(response, { message: "Internal Server Error" }, 500);
    }
}

function jsonResponse(response, data, status) {
    if (typeof response.status === 'function') {
        return response.status(status).json(data);
    } else {
        return new Response(JSON.stringify(data), {
            status: status,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}