export const createGroup = async (groupName: string) => {
    const response = await fetch("/api/room-manager", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ name: groupName }),
    });
    if (!response.ok) {
        throw new Error("Failed to create group");
    }
};

const getAuthHeaders = () => {
    const token = sessionStorage.getItem('token');
    return {
        "Authorization": `Bearer ${token}`,
    };
};
