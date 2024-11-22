import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { sql } from '@vercel/postgres';

export const config = {
    runtime: 'edge',
};

function generateKeyPair() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
    });
    return {
        publicKey: publicKey.export({ type: 'pkcs1', format: 'pem' }),
        privateKey: privateKey.export({ type: 'pkcs1', format: 'pem' }),
    };
}

function saveKeyPair(userId, keyPair) {
    const filePath = path.join(process.cwd(), 'keys', `${userId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(keyPair, null, 2));
    console.log(`Keys for user ${userId} saved to ${filePath}`);
}

export default async function handler(request) {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ message: "Method Not Allowed" }), {
            status: 405,
            headers: { 'content-type': 'application/json' },
        });
    }

    const { rows: users } = await sql`SELECT user_id FROM users`;
    users.forEach(user => {
        const keyPair = generateKeyPair();
        saveKeyPair(user.user_id, keyPair);
    });

    return new Response(JSON.stringify({ message: "Keys generated and saved" }), {
        status: 201,
        headers: { 'content-type': 'application/json' },
    });
}