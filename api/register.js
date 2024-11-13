import { db } from '@vercel/postgres';
import { Redis } from '@upstash/redis';
import { arrayBufferToBase64, stringToArrayBuffer } from "../lib/base64";

export const config = {
    runtime: 'edge',
};

const redis = Redis.fromEnv();

export default async function handler(request) {
    try {
        const { username, password, email } = await request.json();
        if (!username || !password || !email) {
            const error = { code: "BAD_REQUEST", message: "All fields are required" };
            return new Response(JSON.stringify(error), {
                status: 400,
                headers: { 'content-type': 'application/json' },
            });
        }

        const hash = await crypto.subtle.digest('SHA-256', stringToArrayBuffer(username + password));
        const hashed64 = arrayBufferToBase64(hash);

        const client = await db.connect();
        const { rowCount } = await client.sql`select * from users where username = ${username} or email = ${email}`;
        if (rowCount > 0) {
            const error = { code: "CONFLICT", message: "Username or email already exists" };
            return new Response(JSON.stringify(error), {
                status: 409,
                headers: { 'content-type': 'application/json' },
            });
        }

        const externalId = crypto.randomUUID().toString();
        await client.sql`insert into users (username, password, email, created_on, external_id) values (${username}, ${hashed64}, ${email}, now(), ${externalId})`;

        return new Response(JSON.stringify({ message: "User registered successfully" }), {
            status: 201,
            headers: { 'content-type': 'application/json' },
        });
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify(error), {
            status: 500,
            headers: { 'content-type': 'application/json' },
        });
    }
}