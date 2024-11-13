import { Box, List } from "@mui/material";
import Message from "./Message";
import { Component } from "react";

interface MessageType {
    id: number;
    user: string;
    content: string;
}

class ChatMessages extends Component<{ messages: MessageType[] }> {
    render() {
        const { messages } = this.props;
        return (
            <Box sx={{ flex: 1, overflowY: "auto", padding: 2 }}>
                <List>
                    {messages.map((message: MessageType) => (
                        <Message key={message.id} user={message.user} content={message.content} />
                    ))}
                </List>
            </Box>
        );
    }
}

export default ChatMessages;