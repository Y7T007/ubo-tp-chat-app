const getAuthHeaders = () => {
    const token = sessionStorage.getItem('token');
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    };
};

export const getUsers = async () => {
    const response = await fetch("/api/users", {
        headers: getAuthHeaders(),
    });
    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Failed to fetch users");
    }
};

export const getMessages = async (toUserId: number) => {
    const response = await fetch(`/api/messages?toUserId=${toUserId}`, {
        headers: getAuthHeaders(),
    });
    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Failed to fetch messages");
    }
};

interface SendMessageParams {
    content: string;
    to: number;
}

export const sendMessage = async ({ content, to }: SendMessageParams) => {
    fetch("/api/messages", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ content, to }),
    });
};

export const checkSession = async (): Promise<boolean> => {
    const response = await fetch("/api/check-session", {
        headers: getAuthHeaders(),
    });

    return response.ok;
};

export const getGroupMessages = async () => {
    const response = await fetch("/api/group-messages");
    return response.json();
};

export const sendGroupMessage = async (message: { content: string }) => {
    await fetch("/api/group-messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
    });
};

export const getRooms = async () => {
    const response = await fetch("/api/rooms", {
        headers: getAuthHeaders(),
    });
    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Failed to fetch rooms");
    }
};

export const getRoomMessages = async (roomId: number) => {
    const response = await fetch(`/api/room-messages?roomId=${roomId}`, {
        headers: getAuthHeaders(),
    });
    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Failed to fetch room messages");
    }
};

export const sendRoomMessage = async ({ content, roomId }: { content: string; roomId: number }) => {
    const response = await fetch("/api/room-messages", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ content, roomId }),
    });
    if (!response.ok) {
        throw new Error("Failed to send room message");
    }
};