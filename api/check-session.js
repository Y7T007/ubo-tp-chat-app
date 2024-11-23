import { checkSession, unauthorizedResponse } from "../lib/session";

export const config = {
    runtime: 'edge',
};

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