import { Box } from "@mui/joy";
import UserList from "../User/UserList";
import GroupList from "../Group/GroupList";
import { User, Room } from "../../model/common"; // Import interfaces

interface SidebarProps {
    users: User[];
    onSelectUser: (user: User) => void;
    onSelectRoom: (room: Room) => void;
}

const Sidebar = ({ users, onSelectUser, onSelectRoom }: SidebarProps) => {
    return (
        <Box sx={{ width: 320, display: "flex", flexDirection: "column" }}>
            <UserList users={users} onSelectUser={onSelectUser} />
            <GroupList onSelectRoom={onSelectRoom} />
        </Box>
    );
};

export default Sidebar;