import { Box, List } from "@mui/material";
import Message from "./Message";
import ChatInput from "./ChatInput";
import { Component } from "react";
import {User} from "../../model/common";

interface MessageType {
    id: number;
    user: string;
    content: string;
    from_user: number;
    to_user: number;
}

interface ChatMessagesProps {
    messages: MessageType[];
    selectedUser: User | null;
    onMessageSent: () => void;
}

class ChatMessages extends Component<ChatMessagesProps> {
    render() {
        const { messages, selectedUser, onMessageSent } = this.props;
        const currentUserId = parseInt(sessionStorage.getItem("id") || "0");

        return (
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
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
                <ChatInput selectedUser={selectedUser} onMessageSent={onMessageSent} />
            </Box>
        );
    }
}

export default ChatMessages;