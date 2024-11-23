import { put } from "@vercel/blob";
import { Redis } from "@upstash/redis";
import formidable from "formidable";

const redis = Redis.fromEnv();

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(request, response) {
    try {
        const user = await getConnecterUser(request);
        if (!user) return unauthorizedResponse(response);

        if (request.method !== "POST") {
            return response.status(405).json({ message: "Method Not Allowed" });
        }

        const form = new formidable.IncomingForm();
        form.parse(request, async (err, fields, files) => {
            if (err) {
                console.error("Form parse error:", err);
                return response.status(400).json({ message: "Bad Request" });
            }

            const image = files.image;
            if (!image) {
                return response.status(400).json({ message: "Bad Request" });
            }

            const imageBuffer = await fs.promises.readFile(image.path);
            const blob = await put(`image_${Date.now()}`, imageBuffer, {
                access: 'public',
            });

            return response.status(201).json({ imageUrl: blob.url });
        });
    } catch (error) {
        console.error("Handler error:", error);
        return response.status(500).json({ message: "Internal Server Error" });
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
    return response.status(401).json(error);
}