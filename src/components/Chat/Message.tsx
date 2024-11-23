import { useEffect, useState } from "react";
import { format } from "date-fns";

interface MessageProps {
    user: string;
    content: string;
    imageUrl?: string;
    isSender: boolean;
    timestamp: string;
    footerText?: string;
}

const Message = ({ user, content, imageUrl, isSender, timestamp, footerText }: MessageProps) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    useEffect(() => {
        const fetchImage = async () => {
            if (imageUrl) {
                const response = await fetch(imageUrl);
                if (response.ok) {
                    const blob = await response.blob();
                    const imageObjectURL = URL.createObjectURL(blob);
                    setImageSrc(imageObjectURL);
                }
            }
        };
        fetchImage();
    }, [imageUrl]);

    const formattedTimestamp = format(new Date(timestamp), "h:mm a");

    return (
        <div className={`chat ${isSender ? "chat-end" : "chat-start"}`}>
            <div className="chat-bubble min-w-2.5">
                {imageSrc && (
                    <div className="chat-image avatar mb-2">
                        <div className="w-10 rounded-full">
                            <img alt="User avatar" src={imageSrc} />
                        </div>
                    </div>
                )}
                <div className="text-white">{content}</div>
                <div className="chat-header text-white bg-gray-800 p-2 rounded-t-lg">
                    {user}
                    <time className="text-xs opacity-50">{formattedTimestamp}</time>
                </div>
                {footerText && <div className="chat-footer text-gray-400 opacity-50">{footerText}</div>}
            </div>
        </div>
    );
};

export default Message;