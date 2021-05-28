import React from 'react';
import {BrowserRouter as Router,Switch,Route} from "react-router-dom";
import AuthCheck from '../Library/AuthCheck';
import CoreTheme from '../Library/CoreTheme';

// Routed components
import Index from '../pages/index';
import Logout from '../pages/logout';
import Login from '../pages/login';
import My from '../pages/my';
import AddInvoice from '../pages/invoice/add';
import Create from '../pages/create';
import Select from '../pages/select';
import SelectionCheck from '../Library/SelectionCheck';

export default function GlobalRouter () {

    return (
        <React.Fragment>
            <Router>
                <AuthCheck>
                    <SelectionCheck>
                        <Switch>
                            <Route exact="true" path="/">
                                <Index />
                            </Route>

                            <Route exact="true" path="/login">
                                <Login />
                            </Route>

                            <Route exact="true" path="/new">
                            </Route>

                            <Route exact="true" path="/logout">
                                <Logout/>
                            </Route>

                            <Route exact="true" path="/create">
                                <Create />
                            </Route>

                            <Route exact="true" path="/select">
                                <Select />
                            </Route>

                            <CoreTheme>
                                <Route exact="true" path="/my">
                                    <My/>
                                </Route>

                                <Route exact="true" path="/invoice/new">
                                    <AddInvoice/>
                                </Route>
                            </CoreTheme>

                        
                        
                        </Switch>
                    </SelectionCheck>
                </AuthCheck>
            </Router>
        </React.Fragment>
    )

}