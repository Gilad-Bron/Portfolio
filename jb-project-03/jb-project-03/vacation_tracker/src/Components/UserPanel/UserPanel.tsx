import React, {FC, useEffect, useState} from 'react';
import {VacationForm} from '../NewVacationForm/VacationForm';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import {ChartBar} from '../BarChartComp/BarChartComp';
import {Box, CssBaseline} from '@mui/material';
import CsvDownloadButton from 'react-json-to-csv';
import axios from 'axios';
import {User, Vacation} from '../../types'
import {appRoutes} from '../AppRouter/appRoutes'
import {SortTypes} from '../../DataStructures/VacationsManager'
import {FilterTypes} from '../../DataStructures/VacationsManager'
import _ from 'lodash'

axios.defaults.withCredentials = true;

enum MenuItems {
    View,
    Sort,
    User,
    Admin,
}

const settings = ['Profile', 'Logout'];
const admin = ['Add Vacation', 'View Report', 'Download Report (CSV)'];
const views = [FilterTypes.All, FilterTypes.Favorites];
const sortTypes: Array<SortTypes> = [SortTypes.Date, SortTypes.Price, SortTypes.Destination];

export interface VacationMenuActions {
    sortAction?: SortTypes
    filterAction?: FilterTypes
    refetch?: boolean
}

interface UserPanelProps {
    onMenuVacationAction: (action: VacationMenuActions) => void;
    currentUser?: User;
};

export const UserPanel: FC<UserPanelProps> = ({ onMenuVacationAction, currentUser }) => {
    const [isAddVacation, setIsAddVacation] = useState<boolean>(false);
    const [currentOpenMenuItem, setCurrentOpenMenuItem] = useState<MenuItems | null>(null);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [barData, setBarData] = useState<Array<ChartBar> | null>(null);

    const handleOpenViewMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        setCurrentOpenMenuItem(MenuItems.View);
    };

    const handleOpenSortMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        setCurrentOpenMenuItem(MenuItems.Sort);
    };

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        setCurrentOpenMenuItem(MenuItems.User);
    };

    const handleOpenAdminMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        setCurrentOpenMenuItem(MenuItems.Admin);
    };

    const closeMenu = () => {
        setAnchorEl(null);
        setCurrentOpenMenuItem(null);
    };

    const handleCloseUserMenu = async (setting) => {
        closeMenu()
        if (setting === 'Logout') {
            await axios.get(appRoutes.web.logout);
            window.location.href = "/login";
        } else if (setting === 'Profile') {
            window.location.href = '/profile';
        };
    };

    const handleCloseAdminMenu = (adminAction) => {
        closeMenu()
        if (adminAction === 'Add Vacation') {
            setIsAddVacation(true);
        } else if (adminAction === 'View Report') {
            window.location.href = '/report';
        };
    };

    const filterVacations = (view: FilterTypes) => {
        onMenuVacationAction({filterAction: view })
        closeMenu()
    };

    const sortVacations = (sortType: SortTypes) => {
        onMenuVacationAction({sortAction: sortType})
        closeMenu()
    };

    const getBarData = async () => {
        const { data } = await axios.get<Vacation[]>(appRoutes.api.vacations);
        const favorites: Array<ChartBar> = data.map((vacation) => {
            return {
                destination: vacation.destination,
                followers: _.size(vacation.user_ids),
            };
        });
        setBarData(favorites);
    };

    useEffect(() => {
        if (currentOpenMenuItem === MenuItems.Admin) {
            getBarData();
        }
    }, [currentOpenMenuItem]);

    return (
        <>
            <CssBaseline />
            <AppBar position="static" sx={{ alignContent: 'center', alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'row' }}>
                <Toolbar disableGutters>
                    {/* LOGO */}
                    <FlightTakeoffIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, fontSize: '2rem' }} />
                    <Typography
                        variant='h5'
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                            fontSize: '2rem',
                        }}
                    >
                        SKYROADS
                    </Typography>
                    {/* VIEW MENU */}
                    <Box sx={{ flexGrow: 0, m: 2 }}>
                        <Tooltip title="View Selection">
                            <IconButton onClick={handleOpenViewMenu} sx={{ p: 0 }}>
                                <Typography sx={{ color: 'white', fontVariant: 'small-caps' }}>View</Typography>
                                <ArrowDropDownIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'white' }} />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={currentOpenMenuItem === MenuItems.View}
                            onClose={closeMenu}
                        >
                            {views.map((view) => (
                                <MenuItem key={view} onClick={() => filterVacations(view)}>
                                    <Typography sx={{ textAlign: 'center', color: '#1976D2' }}>{view}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    {/* FILTER MENU */}
                    <Box sx={{ flexGrow: 0, m: 2 }}>
                        <Tooltip title="Sort Selection">
                            <IconButton onClick={handleOpenSortMenu} sx={{ p: 0 }}>
                                <Typography sx={{ color: 'white', fontVariant: 'small-caps' }}>Sort By</Typography>
                                <ArrowDropDownIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'white' }} />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={currentOpenMenuItem === MenuItems.Sort}
                            onClose={closeMenu}
                        >
                            {sortTypes.map((type) => (
                                <MenuItem key={type} onClick={() => sortVacations(type)}>
                                    <Typography sx={{ textAlign: 'center', color: '#1976D2' }}>{type}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    {/* ADMIN MENU */}
                    {currentUser?.role === 'admin' && (
                      <Box sx={{ flexGrow: 0, m: 2 }}>
                          <Tooltip title="Admin Actions">
                              <IconButton onClick={handleOpenAdminMenu} sx={{ p: 0 }}>
                                  <Typography sx={{ color: 'white', fontVariant: 'small-caps', fontWeight: 'bold' }}>Admin</Typography>
                                  <ArrowDropDownIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'white', fontWeight: 'bold' }} />
                              </IconButton>
                          </Tooltip>
                          <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={currentOpenMenuItem === MenuItems.Admin}
                            onClose={closeMenu}
                          >
                              {admin.map((adminAction) => (
                                <MenuItem key={adminAction} onClick={() => handleCloseAdminMenu(adminAction)}>
                                    {adminAction === 'Download Report (CSV)' ? (<>
                                        <CsvDownloadButton
                                          data={barData}
                                          filename="report.csv"
                                          delimiter=","
                                          headers={["Destination", "Followers"]}
                                          style={{ border: 'none', backgroundColor: 'transparent', color: '#1976D2', fontSize: '1rem', padding: '3px' }}

                                        /><p style={{ color: '#1976D2', margin: 0 }}>(CSV)</p>
                                    </>) : (
                                      <Typography sx={{ textAlign: 'center', color: '#1976D2' }}>{adminAction}</Typography>
                                    )}
                                </MenuItem>
                              ))}
                          </Menu>
                      </Box>
                    )}
                    {/* USER MENU */}
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="User Settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar sx={{ bgcolor: 'white', color: '#1976D2' }}>
                                    {currentUser?.first_name?.charAt(0).toUpperCase()}
                                </Avatar>
                                <Typography sx={{ color: 'white', ml: 1 }}>
                                    {`${currentUser?.first_name} ${currentUser?.last_name}`}
                                </Typography>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={currentOpenMenuItem === MenuItems.User}
                            onClose={closeMenu}
                        >
                            {settings.map((setting) => (
                                <MenuItem key={setting} onClick={() => handleCloseUserMenu(setting)}>
                                    <Typography sx={{ textAlign: 'center', color: '#1976D2' }}>{setting}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar >
            {isAddVacation && (<VacationForm vacationToEdit={null} loadVacationsProp={() => onMenuVacationAction({ refetch: true })} finishEdit={() => setIsAddVacation(false)} />)}
        </>
    );
};


