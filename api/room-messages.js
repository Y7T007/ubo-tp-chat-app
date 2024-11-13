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
            const roomId = new URL(request.url).searchParams.get("roomId");
            if (!roomId) {
                return new Response(JSON.stringify({ message: "Bad Request" }), {
                    status: 400,
                    headers: { 'content-type': 'application/json' },
                });
            }

            const { rowCount, rows } = await sql`
                SELECT messages.*, users.username as user
                FROM messages
                JOIN users ON messages.from_user = users.user_id
                WHERE to_room = ${roomId}
                ORDER BY created_on ASC
            `;
            return new Response(JSON.stringify(rows), {
                status: 200,
                headers: { 'content-type': 'application/json' },
            });
        } else if (request.method === "POST") {
            const { content, roomId } = await request.json();
            if (!content || !roomId) {
                return new Response(JSON.stringify({ message: "Bad Request" }), {
                    status: 400,
                    headers: { 'content-type': 'application/json' },
                });
            }

            await sql`
                INSERT INTO messages (from_user, to_room, content, created_on)
                VALUES (${user.id}, ${roomId}, ${content}, NOW())
            `;

            return new Response(JSON.stringify({ message: "Message sent" }), {
                status: 201,
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