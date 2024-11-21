import { AppBar, Toolbar, Typography, IconButton, Box, Avatar } from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';

interface ChatHeaderProps {
    selectedUserName: string;
    onRefresh: () => void;
}

const ChatHeader = ({ selectedUserName, onRefresh }: ChatHeaderProps) => {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '25px',
                backdropFilter: 'blur(12px)',
                padding: 2,
                marginBottom: 2,
            }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ marginRight: 2 }}>U</Avatar>
                <Typography variant="h6">{selectedUserName}</Typography>
            </Box>
            <IconButton color="inherit" onClick={onRefresh}>
                <RefreshIcon />
            </IconButton>
        </Box>
    );
};

export default ChatHeader;