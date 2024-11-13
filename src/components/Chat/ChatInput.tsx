import { Box, TextField, Button } from "@mui/material";
import { useState } from "react";
import { sendMessage } from "../../services/chatApi";

interface User {
    id: number;
    username: string;
}

const ChatInput = ({ selectedUser }: { selectedUser: User | null }) => {
    const [message, setMessage] = useState("");

    const handleSend = async () => {
        if (message.trim() && selectedUser) {
            await sendMessage({ content: message, to: selectedUser.id });
            setMessage("");
        }
    };

    return (
        <Box sx={{ display: "flex", padding: 2 }}>
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={!selectedUser}
            />
            <Button variant="contained" color="primary" onClick={handleSend} disabled={!selectedUser}>
                Send
            </Button>
        </Box>
    );
};

export default ChatInput;