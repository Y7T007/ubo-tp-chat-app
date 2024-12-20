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
import {Dialog, DialogTitle, DialogContent, DialogContentText} from "@mui/material";
import Alert from '@mui/joy/Alert';
import { CheckCircle } from "@mui/icons-material";
import { keyframes } from "@emotion/react";
import ReportIcon from '@mui/icons-material/Report';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';


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

export default function JoySignInSideTemplate() {
    const [error, setError] = useState({} as CustomError);
    const [session, setSession] = useState({} as Session);
    const [dialogOpen, setDialogOpen] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent<SignInFormElement>) => {
        event.preventDefault();
        const formElements = event.currentTarget.elements;
        const data = {
            email: formElements.login.value,
            password: formElements.password.value,
            persistent: formElements.persistent.checked,
        };
        loginUser(
            { user_id: -1, username: data.email, password: data.password },
            (result: Session) => {
                console.log(result);
                setSession(result);
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
                            Sign in
                        </Typography>
                        <Typography level="body-sm">
                            New to company?{' '}
                            <Link href="/signup" level="title-sm">
                                Sign up!
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
                            <FormLabel>Email</FormLabel>
                            <Input type="text" name="login"/>
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
                {session.token && (
                    <Typography  sx={{ mt: 2 }}>
                        Welcome, {session.username}!
                    </Typography>
                )}
                {error.message && (
                    <Alert
                        key="Error"
                        sx={{ alignItems: 'flex-start' }}
                        startDecorator={<ReportIcon/>}
                        variant="soft"
                        color="danger"
                        endDecorator={
                            <IconButton variant="soft" color="danger">
                                <CloseRoundedIcon />
                            </IconButton>
                        }
                    >
                        <div>
                            <div>Error</div>
                            <Typography level="body-sm" color="danger">
                                {error.message}
                            </Typography>
                        </div>
                    </Alert>
                )}

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
