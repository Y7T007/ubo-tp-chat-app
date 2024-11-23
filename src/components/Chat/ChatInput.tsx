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
        if (selectedUser) {
            const formData = new FormData();
            formData.append("content", message);
            formData.append("to", selectedUser.user_id.toString());
            if (gif) {
                formData.append("image", gif);
            }
            try {
                sendMessage(formData);
                setTimeout(() => {
                    setMessage("");
                    setGif(null);
                    setThumbnail(null);
                    onMessageSent();
                }, 1000);
            } catch (error) {
                console.error("Error sending message:", error);
            }
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

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSend();
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                padding: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '25px',
                backdropFilter: 'blur(12px)',
                marginTop: 2,
                gap: 2,
            }}
        >
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={!selectedUser}
                InputProps={{
                    sx: {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "15px",
                        '& fieldset': {
                            border: 'none',
                        },
                    },
                    autoComplete: 'off',
                }}
            />
            <input
                accept="image/gif"
                style={{ display: 'none' }}
                id="icon-button-file"
                type="file"
                onChange={handleGifChange}
            />
            <label htmlFor="icon-button-file">
                <IconButton
                    color="primary"
                    aria-label="upload gif"
                    component="span"
                    sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "50%",
                        '&:hover': {
                            backgroundColor: "rgba(255, 255, 255, 0.2)",
                        },
                    }}
                >
                    <PhotoCamera />
                </IconButton>
            </label>
            <Button
                variant="contained"
                color="primary"
                onClick={handleSend}
                disabled={!selectedUser || (!message && !gif)}
                sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "15px",
                    color: "black",
                    '&:hover': {
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                    },
                }}
            >
                Send
            </Button>
            {thumbnail && (
                <Box sx={{ marginLeft: 2 }}>
                    <img
                        src={thumbnail}
                        alt="GIF Thumbnail"
                        style={{
                            maxWidth: "100px",
                            borderRadius: "10px",
                            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                        }}
                    />
                </Box>
            )}
        </Box>
    );
};

export default ChatInput;