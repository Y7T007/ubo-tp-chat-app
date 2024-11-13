import { useEffect, useState } from "react";
import { Box, Typography, List, ListItem, ListItemDecorator, ListItemContent, Avatar } from "@mui/joy";
import { getRooms } from "../../services/chatApi";
import { Room } from "../../model/common"; // Import interface

interface GroupListProps {
    onSelectRoom: (room: Room) => void;
}

const GroupList = ({ onSelectRoom }: GroupListProps) => {
    const [rooms, setRooms] = useState<Room[]>([]);

    useEffect(() => {
        const fetchRooms = async () => {
            const rooms = await getRooms();
            setRooms(rooms);
        };

        fetchRooms();
    }, []);

    return (
        <Box sx={{ width: 320 }}>
            <Typography
                id="group-list-demo"
                level="body-xs"
                sx={{ textTransform: 'uppercase', letterSpacing: '0.15rem' }}
            >
                Available Rooms
            </Typography>
            <List
                aria-labelledby="group-list-demo"
                sx={{ '--ListItemDecorator-size': '56px' }}
            >
                {rooms.map((room: Room) => (
                    <ListItem key={room.room_id} onClick={() => onSelectRoom(room)} sx={{ cursor: 'pointer' }}>
                        <ListItemDecorator>
                            <Avatar>{room.name.charAt(0)}</Avatar>
                        </ListItemDecorator>
                        <ListItemContent>
                            <Typography level="title-sm">{room.name}</Typography>
                        </ListItemContent>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default GroupList;