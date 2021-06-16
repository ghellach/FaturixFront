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
import Invoice from '../pages/invoice/one';
import Create from '../pages/create';
import Select from '../pages/select';
import SelectionCheck from '../Library/SelectionCheck';
import Products from '../pages/products';
import Product from '../pages/products/one';
import Test from '../pages/scan/qr';
import Process from '../pages/scan/process';
import NewProduct from '../pages/products/new';

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

                                <Route exact="true" path="/invoices/new">
                                    <AddInvoice/>
                                </Route>

                                <Route exact="true" path="/invoice/:uuid">
                                    <Invoice/>
                                </Route>


                                {/*Products*/}
                                <Route exact="true" path="/products">
                                    <Products/>
                                </Route>

                                <Route exact="true" path="/product/:uuid">
                                    <Product/>
                                </Route>

                                <Route exact="true" path="/products/new">
                                    <NewProduct/>
                                </Route>

                                

                                <Route exact="true" path="/qr">
                                    <Test/>
                                </Route>

                                <Route exact="true" path="/process">
                                    <Process/>
                                </Route>

                            </CoreTheme>

                        
                        
                        </Switch>
                    </SelectionCheck>
                </AuthCheck>
            </Router>
        </React.Fragment>
    )

}