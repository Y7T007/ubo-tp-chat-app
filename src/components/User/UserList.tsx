import * as React from 'react';
import { Box, Typography, List, ListItem, ListItemDecorator, ListItemContent, Avatar } from '@mui/joy';
import { User } from "../../model/common"; // Import interface

interface UserListProps {
    users: User[];
    onSelectUser: (user: User) => void;
}

const UserList = ({ users, onSelectUser }: UserListProps) => {
    return (
        <Box sx={{ width: 320 }}>
            <Typography
                id="ellipsis-list-demo"
                level="body-xs"
                sx={{ textTransform: 'uppercase', letterSpacing: '0.15rem' }}
            >
                Available Users
            </Typography>
            <List
                aria-labelledby="ellipsis-list-demo"
                sx={{ '--ListItemDecorator-size': '56px' }}
            >
                {users.map((user: User, index: number) => (
                    <ListItem key={user.user_id} onClick={() => onSelectUser(user)} sx={{ cursor: 'pointer' }}>
                        <ListItemDecorator>
                            <Avatar src={`/static/images/avatar/${index + 1}.jpg`} />
                        </ListItemDecorator>
                        <ListItemContent>
                            <Typography level="title-sm">{user.username}</Typography>
                            {/*<Typography level="body-sm" noWrap>*/}
                            {/*    {user.message}*/}
                            {/*</Typography>*/}
                        </ListItemContent>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default UserList;