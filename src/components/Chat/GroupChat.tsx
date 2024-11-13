import { useEffect, useState, ChangeEvent } from "react";
import { Box, Typography, List, ListItem, ListItemDecorator, ListItemContent, Avatar, Button } from "@mui/joy";
import { getGroupMessages, sendGroupMessage } from "../../services/chatApi";
import { TextField } from "@mui/material";

interface Message {
    id: number;
    user: string;
    content: string;
    from_user: number;
}

const GroupChat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState("");
    const currentUserId = parseInt(sessionStorage.getItem("id") || "0");

    useEffect(() => {
        const fetchMessages = async () => {
            const response = await getGroupMessages();
            if (Array.isArray(response)) {
                setMessages(response);
            } else {
                setMessages([]);
            }
        };

        fetchMessages();
    }, []);

    const handleSend = async () => {
        if (message.trim()) {
            await sendGroupMessage({ content: message });
            setMessage("");
            const response = await getGroupMessages();
            if (Array.isArray(response)) {
                setMessages(response);
            } else {
                setMessages([]);
            }
        }
    };

    return (
        <Box sx={{ width: 320 }}>
            <Typography
                id="group-chat-demo"
                level="body-xs"
                sx={{ textTransform: 'uppercase', letterSpacing: '0.15rem' }}
            >
                Group Chat
            </Typography>
            <List
                aria-labelledby="group-chat-demo"
                sx={{ '--ListItemDecorator-size': '56px', flex: 1, overflowY: "auto" }}
            >
                {messages.map((message: Message) => (
                    <ListItem key={message.id}>
                        <ListItemDecorator>
                            <Avatar src={`/static/images/avatar/${message.from_user}.jpg`} />
                        </ListItemDecorator>
                        <ListItemContent>
                            <Typography level="title-sm">{message.user}</Typography>
                            <Typography level="body-sm" noWrap>
                                {message.content}
                            </Typography>
                        </ListItemContent>
                    </ListItem>
                ))}
            </List>
            <Box sx={{ display: "flex", padding: 2 }}>
                <TextField
                    label="Type a message..."
                    value={message}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
                />
                <Button color="primary" onClick={handleSend}>
                    Send
                </Button>
            </Box>
        </Box>
    );
};

export default GroupChat;