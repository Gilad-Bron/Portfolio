import React, { FC, useState, useEffect } from 'react';
import { Card, CardHeader, CardMedia, CardContent, CardActions, IconButton, Typography, Button } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from 'axios';
import { VacationForm } from '../NewVacationForm/VacationForm';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import {User, Vacation} from '../../types'
import {appRoutes} from '../AppRouter/appRoutes'
import _ from 'lodash'
axios.defaults.withCredentials = true;


interface VacationCardProps {
    vacation: Vacation;
    currentUser: User;
    refetch: () => void;
}

export const VacationCard: FC<VacationCardProps> = ({ vacation, currentUser, refetch }) => {
    const [isFavorite, setIsFavorite] = useState<boolean>(vacation.user_ids?.includes(currentUser.ID));
    const [numOfFavorites, setNumOfFavorites] = useState<number>(_.size(vacation.user_ids));
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [isDeleteMode, setIsDeleteMode] = useState<boolean>(false);

    const handleEdit = () => {
        setIsEditMode(true);
    };

    const handleDelete = () => {
        setIsDeleteMode(true);
    };

    const deleteVacation = async (id: number) => {
        await axios.delete(`${appRoutes.api.vacations}?id=${id}`);
        setIsDeleteMode(false);
        refetch();
    };

    const addFavorite = async () => {
        await axios.post(`${appRoutes.api.favorites}?isAddFavorite=true`, { vacation_id: vacation.ID });
        setIsFavorite(true);
        setNumOfFavorites((prevState) => prevState + 1);
    };

    const removeFavorite = async () => {
        await axios.post(`${appRoutes.api.favorites}?isAddFavorite=false`, { vacation_id: vacation.ID });
        setIsFavorite(false);
        setNumOfFavorites((prevState) => prevState - 1);
    };

    return (
        <Card sx={{ maxWidth: 259, mr: '24px', mt: '24px' }}>
            <CardHeader title={vacation?.destination} sx={{ fontVariant: 'small-caps', backgroundColor: '#87CEFA' }} />
            <CardMedia
                component="img"
                height="300"
                image={require(`../../assets/images/${vacation?.image}`)}
                alt="Destination Image"
            />
            <CardContent>
                <Typography variant="body2" sx={{ color: 'text.secondary', height: '200px', overflow: 'auto', textAlign: 'justify' }}>
                    {vacation?.description}
                </Typography>
                <CardHeader title={`${vacation?.price}$`} sx={{ color: 'green' }} />
                <Typography variant="body2" sx={{ fontSize: '16px' }}>
                    <b>{'Leaving:'}</b> {new Date(vacation?.start_date).toLocaleDateString('en-GB')}<br />
                    <b>{'Returning:'}</b> {new Date(vacation?.end_date).toLocaleDateString('en-GB')}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                {currentUser.role === 'user' && (
                    <>
                        <IconButton onClick={isFavorite ? removeFavorite : addFavorite} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: '80%', margin: 'auto' }}>
                            <FavoriteIcon sx={{ color: isFavorite ? 'green' : 'gray' }} />
                        </IconButton>
                        <p style={{ color: isFavorite ? 'green' : 'gray', fontSize: '12px', textAlign: 'center', margin: 'auto' }}>
                            {isFavorite
                                ? `You and ${numOfFavorites - 1} ${numOfFavorites - 1 === 1 ? 'more person are' : 'more people are'} following this destination!`
                                : `There ${numOfFavorites === 1 ? 'is' : 'are'} ${numOfFavorites} ${numOfFavorites === 1 ? 'person' : 'people'} following this destination!`}
                        </p>
                    </>
                )}
            </CardActions>
            {currentUser.role === 'admin' && (
                <>
                    <Typography variant="body2" sx={{ fontSize: '12px', textAlign: 'center', color: 'red' }}> Admin Actions:</Typography>
                    <CardActions sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                        <Button size="small" variant="contained" color="error" onClick={handleEdit}>Edit</Button>
                        <Button size="small" variant="contained" color="error" onClick={handleDelete}>Delete</Button>
                    </CardActions>
                </>
            )}
            {isEditMode && (
                <VacationForm vacationToEdit={vacation} loadVacationsProp={refetch} finishEdit={() => setIsEditMode(false)} />
            )}
            {isDeleteMode && (
                <Dialog open={isDeleteMode} sx={{ textAlign: 'center', minWidth: '400px', margin: 'auto' }}>
                    <DialogContent>
                        <DialogTitle>Are you sure you want to delete this destination?</DialogTitle>
                        <Button variant="contained" color="error" onClick={() => deleteVacation(vacation.ID)} sx={{ margin: 'auto', mr: 1 }}>Confirm</Button>
                        <Button variant="contained" color="primary" onClick={() => setIsDeleteMode(false)} sx={{ margin: 'auto' }}>Cancel</Button>
                    </DialogContent>
                </Dialog>
            )}
        </Card>
    );
};
