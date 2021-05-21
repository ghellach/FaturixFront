import React from 'react';
import {BrowserRouter as Router,Switch,Route,Link} from "react-router-dom";
import {useSelector, useStore} from 'react-redux';
import Login from '../pages/login';

export default function AuthRouter (props) {

    const gProps = useSelector(state => state);
    console.log(gProps);

    return (
        <Route path="">
            <Switch>

                <Route path="/login">
                    <Login />
                </Route>

                <Route path="/new">
                </Route>

                <Route path="/logout">
                </Route>
            </Switch>
        </Route>
    )

}