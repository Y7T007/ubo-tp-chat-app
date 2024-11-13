import { useState } from "react";
import { loginUser } from "./loginApi";
import { Session } from "../../model/common";
import { CustomError } from "../../model/CustomError";
import { TextField, Button, Container, Typography, Box, Alert, Link, Dialog, DialogTitle, DialogContent, DialogContentText } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { keyframes } from "@emotion/react";

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
`;

export function Login() {
    const [error, setError] = useState({} as CustomError);
    const [session, setSession] = useState({} as Session);
    const [dialogOpen, setDialogOpen] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        loginUser(
            { user_id: -1, username: data.get("login") as string, password: data.get("password") as string },
            (result: Session) => {
                console.log(result);
                setSession(result);
                form.reset();
                setError(new CustomError(""));
                setDialogOpen(true);
                setTimeout(() => {
                    setDialogOpen(false);
                    navigate("/chat");
                }, 3000);
            },
            (loginError: CustomError) => {
                console.log(loginError);
                setError(loginError);
                setSession({} as Session);
            }
        );
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Login
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Username"
                        name="login"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Login
                    </Button>
                </form>
                {session.token && (
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        Welcome, {session.username}!
                    </Typography>
                )}
                {error.message && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error.message}
                    </Alert>
                )}

                <Box sx={{ mt: 2 }}>
                    <Link href="/register" variant="body2">
                        Don&apos;t have an account? Register here
                    </Link>
                </Box>
            </Box>
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
            >
                <DialogTitle>Login Successful</DialogTitle>
                <DialogContent sx={{ textAlign: "center" }}>
                    <CheckCircle sx={{ color: "green", fontSize: 60, animation: `${bounce} 2s infinite` }} />
                    <DialogContentText>
                        You will be redirected to the chat app shortly.
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </Container>
    );
}