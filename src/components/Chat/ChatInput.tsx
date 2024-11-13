import { Box, TextField, Button } from "@mui/material";
import { useState } from "react";

const ChatInput = () => {
    const [message, setMessage] = useState("");

    const handleSend = () => {
        // Handle sending the message
        console.log("Message sent:", message);
        setMessage("");
    };

    return (
        <Box sx={{ display: "flex", padding: 2 }}>
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleSend}>
                Send
            </Button>
        </Box>
    );
};

export default ChatInput;