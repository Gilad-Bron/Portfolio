import React, {FC, useEffect, useState} from 'react';
import axios from 'axios';
import {VacationCard} from '../VacationCard/VacationCard';
import {UserPanel, VacationMenuActions} from '../UserPanel/UserPanel';
import _ from 'lodash';
import {Container, CssBaseline} from '@mui/material';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import {User, Vacation} from '../../types'
import {appRoutes} from '../AppRouter/appRoutes'
import {VacationsManager} from '../../DataStructures/VacationsManager'

const vacationsManager = new VacationsManager()

export const Main: FC = () => {
    const [allVacations, setAllVacations] = useState<Array<Vacation> | null>(null);
    const [pageVacations, setPageVacations] = useState<Array<Vacation> | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [page, setPage] = useState<number>(1);

    const onPaginationChange = (event: React.ChangeEvent<unknown>, pageArg: number) => {
        const newPageVacations = allVacations?.slice((pageArg - 1) * 10, pageArg * 10);
        setPageVacations(newPageVacations);
        setPage(pageArg);
    };

    const getUserRole = async () => {
        const { data } = await axios.get<User[]>(appRoutes.api.users);
        setCurrentUser(_.pick(data[0], ['ID', 'role', 'first_name', 'last_name']));
    };

    const fetchVacations = async () => {
        const { data } = await axios.get<Vacation[]>(appRoutes.api.vacations);
        setAllVacations(data);
        vacationsManager.loadVacations(data);
    };

    useEffect(() => {
        fetchVacations();
        getUserRole();
        onPaginationChange(null, 1);
    }, []);

    useEffect(() => {
        if (allVacations) {
            onPaginationChange(null, page);
        }
    }, [allVacations]);

    const onMenuVacationAction = (menuAction: VacationMenuActions) => {
        if (menuAction.sortAction) {
            setAllVacations(vacationsManager.sort(menuAction.sortAction))
        } else if (menuAction.filterAction) {
            setAllVacations(vacationsManager.filter(menuAction.filterAction, currentUser.ID))
        } else if (menuAction.refetch) {
            fetchVacations()
        }
        onPaginationChange(null, 1);
    }
    return (
        <>
            <CssBaseline />
            <Container maxWidth="xl">
                <UserPanel onMenuVacationAction={onMenuVacationAction} currentUser={currentUser} />
                <Stack spacing={2} direction="row" sx={{ justifyContent: 'center', marginTop: '10px' }}>
                    <Pagination count={Math.ceil((allVacations?.length || 0) / 10)} page={page} onChange={onPaginationChange} color="primary" />
                </Stack>
                <div className="card-view" style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', marginLeft: '48px', marginBottom: '16px' }}>
                    {pageVacations?.map((vacation: Vacation, index: number) =>
                        <VacationCard key={index}
                                      vacation={vacation}
                                      currentUser={currentUser}
                                      refetch={fetchVacations} />
                    )}
                </div>
                <Stack spacing={2} direction="row" sx={{ justifyContent: 'center', marginTop: '10px', marginBottom: '16px' }}>
                    <Pagination count={Math.ceil((allVacations?.length || 0) / 10)} page={page} onChange={onPaginationChange} color="primary" />
                </Stack>
            </Container>
        </>
    );
};

// FIX REQUIRED: Cannot EDIT/DELETE *newly added* vacation UNLESS after a page refresh. All other edit/delete ops (for existing vacations) work fine.