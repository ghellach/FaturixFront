import React from 'react';
import {Redirect} from 'react-router-dom';

export default function Logout () {
    window.localStorage.removeItem("session");
    return <Redirect to="/login"/>;
}