import { ListItem, ListItemText, Box } from "@mui/material";
import { useEffect, useState } from "react";

interface MessageProps {
    user: string;
    content: string;
    imageUrl?: string;
    isSender: boolean;
}

const Message = ({ user, content, imageUrl, isSender }: MessageProps) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    useEffect(() => {
        const fetchImage = async () => {
            if (imageUrl) {
                const response = await fetch(`/api/images?key=${imageUrl}`);
                if (response.ok) {
                    const imageBase64 = await response.text();
                    const mimeType = imageUrl.endsWith('.gif') ? 'image/gif' : 'image/jpeg';
                    setImageSrc(`data:${mimeType};base64,${imageBase64}`);
                }
            }
        };
        fetchImage();
    }, [imageUrl]);

    return (
        <ListItem sx={{ justifyContent: isSender ? "flex-end" : "flex-start" }}>
            <Box
                sx={{
                    backgroundColor: isSender ? "#DCF8C6" : "#FFFFFF",
                    borderRadius: "10px",
                    padding: "10px",
                    maxWidth: "60%",
                    alignSelf: isSender ? "flex-end" : "flex-start",
                    color: isSender ? "#000000" : "blueviolet",
                    boxShadow: 1,
                }}
            >
                <ListItemText primary={user} secondary={content} />
                {imageSrc && (
                    <Box sx={{ marginTop: 1 }}>
                        <img src={imageSrc} alt="" style={{maxWidth: "100%", borderRadius: "10px"}}/>
                    </Box>
                )}
            </Box>
        </ListItem>
    );
};

export default Message;