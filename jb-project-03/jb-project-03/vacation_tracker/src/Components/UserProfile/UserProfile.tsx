import axios from 'axios';
import React, { FC, useEffect, useState } from 'react';
import { CssBaseline, Container, Box, Typography, Button } from '@mui/material';
import {User, Vacation} from '../../types'
import {appRoutes} from '../AppRouter/appRoutes'

export const UserProfile: FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [favorites, setFavorites] = useState<Array<Vacation> | null>(null);
    const [allVacations, setAllVacations] = useState<Array<Vacation> | null>(null);

    const handleLogout = async () => {
        await axios.get(appRoutes.web.logout);
        window.location.href = '/login';
    };

    const getAllVacations = async () => {
        const { data } = await axios.get(appRoutes.api.vacations);
        setAllVacations(data);
    };

    const getUser = async () => {
        const { data } = await axios.get(appRoutes.api.users);
        setUser(data);
    };

    const getUserFavorites = async () => {
        const { data } = await axios.get(appRoutes.api.favorites);
        let userFavorites: Array<Vacation> = [];
        allVacations?.forEach((vacation) => {
            data.forEach((favorite) => {
                if (vacation.ID === favorite.vacation_id) {
                    userFavorites.push(vacation);
                };
            });
        });
        setFavorites(userFavorites);
    };

    useEffect(() => {
        getUser();
        getAllVacations();
    }, []);

    useEffect(() => {
        if (user && allVacations) {
            getUserFavorites();
        }
    }, [user, allVacations]);

    return (
        <Container fixed sx={{ display: 'flex', justifyContent: 'center' }} >
            <CssBaseline />
            {user && (
                <Box sx={{ m: 3, border: '1px solid #ccc', borderRadius: '8px', boxShadow: 3, maxWidth: '500px', textAlign: 'left' }}>
                    <Typography variant="h4" sx={{ backgroundColor: 'lightblue', textAlign: 'center', p: 2 }}>My Profile</Typography>
                    <Typography variant="h6" sx={{ ml: 2, textAlign: 'left', p: 1 }}><strong>Name:</strong> {user[0]?.first_name} {user[0]?.last_name}</Typography>
                    <Typography variant="h6" sx={{ ml: 2, textAlign: 'left', p: 1 }}><strong>Email:</strong> {user[0]?.email}</Typography>
                    <Typography variant="h6" sx={{ ml: 2, textAlign: 'left', p: 1 }}><strong>Role:</strong> {user[0]?.role}</Typography>
                    <Typography variant="h6" sx={{ ml: 2, textAlign: 'left', p: 1 }}><strong>Favorite Destinations:</strong>
                        {favorites?.map((favorite) => {
                            return <Typography key={favorite.ID} sx={{ ml: 2, textAlign: 'left', p: 1 }} variant="body1" >
                                {favorite.destination} ({new Date(favorite.start_date).toLocaleDateString('en-GB')} - {new Date(favorite.end_date).toLocaleDateString('en-GB')})
                            </Typography>;
                        })}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', m: 2 }}>
                        <Button variant="contained" color="primary" sx={{ m: 'auto' }} href={'/main'}>Home</Button>
                        <Button variant="contained" color="error" sx={{ m: 'auto' }} onClick={handleLogout}>Logout</Button>
                    </Box>
                </Box>
            )}
        </Container>
    );
};