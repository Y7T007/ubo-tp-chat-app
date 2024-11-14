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