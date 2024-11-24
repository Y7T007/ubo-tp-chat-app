import { getConnecterUser, unauthorizedResponse } from "../lib/session";
import { sql } from "@vercel/postgres";

export const config = {
    runtime: 'edge',
};

export default async function handler(request, response) {
    try {
        const user = await getConnecterUser(request);
        if (!user) return unauthorizedResponse(response);

        if (request.method === "POST") {
            const { name } = await request.json();
            if (!name) {
                return jsonResponse(response, { message: "Bad Request" }, 400);
            }

            await sql`
                INSERT INTO rooms (name, created_by, created_on)
                VALUES (${name}, ${user.id}, NOW())
            `;

            return jsonResponse(response, { message: "Group created" }, 201);
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