import { useEffect, useState, ChangeEvent } from "react";
import { Box, List, TextField, Button, IconButton } from "@mui/material";
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { getRoomMessages, sendRoomMessage } from "../../services/chatApi";
import Message from "../Chat/Message";

interface Message {
    id: number;
    user: string;
    content: string;
    from_user: number;
    created_on: string;
    image_url?: string;
}

interface Room {
    room_id: number;
    name: string;
}

const GroupChat = ({ selectedRoom }: { selectedRoom: Room | null }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState("");
    const [gif, setGif] = useState<File | null>(null);
    const [thumbnail, setThumbnail] = useState<string | null>(null);
    const currentUserId = parseInt(sessionStorage.getItem("id") || "0");

    useEffect(() => {
        const fetchMessages = async () => {
            if (selectedRoom) {
                const response = await getRoomMessages(selectedRoom.room_id);
                if (Array.isArray(response)) {
                    setMessages(response);
                } else {
                    setMessages([]);
                }
            }
        };

        fetchMessages();
    }, [selectedRoom]);

    const handleSend = async () => {
        if (message.trim() && selectedRoom) {
            const formData = new FormData();
            formData.append("content", message);
            formData.append("roomId", selectedRoom.room_id.toString());
            if (gif) {
                formData.append("image", gif);
            }
            await sendRoomMessage(formData);
            setMessage("");
            setGif(null);
            setThumbnail(null);
            const response = await getRoomMessages(selectedRoom.room_id);
            if (Array.isArray(response)) {
                setMessages(response);
            } else {
                setMessages([]);
            }
        }
    };

    const handleGifChange = (event: ChangeEvent<HTMLInputElement>) => {
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
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Box sx={{ flex: 1, overflowY: "auto", padding: 2 }}>
                <List aria-labelledby="group-chat-demo" sx={{ '--ListItemDecorator-size': '56px' }}>
                    {messages.map((message: Message) => (
                        <Message
                            key={message.id}
                            user={message.user}
                            content={message.content}
                            imageUrl={message.image_url}
                            isSender={message.from_user === currentUserId}
                            timestamp={message.created_on}
                        />
                    ))}
                </List>
            </Box>
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
                    disabled={!message && !gif}
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
        </Box>
    );
};

export default GroupChat;