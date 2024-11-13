import { ListItem, ListItemText } from "@mui/material";

interface MessageProps {
    user: string;
    content: string;
}

const Message = ({ user, content }: MessageProps) => {
    return (
        <ListItem>
            <ListItemText primary={user} secondary={content} />
        </ListItem>
    );
};

export default Message;