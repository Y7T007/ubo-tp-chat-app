import { ListItem, ListItemText } from "@mui/material";

interface UserItemProps {
    name: string;
    onClick: () => void;
}

const UserItem = ({ name, onClick }: UserItemProps) => {
    return (
        <ListItem onClick={onClick}>
            <ListItemText primary={name} />
        </ListItem>
    );
};

export default UserItem;