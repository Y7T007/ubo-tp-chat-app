import { useEffect, useState } from "react";
import { Container, Box } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import GroupChat from "../Group/GroupChat";
import Sidebar from "../SideBar/SideBar";
import { getUsers, getMessages, checkSession } from "../../services/chatApi";
import { User, Room } from "../../model/common";
import GlobalStyles from "@mui/joy/GlobalStyles";
import * as React from "react";

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
                navigate("/");
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
        <Container
            sx={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1527181152855-fc03fc7949c8?auto=format&w=1000&dpr=2)',
            }}>
            <GlobalStyles
                styles={{
                    ':root': {
                        '--Form-maxWidth': '800px',
                        '--Transition-duration': '0.4s',
                    },
                }}
            />
            <Box
                sx={(theme) => ({
                    width: { xs: '100%', md: '50vw' },
                    transition: 'width var(--Transition-duration)',
                    transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    justifyContent: 'flex-end',
                })}>
                <Box sx={{ display: "flex", flex: 1 }}>
                    <Sidebar users={users} onSelectUser={handleSelectUser} onSelectRoom={handleSelectRoom} />
                    {selectedRoom ? (
                        <Box sx={{ display: "flex", flexDirection: "column"}}>
                            <ChatHeader selectedUserName={selectedUserName} />
                            <GroupChat selectedRoom={selectedRoom} />
                        </Box>
                    ) : (
                        <Box sx={{ display: "flex", flexDirection: "column"}}>
                            <ChatHeader selectedUserName={selectedUserName} />
                            <ChatMessages messages={messages} selectedUser={selectedUser} onMessageSent={handleMessageSent} />
                        </Box>
                    )}
                </Box>
            </Box>
        </Container>
    );
};

export default ChatApp;