// src/user/login/loginApi.ts
import { Session, SessionCallback, ErrorCallback, User } from "../../model/common";
import { CustomError } from "../../model/CustomError";

export function loginUser(user: User, onResult: SessionCallback, onError: ErrorCallback) {
    fetch("/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    })
        .then(async (response) => {
            if (response.ok) {
                const session = await response.json() as Session;
                console.log(session);
                sessionStorage.setItem('token', session.token);
                sessionStorage.setItem('externalId', session.externalId);
                sessionStorage.setItem('username', session.username || "");
                sessionStorage.setItem('id', session.id.toString());

                const beamsResponse = await fetch(`/api/beams?user_id=${session.externalId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${session.token}`,
                    },
                });

                if (beamsResponse.ok) {
                    const beamsToken = await beamsResponse.json();
                    sessionStorage.setItem('beamsToken', JSON.stringify(beamsToken));
                } else {
                    console.error("Failed to fetch beams token");
                }

                onResult(session);
            } else {
                const error = await response.json() as CustomError;
                onError(error);
            }
        }, onError);
}