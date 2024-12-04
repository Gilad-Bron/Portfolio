import React from 'react';
import { Routes, Route } from 'react-router';
import { AuthForm } from '../AuthForm/AuthForm';
import { Authenticator } from '../Authenticator';
import { Main } from '../Main/Main';
import { BarChartComp } from '../BarChartComp/BarChartComp';
import { UserProfile } from '../UserProfile/UserProfile';

export const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Authenticator />} />
            <Route path="/login" element={<AuthForm />} />
            <Route path="/main" element={<Main />} />
            <Route path="/report" element={<BarChartComp />} />
            <Route path="/profile" element={<UserProfile />} />
        </Routes>
    );
};