import React, { FC, useState, useEffect } from "react";
import axios from "axios";
import { Container, CssBaseline, Typography, Box, Button } from "@mui/material";
import { BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Rectangle, ResponsiveContainer, Bar } from "recharts";
import CsvDownloadButton from 'react-json-to-csv';
import {Vacation} from '../../types'
import {appRoutes} from '../AppRouter/appRoutes'
import _ from 'lodash'

export interface ChartBar {
    destination: string;
    followers: number;
}

export const BarChartComp: FC = () => {
    const [barData, setBarData] = useState<Array<ChartBar> | null>(null);

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
            getBarData();
    }, []);

    return (
        <>
            <CssBaseline />
            <Container maxWidth="xl" sx={{ margin: 'auto', mt: 10 }}>
                <Typography variant="h4" align="center" gutterBottom sx={{ fontFamily: 'monospace' }}> Followers per Destination: </Typography>
                <ResponsiveContainer width={"100%"} height={600}>
                    <BarChart
                        data={barData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="destination" />
                        <YAxis
                            label={{ value: 'Number of Followers', angle: -90, position: 'insideLeft' }}
                            allowDecimals={false}
                        />
                        <Tooltip />
                        <Bar
                            dataKey="followers"
                            fill="#B3CDAD"
                            activeBar={<Rectangle stroke="blue" />}
                        />
                    </BarChart>
                </ResponsiveContainer>
                <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
                    <Typography>
                        <Button variant="contained" color="primary">
                            <CsvDownloadButton
                                data={barData}
                                filename="report.csv"
                                delimiter=","
                                headers={["Destination", "Followers"]}
                                style={{ border: 'none', backgroundColor: 'transparent', color: 'white', fontSize: '1rem', padding: '3px' }}
                            />
                        </Button>
                        <Button variant="contained" color="primary" onClick={() => window.location.href = '/main'} sx={{ ml: 2 }}>Done</Button>
                    </Typography>
                </Box>
            </Container>
        </>
    );
}
