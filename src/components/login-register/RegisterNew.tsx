import * as React from 'react';
import { CssVarsProvider, extendTheme, useColorScheme } from '@mui/joy/styles';
import GlobalStyles from '@mui/joy/GlobalStyles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Checkbox from '@mui/joy/Checkbox';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import IconButton, { IconButtonProps } from '@mui/joy/IconButton';
import Link from '@mui/joy/Link';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import GoogleIcon from './GoogleIcon';
import {useState} from "react";
import {CustomError} from "../../model/CustomError";
import {Session} from "../../model/common";
import {useNavigate} from "react-router-dom";
import {loginUser} from "../../user/login/loginApi";
import { Alert, Dialog, DialogTitle, DialogContent, DialogContentText } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { keyframes } from "@emotion/react";
import {Modal, ModalDialog} from "@mui/joy";

interface FormElements extends HTMLFormControlsCollection {
    login: HTMLInputElement;
    email: HTMLInputElement;
    password: HTMLInputElement;
    persistent: HTMLInputElement;
}
interface SignInFormElement extends HTMLFormElement {
    readonly elements: FormElements;
}

function ColorSchemeToggle(props: IconButtonProps) {
    const { onClick, ...other } = props;
    const { mode, setMode } = useColorScheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => setMounted(true), []);

    return (
        <IconButton
            aria-label="toggle light/dark mode"
            size="sm"
            variant="outlined"
            disabled={!mounted}
            onClick={(event) => {
                setMode(mode === 'light' ? 'dark' : 'light');
                onClick?.(event);
            }}
            {...other}
        >
            {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
        </IconButton>
    );
}

const customTheme = extendTheme({
    colorSchemes: {
        light: {
            palette: {
                primary: {
                    500: '#1976d2',
                },
            },
        },
        dark: {
            palette: {
                primary: {
                    500: '#90caf9',
                },
            },
        },
    },
});

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

export default function SignUp() {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const navigate = useNavigate();
    const [open, setOpen] = React.useState<boolean>(false);


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
            setOpen(true)
            setDialogOpen(true);
            setTimeout(() => {
                setOpen(false)
                setDialogOpen(false);
                navigate("/");
            }, 3000);
        } else {
            setError(result.message);
            setSuccess("");
        }
    };
    return (
        <CssVarsProvider theme={customTheme} disableTransitionOnChange>
            <CssBaseline />
            <GlobalStyles
                styles={{
                    ':root': {
                        '--Form-maxWidth': '800px',
                        '--Transition-duration': '0.4s',
                    },
                }}
            />
            <Box
                sx={(theme) => ({
                    width: { xs: '100%', md: '50vw' },
                    transition: 'width var(--Transition-duration)',
                    transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    backdropFilter: 'blur(12px)',
                    backgroundColor: 'rgba(255 255 255 / 0.2)',
                    [theme.getColorSchemeSelector('dark')]: {
                        backgroundColor: 'rgba(19 19 24 / 0.4)',
                    },
                })}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '100dvh',
                        width: '100%',
                        px: 2,
                    }}
                >
                    <Box
                        component="header"
                        sx={{ py: 3, display: 'flex', justifyContent: 'space-between' }}
                    >
                        <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
                            <IconButton variant="soft" color="primary" size="sm">
                                <img src="/assets/ubo.jpeg" alt="UBO" style={{ borderRadius: '5px', width: '50px', height: '50px' }} />
                            </IconButton>
                            <Typography level="title-lg">UBO - Université de Bretagne Occidentale</Typography>
                        </Box>
                        <ColorSchemeToggle />
                    </Box>
                    <Box
                        component="main"
                        sx={{
                            my: 'auto',
                            py: 2,
                            pb: 5,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            width: 400,
                            maxWidth: '100%',
                            mx: 'auto',
                            borderRadius: 'sm',
                            '& form': {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                            },
                            [`& .MuiFormLabel-asterisk`]: {
                                visibility: 'hidden',
                            },
                        }}
                    >
                        <Stack sx={{ gap: 4, mb: 2 }}>
                            <Stack sx={{ gap: 1 }}>

                                <Typography component="h1" level="h3">
                                    Create your account for free
                                </Typography>
                                <Typography level="body-sm">
                                    Already have an account?{' '}
                                    <Link href="/" level="title-sm">
                                        Sign in!
                                    </Link>
                                </Typography>
                            </Stack>
                            <Button
                                variant="soft"
                                color="neutral"
                                fullWidth
                                startDecorator={<GoogleIcon />}
                            >
                                Continue with Google
                            </Button>
                        </Stack>
                        <Divider
                            sx={(theme) => ({
                                [theme.getColorSchemeSelector('light')]: {
                                    color: { xs: '#FFF', md: 'text.tertiary' },
                                },
                            })}
                        >
                            or
                        </Divider>
                        <Stack sx={{ gap: 4, mt: 2 }}>
                            <form onSubmit={handleSubmit}>
                                <FormControl required>
                                    <FormLabel>Username</FormLabel>
                                    <Input type="text" name="username"/>
                                </FormControl>
                                <FormControl required>
                                    <FormLabel>Email</FormLabel>
                                    <Input type="email" name="email"/>
                                </FormControl>
                                <FormControl required>
                                    <FormLabel>Password</FormLabel>
                                    <Input type="password" name="password"/>
                                </FormControl>
                                <Stack sx={{gap: 4, mt: 2}}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Checkbox size="sm" label="Remember me" name="persistent" />
                                        <Link level="title-sm" href="#replace-with-a-link">
                                            Forgot your password?
                                        </Link>
                                    </Box>
                                    <Button type="submit" fullWidth>
                                        Sign in
                                    </Button>
                                </Stack>
                            </form>
                        </Stack>
                    </Box>
                    <Box component="footer" sx={{ py: 3 }}>
                        <Typography level="body-xs" sx={{ textAlign: 'center' }}>
                            © Your company {new Date().getFullYear()}
                        </Typography>
                    </Box>
                    {/*<Dialog*/}
                    {/*    open={dialogOpen}*/}
                    {/*    onClose={() => setDialogOpen(false)}*/}
                    {/*    TransitionProps={{ timeout: 300 }} // Ensure the duration is set correctly*/}
                    {/*>*/}
                    {/*    <DialogTitle>Login Successful</DialogTitle>*/}
                    {/*    <DialogContent sx={{ textAlign: "center" }}>*/}
                    {/*        <CheckCircle sx={{ color: "green", fontSize: 60, animation: `${bounce} 2s infinite` }} />*/}
                    {/*        <DialogContentText>*/}
                    {/*            You will be redirected to the chat app shortly.*/}
                    {/*        </DialogContentText>*/}
                    {/*    </DialogContent>*/}
                    {/*</Dialog>*/}
                    <Modal keepMounted open={open} onClose={() => setOpen(false)}>
                        <ModalDialog>
                            <DialogTitle>Registration Successful</DialogTitle>
                            <DialogContent sx={{display:"flex",flexDirection:"row",gap:"15px"}}>
                                <CheckCircle sx={{ color: "green", fontSize: 60, animation: `${bounce} 1s infinite`, marginTop:"25px"}} />
                                <DialogContentText>
                                    You will be redirected to the login page shortly.
                                </DialogContentText>
                            </DialogContent>
                        </ModalDialog>
                    </Modal>
                </Box>
            </Box>
            <Box
                sx={(theme) => ({
                    height: '100%',
                    position: 'fixed',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    left: { xs: 0, md: '50vw' },
                    transition:
                        'background-image var(--Transition-duration), left var(--Transition-duration) !important',
                    transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
                    backgroundColor: 'background.level1',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundImage:
                        'url(https://images.unsplash.com/photo-1527181152855-fc03fc7949c8?auto=format&w=1000&dpr=2)',
                    [theme.getColorSchemeSelector('dark')]: {
                        backgroundImage:
                            'url(https://images.unsplash.com/photo-1572072393749-3ca9c8ea0831?auto=format&w=1000&dpr=2)',
                    },
                })}
            />
        </CssVarsProvider>
    );
}
