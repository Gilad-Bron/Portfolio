import React, {FC, useEffect} from 'react';
import axios from 'axios';
import {appRoutes} from './AppRouter/appRoutes'

const useEffectAsync = (callback: () => Promise<void>, deps: any[]) => {
    useEffect(() => {
        callback();
    }, deps);
}

export const Authenticator: FC = () => {
    useEffectAsync(async () => {
        const { data } = await axios.get(appRoutes.web.home);
        if (data.authenticated) {
            console.log("Authenticated user: ", data);
            window.location.href = "/main";
        } else {
            console.log("Not authenticated user: ", data);
            window.location.href = "/login";
        }
    }, []);

    return (
        <>Loading...</>
    )
}
