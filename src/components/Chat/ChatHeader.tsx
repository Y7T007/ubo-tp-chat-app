import { AppBar, Toolbar, Typography } from "@mui/material";

const ChatHeader = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6">Chat Application</Typography>
            </Toolbar>
        </AppBar>
    );
};

export default ChatHeader;