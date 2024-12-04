import React, { FC, useState } from 'react';
import { Box, Button, Container, CssBaseline, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import axios from 'axios';
import {appRoutes} from '../AppRouter/appRoutes'
axios.defaults.withCredentials = true;

interface User {
    ID: number;
    first_name?: string;
    last_name?: string;
    email?: string;
    password?: string;
    repeat_password?: string;
    role?: string;
}

interface LoginDetails {
    email?: string;
    password?: string;
}

interface SignupFormErrors {
    first_name?: boolean;
    last_name?: boolean;
    email?: boolean;
    password?: boolean;
    repeat_password?: boolean;
}

interface LoginFormErrors {
    email?: boolean;
    password?: boolean;
}

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

export const AuthForm: FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [signupFormErrors, setSignupFormErrors] = useState<SignupFormErrors>(null);
    const [loginFormErrors, setLoginFormErrors] = useState<LoginFormErrors>(null);
    const [loginDetails, setLoginDetails] = useState<LoginDetails>(null);
    const [isPostSuccess, setIsPostSuccess] = useState(false);
    const [isLoginFailure, setIsLoginFailure] = useState(false);
    const [isSignupMode, setIsSignupMode] = useState(false);
    const [isEmailUnavailable, setIsEmailUnavailable] = useState(false);

    const handleLogin = async () => {
        const errors = validateLoginForm(loginDetails || {});
        if (Object.keys(errors).length === 0) {
            await axios.post(appRoutes.web.login, loginDetails, { withCredentials: true }).then((res) => {
                if (res.status === 200 && res.data === 'success') {
                    setIsLoginFailure(false);
                    window.location.href = '/main';
                } else {
                    setIsLoginFailure(true);
                };
            });
            setLoginDetails({});
        } else {
            setLoginFormErrors(errors);
        };
    };

    const handleSignup = async () => {
        const errors = validateSignupForm(user || {});
        if (Object.keys(errors).length === 0) {
            await axios.post(appRoutes.api.users, user).then((res) => {
                if (res.status === 200) { setIsPostSuccess(true) }
            });
            setUser({
                ID: 0,
                first_name: '',
                last_name: '',
                email: '',
                password: '',
                repeat_password: '',
                role: '',
            });
        } else {
            setSignupFormErrors(errors);
        };
    };

    const validateSignupForm = (formData): SignupFormErrors => {
        const errors: SignupFormErrors = {};

        if (!formData.first_name) {
            errors.first_name = true;
        };
        if (!formData.last_name) {
            errors.last_name = true;
        };
        if (!formData.email) {
            errors.email = true;
        } else if (!emailRegex.test(formData.email)) {
            errors.email = true;
        };
        if (!formData.password) {
            errors.password = true;
        } else if (!passwordRegex.test(formData.password)) {
            errors.password = true;
        };
        if (!formData.repeat_password) {
            errors.repeat_password = true;
        } else if (formData.password !== formData.repeat_password) {
            errors.repeat_password = true;
        };
        return errors;
    };

    const validateLoginForm = (formData): LoginFormErrors => {
        const errors: LoginFormErrors = {};

        if (!formData.email) {
            errors.email = true;
        } else if (!emailRegex.test(formData.email)) {
            errors.email = true;
        };
        if (!formData.password) {
            errors.password = true;
        };
        return errors;
    };

    const validateEmailAvailability = async (newUserEmail: string) => {
        const { data } = await axios.get(appRoutes.api.users);
        const isUnavailable = data.some((user: User) => user.email === newUserEmail);
        return isUnavailable;
    };

    const redirectToLogin = () => {
        setIsPostSuccess(false);
        setIsSignupMode(false);
        setIsLoginFailure(false);
        setLoginFormErrors({});
        setLoginDetails({});
    };

    const redirectToSignup = () => {
        setIsEmailUnavailable(false);
        setUser({ ...user, email: '' });
    };

    return (
        <>
            <CssBaseline />
            <Container >
                {/* LOGIN FORM */}
                <Box sx={{ display: isSignupMode ? "none" : "flex", flexDirection: "column", maxWidth: "400px", margin: "auto", textAlign: "center", gap: "20px" }}>
                    <h3>Welcome To Skyroads!</h3>
                    <TextField
                        error={loginFormErrors?.email}
                        id="outlined-error-helper-text-login-email"
                        label="Email Address"
                        value={loginDetails?.email || ''}
                        helperText={loginFormErrors?.email ? 'Please enter a valid email address' : ''}
                        onChange={(e) => setLoginDetails({ ...loginDetails, email: e.target.value })}
                        type="email"
                    />
                    <TextField
                        error={loginFormErrors?.password}
                        id="outlined-error-helper-text-login-password"
                        label="Password"
                        value={loginDetails?.password || ''}
                        helperText={loginFormErrors?.password ? 'Please enter your password' : ''}
                        onChange={(e) => setLoginDetails({ ...loginDetails, password: e.target.value })}
                        type="password"
                    />
                    <Button variant="contained" onClick={handleLogin}>Log In</Button>
                    <p>Don't have an account?</p>
                    <Button variant="contained" color="success" onClick={() => setIsSignupMode(true)} sx={{ margin: "auto" }}>Sign Up</Button>
                </Box>
                {/* SIGN UP FORM */}
                <Box sx={{ display: isSignupMode ? "flex" : "none", flexDirection: "column", maxWidth: "300px", margin: "auto", gap: "20px" }}>
                    <h3>Sign Up to Skyroads - <br /> Your gateway to the skies!</h3>
                    <TextField
                        error={signupFormErrors?.first_name}
                        id="outlined-error-helper-text-first-name"
                        label="First Name"
                        value={user?.first_name}
                        helperText={signupFormErrors?.first_name ? 'Please enter your first name' : ''}
                        onChange={(e) => setUser({ ...user, first_name: e.target.value })}
                        type="text"
                    />
                    <TextField
                        error={signupFormErrors?.last_name}
                        id="outlined-error-helper-text-last-name"
                        label="Last Name"
                        value={user?.last_name}
                        helperText={signupFormErrors?.last_name ? 'Please enter your last name' : ''}
                        onChange={(e) => setUser({ ...user, last_name: e.target.value })}
                        type="text"
                    />
                    <TextField
                        error={signupFormErrors?.email}
                        id="outlined-error-helper-text-email"
                        label="Email Address"
                        value={user?.email}
                        helperText={signupFormErrors?.email ? 'Please enter a valid email address' : ''}
                        onChange={async (e) => {
                            setUser({ ...user, email: e.target.value });
                            setIsEmailUnavailable(await validateEmailAvailability(e.target.value));
                        }}
                        type="email"
                    />
                    <TextField
                        error={signupFormErrors?.password}
                        id="outlined-error-helper-text-password"
                        label="Password"
                        value={user?.password}
                        helperText={signupFormErrors?.password ? 'Please enter your password! Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number' : ''}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                        type="password"
                    />
                    <TextField
                        error={signupFormErrors?.repeat_password}
                        id="outlined-error-helper-text-repeat-password"
                        label="Repeat Password"
                        value={user?.repeat_password}
                        helperText={signupFormErrors?.repeat_password ? 'Your passwords do not match' : ''}
                        onChange={(e) => setUser({ ...user, repeat_password: e.target.value })}
                        type="password"
                    />
                    <Button variant="contained" color="success" onClick={handleSignup}>Create Account</Button>
                </Box>
                {/* ACCOUNT CREATED SUCCESSFULLY DIALOG */}
                <Dialog open={isPostSuccess} sx={{ textAlign: 'center', maxWidth: '400px', margin: 'auto' }}>
                    <DialogContent>
                        <DialogTitle>{`Your account has been created successfully! Please log in to continue.`}</DialogTitle>
                        <Button variant="contained" onClick={redirectToLogin} color="success" sx={{ margin: 'auto' }}>Login</Button>
                    </DialogContent>
                </Dialog>
                {/* LOGIN FAILURE DIALOG */}
                <Dialog open={isLoginFailure} sx={{ textAlign: 'center', maxWidth: '400px', margin: 'auto' }}>
                    <DialogContent>
                        <DialogTitle>{`One or more of your login details are incorrect. Please try again.`}</DialogTitle>
                        <Button variant="contained" onClick={redirectToLogin} color="error" sx={{ margin: 'auto' }}>Retry</Button>
                    </DialogContent>
                </Dialog>
                {/* EMAIL UNAVAILABLE DIALOG */}
                <Dialog open={isEmailUnavailable} sx={{ textAlign: 'center', maxWidth: '400px', margin: 'auto' }}>
                    <DialogContent>
                        <DialogTitle>{`The email address you entered is already in use. Please enter a different email address.`}</DialogTitle>
                        <Button variant="contained" onClick={redirectToSignup} color="error" sx={{ margin: 'auto' }}>Retry</Button>
                    </DialogContent>
                </Dialog>

            </Container>
        </>
    );
}