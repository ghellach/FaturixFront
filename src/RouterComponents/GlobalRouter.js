import React from 'react';
import {BrowserRouter as Router,Switch,Route,Link} from "react-router-dom";
import {useSelector, useStore} from 'react-redux';

import AuthRouter from './AuthRouter';
import Index from '../pages/index';

export default function GlobalRouter (props) {

    const gProps = useSelector(state => state);
    console.log(gProps);

    return (
        <React.Fragment>
            <Router>
                <Switch>
                    <AuthRouter/>

                    <Route path="/">
                        <Switch>
                        <Route path="/">
                            <Index />
                        </Route>
                        </Switch>
                    </Route>
                </Switch>
            </Router>
        </React.Fragment>
    )

}