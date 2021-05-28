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

export async function setCompanyState(dispatch, which, has) {
    window.localStorage.setItem("hasCompany", has)
    try {
        if(which) {
            
            axios.post(env().API_URL+"/company/fetch/company", {
                session: window.localStorage.getItem("session"),
                uuid: which
            })
            .then(res => {
                window.localStorage.setItem("hasCompany", true);
                window.localStorage.setItem("selectedCompany", true);
                window.localStorage.setItem("company", res.data.uuid);
                dispatch({
                    type: types.SET_COMPANY_STATE,
                    payload: {
                        hasCompany: true,
                        selectedCompany: res.data.uuid ? true : false,
                        company: res.data,

                    }
                })
            })
            .catch(() => {
                window.localStorage.setItem("selectedCompany", false)
                window.location.href = "/select";
            })
        }else {
            window.localStorage.setItem("selectedCompany", false)
            if(has) window.location.href = "/select";
            else window.location.href = "/create";
        }
    }catch (err) {
        console.log(err);
    }
}