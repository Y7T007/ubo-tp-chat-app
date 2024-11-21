import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';

interface ChatHeaderProps {
    selectedUserName: string;
    onRefresh: () => void;
}

const ChatHeader = ({ selectedUserName, onRefresh }: ChatHeaderProps) => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6">UBO-TP-CHAT-APP</Typography>
                {selectedUserName && (
                    <Typography variant="h6" sx={{ marginLeft: "auto" }}>
                        Chatting with {selectedUserName}
                    </Typography>
                )}
                <IconButton color="inherit" onClick={onRefresh}>
                    <RefreshIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default ChatHeader;