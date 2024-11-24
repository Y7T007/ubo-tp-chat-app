import { Box, List, Typography } from "@mui/material";
import Message from "./Message";
import ChatInput from "./ChatInput";
import React, { Component } from "react";
import { User } from "../../model/common";

interface MessageType {
    id: number;
    user: string;
    content: string;
    image_url?: string;
    from_user: number;
    to_user: number;
    created_on: string;
}

interface ChatMessagesProps {
    messages: MessageType[];
    selectedUser: User | null;
    onMessageSent: () => void;
}

class ChatMessages extends Component<ChatMessagesProps> {
    messagesEndRef: React.RefObject<HTMLDivElement>;
    messagesContainerRef: React.RefObject<HTMLDivElement>;
    isUserScrolledUp: boolean;

    constructor(props: ChatMessagesProps) {
        super(props);
        this.messagesEndRef = React.createRef();
        this.messagesContainerRef = React.createRef();
        this.isUserScrolledUp = false;
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate(prevProps: ChatMessagesProps) {
        if (prevProps.messages.length !== this.props.messages.length && !this.isUserScrolledUp) {
            this.scrollToBottom();
        }
    }

    scrollToBottom = () => {
        if (this.messagesEndRef.current) {
            this.messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    };

    handleScroll = () => {
        if (this.messagesContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = this.messagesContainerRef.current;
            this.isUserScrolledUp = scrollTop + clientHeight < scrollHeight;
        }
    };

    render() {
        const { messages, selectedUser, onMessageSent } = this.props;
        const currentUserId = parseInt(sessionStorage.getItem("id") || "0");

        return (
            <>
                {selectedUser ? (
                    <Box sx={{ height: "90vh", display: "flex", flexDirection: "column" }}>
                        <Box
                            sx={{ flex: 1, overflowY: "auto", padding: 2 }}
                            ref={this.messagesContainerRef}
                            onScroll={this.handleScroll}
                        >
                            <List>
                                {messages.map((message: MessageType) => (
                                    <Message
                                        key={message.id}
                                        user={message.user}
                                        content={message.content}
                                        imageUrl={message.image_url}
                                        isSender={message.from_user === currentUserId}
                                        timestamp={message.created_on}
                                    />
                                ))}
                                <div ref={this.messagesEndRef} />
                            </List>
                        </Box>
                        <ChatInput selectedUser={selectedUser} onMessageSent={onMessageSent} />
                    </Box>
                ) : (
                    <Typography variant="h6" align="center" sx={{ marginTop: 2 }}>
                        Please select a user to start chatting.
                    </Typography>
                )}
            </>

        );
    }
}

export default ChatMessages;