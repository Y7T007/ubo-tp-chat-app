import { Box, List } from "@mui/material";
import UserItem from "./UserItem";

interface User {
    id: number;
    username: string;
}

const UserList = ({ users }: { users: User[] }) => {
    return (
        <Box sx={{ width: 200, borderRight: "1px solid #ddd", overflowY: "auto" }}>
            <List>
                {users.map((user: User) => (
                    <UserItem key={user.id} name={user.username} />
                ))}
            </List>
        </Box>
    );
};

export default UserList;