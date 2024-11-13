import { Box, List } from "@mui/material";
import UserItem from "./UserItem";

interface User {
    id: number;
    username: string;
}

interface UserListProps {
    users: User[];
    onSelectUser: (user: User) => void;
}

const UserList = ({ users, onSelectUser }: UserListProps) => {
    return (
        <Box sx={{ width: 200, borderRight: "1px solid #ddd", overflowY: "auto" }}>
            <List>
                {users.map((user: User) => (
                    <UserItem key={user.id} name={user.username} onClick={() => onSelectUser(user)} />
                ))}
            </List>
        </Box>
    );
};

export default UserList;
