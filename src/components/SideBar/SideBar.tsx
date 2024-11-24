import {
    Box,
    Collapse,
    List,
    ListItemButton,
    ListItemText,
    Divider,
    TextField,
    InputAdornment,
    Button,
    Modal
} from "@mui/material";
import { useState } from "react";
import UserList from "../User/UserList";
import GroupList from "../Group/GroupList";
import { User, Room } from "../../model/common";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import * as React from "react";
import { ListItem } from "@mui/joy";
import PeopleIcon from "@mui/icons-material/People";
import GroupIcon from "@mui/icons-material/Group";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SearchIcon from "@mui/icons-material/Search";
import GlobalStyles from "@mui/joy/GlobalStyles";
import { createGroup } from "../../services/roomsApi";
import { Add, Menu } from "@mui/icons-material";

interface SidebarProps {
    users: User[],
    onSelectUser: (user: User) => void,
    onSelectRoom: (room: Room) => void,
    toggleSidebar?: () => void
}

const Sidebar = ({ users, onSelectUser, onSelectRoom, toggleSidebar }: SidebarProps) => {
    const [openUsers, setOpenUsers] = useState(true);
    const [openGroups, setOpenGroups] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newGroupName, setNewGroupName] = useState("");
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleLogout = () => {
        sessionStorage.clear();
        window.location.reload();
    };

    const handleCreateGroup = async () => {
        await createGroup(newGroupName);
        setIsModalOpen(false);
        setNewGroupName("");
    };

    return (
        <Box
            sx={{
                width: isSidebarCollapsed ? 60 : 200,
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                borderRadius: "25px",
                backdropFilter: "blur(12px)",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                paddingLeft: 2,
                paddingRight: 2,
                color: "black",
                transition: "width 0.3s",
                position: "relative",
            }}
        >
            <GlobalStyles
                styles={{
                    "*::-webkit-scrollbar": {
                        width: "6px",
                    },
                    "*::-webkit-scrollbar-track": {
                        background: "rgba(255, 255, 255, 0.1)",
                    },
                    "*::-webkit-scrollbar-thumb": {
                        background: "rgba(0, 0, 0, 0.2)",
                        borderRadius: "10px",
                    },
                }}
            />
            <List
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    height: "100%",
                    overflowY: "auto",
                    overflowX: "hidden",
                }}
            >
                <ListItem>
                    <Box sx={{ gap: 2, display: "flex", alignItems: "center", marginTop: "15px" }}>
                        <IconButton variant="soft" color="primary" size="sm">
                            <img src="/assets/ubo.jpeg" alt="UBO" style={{ borderRadius: "5px", width: "35px", height: "35px" }} />
                        </IconButton>
                        {!isSidebarCollapsed && (
                            <Typography level="title-lg">UBO ChatApp</Typography>
                        )}
                        <IconButton onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
                            <Menu />
                        </IconButton>
                    </Box>
                </ListItem>
                {!isSidebarCollapsed && (
                    <>
                        <Box sx={{ my: 2 }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                    sx: {
                                        "& fieldset": {
                                            border: "none",
                                        },
                                    },
                                }}
                                sx={{
                                    backgroundColor: "rgba(255,255,255,0.1)",
                                    borderRadius: "15px",
                                    color: "black",
                                }}
                            />
                        </Box>
                        <Box sx={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
                            <ListItemButton
                                onClick={() => setOpenUsers(!openUsers)}
                                sx={{
                                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                                    borderRadius: "15px",
                                    mb: 1,
                                    color: "black",
                                }}
                            >
                                <PeopleIcon sx={{ mr: 1 }} />
                                <ListItemText primary="Users" />
                            </ListItemButton>
                            <Collapse in={openUsers} timeout="auto" unmountOnExit>
                                <UserList users={filteredUsers} onSelectUser={onSelectUser} />
                            </Collapse>
                            <Divider />
                            <ListItemButton
                                onClick={() => setOpenGroups(!openGroups)}
                                sx={{
                                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                                    borderRadius: "15px",
                                    mb: 1,
                                    color: "black",
                                }}
                            >
                                <GroupIcon sx={{ mr: 1 }} />
                                <ListItemText primary="Groups" />
                            </ListItemButton>
                            <Collapse in={openGroups} timeout="auto" unmountOnExit>
                                <GroupList onSelectRoom={onSelectRoom} />
                            </Collapse>
                            <Divider />
                        </Box>
                        <Button variant="contained" color="primary" onClick={() => setIsModalOpen(true)}>
                            Create Group
                        </Button>
                    </>
                )}
            </List>
            {!isSidebarCollapsed && (
                <Box sx={{ mt: "auto", p: 2 }}>
                    <ListItemButton
                        onClick={handleLogout}
                        sx={{
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                            borderRadius: "15px",
                            color: "black",
                        }}
                    >
                        <ExitToAppIcon sx={{ mr: 1 }} />
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </Box>
            )}
            {isSidebarCollapsed && (
                <IconButton
                    onClick={() => setIsSidebarCollapsed(false)}
                    sx={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                    }}
                >
                    <Menu />
                </IconButton>
            )}
            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <Box
                    sx={{
                        padding: 4,
                        backgroundColor: "white",
                        borderRadius: 2,
                        width: 300,
                        margin: "auto",
                        marginTop: "20%",
                    }}
                >
                    <Typography>Create New Group</Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Group Name"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        sx={{ marginTop: 2 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreateGroup}
                        sx={{ marginTop: 2 }}
                    >
                        Create
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
};

export default Sidebar;