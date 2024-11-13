// src/components/Chat/Message.tsx
import { ListItem, ListItemText, Box } from "@mui/material";

interface MessageProps {
    user: string;
    content: string;
    isSender: boolean;
}

const Message = ({ user, content, isSender }: MessageProps) => {
    return (
        <ListItem sx={{ justifyContent: isSender ? "flex-end" : "flex-start" }}>
            <Box
                sx={{
                    backgroundColor: isSender ? "#DCF8C6" : "#FFFFFF",
                    borderRadius: "10px",
                    padding: "10px",
                    maxWidth: "60%",
                    alignSelf: isSender ? "flex-end" : "flex-start",
                    color: isSender ? "#000000" : "blueviolet",
                    boxShadow: 1,
                }}
            >
                <ListItemText primary={user} secondary={content} />
            </Box>
        </ListItem>
    );
};

export default Message;