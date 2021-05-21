import React from "react";
import {Provider} from 'react-redux';
import store from './store/store';

// root components
import GlobalRouter from "./RouterComponents/GlobalRouter";


function App() {
    return (
        <React.Fragment>
            <Provider store={store}>
                <GlobalRouter/>
            </Provider>
        </React.Fragment>
    );
  }
  
  export default App;
  