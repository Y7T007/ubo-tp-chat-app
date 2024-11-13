export const getUsers = async () => {
    const response = await fetch("/api/users");
    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Failed to fetch users");
    }
};

export const getMessages = async () => {
    const response = await fetch("/api/messages");
    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Failed to fetch messages");
    }
};

export const sendMessage = async ({content}: { content: any }) => {
    const response = await fetch("/api/message", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
    });
    if (!response.ok) {
        throw new Error("Failed to send message");
    }
};