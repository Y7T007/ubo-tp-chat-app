import { Box, List } from "@mui/material";
import Message from "./Message";
import { Component } from "react";

interface MessageType {
    id: number;
    user: string;
    content: string;
    from_user: number;
    to_user: number;
}

class ChatMessages extends Component<{ messages: MessageType[] }> {
    render() {
        const { messages } = this.props;
        const currentUserId = parseInt(sessionStorage.getItem("id") || "0");
        console.log(messages)
        console.log(currentUserId)
        return (
            <Box sx={{ flex: 1, overflowY: "auto", padding: 2 }}>
                <List>
                    {messages.map((message: MessageType) => (

                        <Message
                            key={message.id}
                            user={message.user}
                            content={message.content}
                            isSender={message.from_user === currentUserId}
                        />
                    ))}
                </List>
            </Box>
        );
    }
}

export default ChatMessages;