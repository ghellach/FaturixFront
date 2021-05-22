import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import axios from 'axios';
import {composeWithDevTools} from 'redux-devtools-extension';
// system
import rootReducer from './reducers/rootReducer';
import {initialState} from '../env.config.js';
// language
import en from '../data/en';
import fr from '../data/fr';
// compnents
import * as LoadingLibrary from '../Library/Loading';
import * as UtilsComponents from '../Library/Utils';

// api clients
const post = (url, body, notLogged) => axios.post(initialState().API_URL+String(url), {
    ...body,
    session: notLogged ? undefined : window.localStorage.session
});


const initialGlobalState = () => {
    const lang = window.localStorage.getItem("lang");
    if(!lang) window.localStorage.setItem("lang", "en");
    const langIso = lang ? lang === "fr" ? "fr" : "en" : "en";
    return {
        ...initialState(),

        // global components 
        loadingComp: LoadingLibrary.LoadingComponent,
        Library: {
            ...UtilsComponents
        },

        // request providers
        post,

        //language
        lang: lang ? lang === "fr" ? fr : en : en,
        langIso,
        changeLang: () => {
            if(langIso === "fr") window.localStorage.setItem("lang", "en")
            else if(langIso === "en") window.localStorage.setItem("lang", "fr");

            window.location.reload();
        },

        user: {

        }
    }
}

export default createStore(rootReducer, initialGlobalState(), composeWithDevTools(applyMiddleware(thunk)));