import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();


export default async function handler(request) {
    try {
        const sessionValid = await checkSession(request);
        if (!sessionValid) {
            return unauthorizedResponse();
        }

        return new Response(JSON.stringify({ message: "Session is valid" }), {
            status: 200,
            headers: { 'content-type': 'application/json' },
        });
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), {
            status: 500,
            headers: { 'content-type': 'application/json' },
        });
    }
}

export async function checkSession(request) {
    const user = await getConnecterUser(request);
    return user !== null;
}

export function unauthorizedResponse() {
    const error = { code: "UNAUTHORIZED", message: "Session expired" };
    return new Response(JSON.stringify(error), {
        status: 401,
        headers: { 'content-type': 'application/json' },
    });
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