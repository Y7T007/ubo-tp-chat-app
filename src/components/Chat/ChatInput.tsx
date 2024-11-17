import { Box, TextField, Button, IconButton } from "@mui/material";
import { useState } from "react";
import { sendMessage } from "../../services/chatApi";
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import gifshot, { CreateGIFOptions, CreateGIFResult } from 'gifshot';

interface User {
    user_id: number;
    username: string;
}

interface ChatInputProps {
    selectedUser: User | null;
    onMessageSent: () => void;
}

const ChatInput = ({ selectedUser, onMessageSent }: ChatInputProps) => {
    const [message, setMessage] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [thumbnail, setThumbnail] = useState<string | null>(null);

    const handleSend = async () => {
        if ((message.trim() || image) && selectedUser) {
            const formData = new FormData();
            formData.append("content", message);
            formData.append("to", selectedUser.user_id.toString());
            if (image) {
                formData.append("image", image);
            }
            sendMessage(formData);
            setMessage("");
            setImage(null);
            setThumbnail(null);
            onMessageSent();
        }
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setImage(file);
            if (file.type.startsWith('image/')) {
                compressImage(file);
            } else if (file.type === 'image/gif') {
                compressGif(file);
            }
        }
    };

    const compressImage = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const maxWidth = 300;
                const scaleSize = maxWidth / img.width;
                canvas.width = maxWidth;
                canvas.height = img.height * scaleSize;
                ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                canvas.toBlob((blob) => {
                    if (blob) {
                        setImage(new File([blob], file.name, { type: file.type }));
                        setThumbnail(URL.createObjectURL(blob));
                    }
                }, file.type, 0.7);
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const compressGif = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            gifshot.createGIF({
                gifWidth: 300,
                gifHeight: 300,
                images: [e.target?.result as string],
                interval: 0.1,
                numFrames: 10,
                sampleInterval: 10,
                numWorkers: 2
            } as CreateGIFOptions, (obj: CreateGIFResult) => {
                if (!obj.error) {
                    const image = new Image();
                    image.src = obj.image;
                    image.onload = () => {
                        setThumbnail(obj.image);
                        fetch(obj.image)
                            .then(res => res.blob())
                            .then(blob => {
                                setImage(new File([blob], file.name, { type: file.type }));
                            });
                    };
                }
            });
        };
        reader.readAsDataURL(file);
    };

    return (
        <Box sx={{ display: "flex", padding: 2 }}>
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={!selectedUser}
            />
            <input
                accept="image/*"
                style={{ display: 'none' }}
                id="icon-button-file"
                type="file"
                onChange={handleImageChange}
            />
            <label htmlFor="icon-button-file">
                <IconButton color="primary" aria-label="upload picture" component="span">
                    <PhotoCamera />
                </IconButton>
            </label>
            <Button variant="contained" color="primary" onClick={handleSend} disabled={!selectedUser}>
                Send
            </Button>
            {thumbnail && (
                <Box sx={{ marginLeft: 2 }}>
                    <img src={thumbnail} style={{ maxWidth: "100px", borderRadius: "10px" }} />
                </Box>
            )}
        </Box>
    );
};

export default ChatInput;