import axios from 'axios';
import React from 'react';
import {Redirect} from 'react-router-dom';
import {initialState as env} from '../env.config';

export default function Logout () {

    const next = () => {
        const lang = window.localStorage.getItem("lang");
        window.localStorage.clear();
        window.localStorage.setItem("lang", lang);
        window.location.href="/login";
    }

    axios.post(env().API_URL+"/auth/logout", {session: window.localStorage.getItem("session")});
    next();

    return <div></div>
   
}