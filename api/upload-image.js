import { put } from "@vercel/blob";
import { getConnecterUser, unauthorizedResponse } from "../lib/session";

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    try {
        const user = await getConnecterUser(request);
        if (!user) return unauthorizedResponse();

        if (request.method !== "POST") {
            return new Response(JSON.stringify({ message: "Method Not Allowed" }), {
                status: 405,
                headers: { 'content-type': 'application/json' },
            });
        }

        const formData = await request.formData();
        const image = formData.get("image");

        if (!image) {
            return new Response(JSON.stringify({ message: "Bad Request" }), {
                status: 400,
                headers: { 'content-type': 'application/json' },
            });
        }

        const imageBuffer = await image.arrayBuffer();
        const blob = await put(`image_${Date.now()}`, imageBuffer, {
            access: 'public',
        });

        return new Response(JSON.stringify({ imageUrl: blob.url }), {
            status: 201,
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