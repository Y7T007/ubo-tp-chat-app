import { Box, TextField, Button, IconButton } from "@mui/material";
import { useState } from "react";
import { sendMessage } from "../../services/chatApi";
import PhotoCamera from '@mui/icons-material/PhotoCamera';

interface User {
    user_id: number;
    username: string;
}

interface ChatInputProps {
    selectedUser: User | null;
    onMessageSent: () => void;
}

const ChatInput = ({ selectedUser, onMessageSent }: ChatInputProps) => {
    const [message, setMessage] = useState("");
    const [gif, setGif] = useState<File | null>(null);
    const [thumbnail, setThumbnail] = useState<string | null>(null);

    const handleSend = async () => {
        if (gif && selectedUser) {
            const formData = new FormData();
            formData.append("content", message);
            formData.append("to", selectedUser.user_id.toString());
            formData.append("image", gif);
            sendMessage(formData);
            setMessage("");
            setGif(null);
            setThumbnail(null);
            onMessageSent();
        }
    };

    const handleGifChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            if (file.type === 'image/gif') {
                setGif(file);
                setThumbnail(URL.createObjectURL(file));
            }
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
            <input
                accept="image/gif"
                style={{ display: 'none' }}
                id="icon-button-file"
                type="file"
                onChange={handleGifChange}
            />
            <label htmlFor="icon-button-file">
                <IconButton color="primary" aria-label="upload gif" component="span">
                    <PhotoCamera />
                </IconButton>
            </label>
            <Button variant="contained" color="primary" onClick={handleSend} disabled={!selectedUser || !gif}>
                Send
            </Button>
            {thumbnail && (
                <Box sx={{ marginLeft: 2 }}>
                    <img src={thumbnail} alt="GIF Thumbnail" style={{ maxWidth: "100px", borderRadius: "10px" }} />
                </Box>
            )}
        </Box>
    );
};

export default ChatInput;