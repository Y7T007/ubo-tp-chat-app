import { ListItem, ListItemText } from "@mui/material";

interface UserItemProps {
    name: string;
}

const UserItem = ({ name }: UserItemProps) => {
    return (
        <ListItem>
            <ListItemText primary={name} />
        </ListItem>
    );
};

export default UserItem;