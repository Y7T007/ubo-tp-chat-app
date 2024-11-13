import { useEffect, useState } from "react";
import { Container, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import UserList from "../User/UserList";
import { getUsers, getMessages, checkSession } from "../../services/chatApi";

interface User {
    id: number;
    username: string;
}

const ChatApp = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [messages, setMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const initialize = async () => {
            const sessionValid = await checkSession();
            if (!sessionValid) {
                navigate("/login");
                return;
            }

            const users = await getUsers();
            setUsers(users);

            const messages = await getMessages();
            setMessages(messages);
        };

        initialize();
    }, [navigate]);

    return (
        <Container maxWidth="lg">
            <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
                <ChatHeader />
                <Box sx={{ display: "flex", flex: 1 }}>
                    <UserList users={users} onSelectUser={setSelectedUser} />
                    <ChatMessages messages={messages} />
                </Box>
                <ChatInput selectedUser={selectedUser} />
            </Box>
        </Container>
    );
};

export default ChatApp;