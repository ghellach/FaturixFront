import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import rootReducer from './reducers/rootReducer';
import {initialState} from '../env.config.js';


// global components 
import * as LoadingLibrary from '../Library/Workers/Loading';

const initialGlobalState = () => {
    return {
        ...initialState(),

        // global components 
        loadingComp: LoadingLibrary.LoadingComponent
    }
}

export default createStore(rootReducer, initialGlobalState(), composeWithDevTools(applyMiddleware(thunk)));