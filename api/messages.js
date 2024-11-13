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
            ORDER BY created_on DESC
        `;
        if (rowCount === 0) {
            return new Response("[]", {
                status: 200,
                headers: { 'content-type': 'application/json' },
            });
        } else {
            return new Response(JSON.stringify(rows), {
                status: 200,
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