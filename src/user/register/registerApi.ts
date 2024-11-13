import { ErrorCallback, User } from "../../model/common";
import { CustomError } from "../../model/CustomError";

export function registerUser(user: User, onResult: (message: string) => void, onError: ErrorCallback) {
    fetch("/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    })
        .then(async (response) => {
            const result = await response.json();
            if (response.ok) {
                onResult(result.message);
            } else {
                const error = result as CustomError;
                onError(error);
            }
        })
        .catch((error) => {
            const customError = new CustomError(error.message);
            onError(customError);
        });
}