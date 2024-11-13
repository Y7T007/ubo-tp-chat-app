import { AppBar, Toolbar, Typography } from "@mui/material";

interface ChatHeaderProps {
    selectedUserName: string;
}

const ChatHeader = ({ selectedUserName }: ChatHeaderProps) => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6">UBO-TP-CHAT-APP</Typography>
                {selectedUserName && (
                    <Typography variant="h6" sx={{ marginLeft: "auto" }}>
                        Chatting with {selectedUserName}
                    </Typography>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default ChatHeader;