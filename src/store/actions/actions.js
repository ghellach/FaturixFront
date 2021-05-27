import * as types from './actionsTypes';
import jwt from 'jsonwebtoken';
import {initialState as env} from '../../env.config';
import axios from 'axios';

export function pingUser (dispatch) {
    try {
        const user = jwt.decode(window.localStorage.getItem("session"))
        dispatch({type: types.PING_USER, payload: {...user}});
    }catch {
        window.location.href = "/login";
    }
    
}

export async function setCompanyState(dispatch, has, which) {
    try {
        if(which) {
            window.localStorage.setItem("company", which);
            axios.post(env.API_URL+"/company/fetch", {
                session: window.localStorage.getItem("session"),
                uuid: which
            })
            .then(res => dispatch({
                type: types.SET_COMPANY_STATE,
                payload: {
                    has,
                    company: has ? res.data : undefined,

                }
            }))
            .err(() => window.location.href = "/select");
        }else {
            if(has) window.location.href = "/select";
            else window.location.href = "/create";
        }
    }catch (err) {
        console.log(err);
    }
}