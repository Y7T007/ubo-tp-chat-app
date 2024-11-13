import { useEffect, useState } from "react";
import { Container, Box } from "@mui/material";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import UserList from "../User/UserList";
import { getUsers, getMessages } from "../../services/chatApi";

const ChatApp = () => {
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const users = await getUsers();
            setUsers(users);
        };

        const fetchMessages = async () => {
            const messages = await getMessages();
            setMessages(messages);
        };

        fetchUsers();
        fetchMessages();
    }, []);

    return (
        <Container maxWidth="lg">
            <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
                <ChatHeader />
                <Box sx={{ display: "flex", flex: 1 }}>
                    <UserList users={users} />
                    <ChatMessages messages={messages} />
                </Box>
                <ChatInput />
            </Box>
        </Container>
    );
};

export default ChatApp;