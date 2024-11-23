import { put } from "@vercel/blob";
import { Redis } from "@upstash/redis";
const redis = Redis.fromEnv();

export default async function handler(request, response) {
    try {
        const user = await getConnecterUser(request);
        if (!user) return unauthorizedResponse(response);

        if (request.method !== "POST") {
            return jsonResponse(response, { message: "Method Not Allowed" }, 405);
        }

        const formData = await request.formData();
        const image = formData.get("image");

        if (!image) {
            return jsonResponse(response, { message: "Bad Request" }, 400);
        }

        const imageBuffer = await image.arrayBuffer();
        const blob = await put(`image_${Date.now()}`, imageBuffer, {
            access: 'public',
        });

        return jsonResponse(response, { imageUrl: blob.url }, 201);
    } catch (error) {
        console.error("Handler error:", error);
        return jsonResponse(response, { message: "Internal Server Error" }, 500);
    }
}

export async function getConnecterUser(request) {
    let token = new Headers(request.headers).get('Authorization');
    if (!token) {
        return null;
    } else {
        token = token.replace("Bearer ", "");
    }
    console.log("checking " + token);
    const user = await redis.get(token);
    if (user) {
        console.log("Got user : " + user.username);
    }
    return user;
}

export function unauthorizedResponse(response) {
    const error = { code: "UNAUTHORIZED", message: "Session expired" };
    return jsonResponse(response, error, 401);
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