import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import GroupChat from "../Group/GroupChat";
import Sidebar from "../SideBar/SideBar";
import { getUsers, getMessages, checkSession, getRoomMessages } from "../../services/chatApi";
import { User, Room } from "../../model/common";
import * as React from "react";
import {List} from "@mui/material";
import Message from "./Message";
import ChatInput from "./ChatInput";
import { Container, Box, Typography } from '@mui/joy';
import { GlobalStyles } from '@mui/joy';


const ChatApp = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [messages, setMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedUserName, setSelectedUserName] = useState<string>("");
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const navigate = useNavigate();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);


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

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', (event) => {
                const payload = event.data;
                console.log("Received notification:", payload);
            });
        }
    }, []);

    const handleSelectUser = (user: User) => {
        setSelectedUser(user);
        setSelectedUserName(user.username);
        setSelectedRoom(null);
    };

    const handleSelectRoom = (room: Room) => {
        setSelectedRoom(room);
        setSelectedUserName(room.name);
        setSelectedUser(null);
    };

    const handleMessageSent = async () => {
        if (selectedUser) {
            const messages = await getMessages(selectedUser.user_id);
            setMessages(messages);
        }
    };

    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }
    const getAuthHeaders = () => {
        const token = sessionStorage.getItem('token');
        return {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        };
    };

    const refreshMessages = async () => {
        if (selectedUser) {
            const messages = await getMessages(selectedUser.user_id);
            setMessages(messages);
        }
        if (selectedRoom) {
            const messages = await getRoomMessages(selectedRoom.room_id);
            setMessages(messages);
        }
    };

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', (event) => {
                const payload = event.data;
                console.log("Received notification:", payload);
                refreshMessages();
            });
        }
    }, [selectedUser]);

    const checkForNewMessages = async () => {
        try {
            const response = await fetch("/api/new-messages", {
                headers: getAuthHeaders(),
            });
            if (response.ok) {
                const newMessages = await response.json();
                if (newMessages.length > 0) {
                    newMessages.forEach((message: any) => {
                        new Notification("New Message", {
                            body: message.content,
                            icon: "/path/to/icon.png",
                        });
                    });
                }
            } else {
                console.error("Failed to fetch new messages");
            }
        } catch (error) {
            console.error("Error checking for new messages:", error);
        }
    };

    return (
        <Container
            sx={{
                display: 'flex',
                width: '100vw',
                height: '100vh',
                maxWidth: '100% !important',
                backgroundImage: 'url(https://images.unsplash.com/photo-1527181152855-fc03fc7949c8?auto=format&w=1000&dpr=2)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                flexDirection: { xs: 'column', sm: 'row' },
            }}
        >
            <GlobalStyles
                styles={{
                    ':root': {
                        '--Transition-duration': '0.4s',
                    },
                }}
            />
            {isSidebarOpen && (
                <Sidebar
                    users={users}
                    onSelectUser={handleSelectUser}
                    onSelectRoom={handleSelectRoom}
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                />
            )}
            <>
                {(selectedUser || selectedRoom) ? (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            flex: 1,
                            height: '100%',
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            borderRadius: '25px',
                            backdropFilter: 'blur(12px)',
                            marginLeft: 2,
                        }}
                    >
                        <ChatHeader selectedUserName={selectedUserName??selectedRoom} onRefresh={refreshMessages} />
                        <Box sx={{ flex: 1, overflowY: 'auto' }}>
                            {selectedRoom ? (
                                <GroupChat selectedRoom={selectedRoom} />
                            ) : (
                                <ChatMessages messages={messages} selectedUser={selectedUser} onMessageSent={handleMessageSent} />
                            )}
                        </Box>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%',
                        }}
                    >
                        <Box
                            sx={{
                                backgroundColor: 'rgba(255,255,255,0.3)',
                                borderRadius: '16px',
                                backdropFilter: 'blur(10px)',
                                padding: 3,
                                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                                textAlign: 'center',
                                maxWidth: '400px',
                            }}
                        >
                            <Typography
                                level="h2"
                                sx={{ marginBottom: 1, fontFamily: 'Poppins, sans-serif !important' }}
                            >
                                📨 Start Chatting !!
                            </Typography>
                            <Typography
                                level="h4"
                                sx={{ fontFamily: 'Poppins, sans-serif !important' }}
                            >
                                Please select a user to start chatting.
                            </Typography>

                        </Box>

                    </Box>
                )}
            </>
        </Container>
    );
};

export default ChatApp;