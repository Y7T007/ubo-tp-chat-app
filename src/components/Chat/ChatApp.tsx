import { useEffect, useState } from "react";
import { Container, Box } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import UserList from "../User/UserList";
import GroupChat from "../Group/GroupChat";
import GroupList from "../Group/GroupList";
import { getUsers, getMessages, checkSession } from "../../services/chatApi";

interface User {
    user_id: number;
    username: string;
    message: string;
}

interface Room {
    room_id: number;
    name: string;
}

const ChatApp = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [messages, setMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedUserName, setSelectedUserName] = useState<string>("");
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
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
        };

        initialize();
    }, [navigate]);

    useEffect(() => {
        const fetchMessages = async () => {
            if (selectedUser) {
                const messages = await getMessages(selectedUser.user_id);
                setMessages(messages);
            }
        };

        fetchMessages();
    }, [selectedUser]);

    const handleSelectUser = (user: User) => {
        setSelectedUser(user);
        setSelectedUserName(user.username);
        setSelectedRoom(null); // Deselect room when a user is selected
    };

    const handleSelectRoom = (room: Room) => {
        setSelectedRoom(room);
        setSelectedUser(null); // Deselect user when a room is selected
    };

    const handleMessageSent = async () => {
        if (selectedUser) {
            const messages = await getMessages(selectedUser.user_id);
            setMessages(messages);
        }
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
                <ChatHeader selectedUserName={selectedUserName} />
                <Box sx={{ display: "flex", flex: 1 }}>
                    <UserList users={users} onSelectUser={handleSelectUser} />
                    <GroupList onSelectRoom={handleSelectRoom} />
                    {selectedRoom ? (
                        <GroupChat selectedRoom={selectedRoom} />
                    ) : (
                        <ChatMessages messages={messages} />
                    )}
                </Box>
                <ChatInput selectedUser={selectedUser} onMessageSent={handleMessageSent} />
            </Box>
        </Container>
    );
};

export default ChatApp;