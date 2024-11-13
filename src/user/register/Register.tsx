import { useState } from "react";
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

export function Register() {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);

        const response = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: data.get("username"),
                password: data.get("password"),
                email: data.get("email"),
            }),
        });

        const result = await response.json();
        if (response.ok) {
            setSuccess(result.message);
            setError("");
            form.reset();
            setDialogOpen(true);
            setTimeout(() => {
                setDialogOpen(false);
                navigate("/login");
            }, 3000);
        } else {
            setError(result.message);
            setSuccess("");
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Register
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Username"
                        name="username"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
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
                        Register
                    </Button>
                </form>
                {success && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                        {success}
                    </Alert>
                )}
                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}
            </Box>
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
            >
                <DialogTitle>Registration Successful</DialogTitle>
                <DialogContent sx={{ textAlign: "center" }}>
                    <CheckCircle sx={{ color: "green", fontSize: 60, animation: `${bounce} 2s infinite` }} />
                    <DialogContentText>
                        You will be redirected to the login page shortly.
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </Container>
    );
}