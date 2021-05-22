import * as types from './actionsTypes';
import jwt from 'jsonwebtoken';

export function pingUser (dispatch) {
    try {
        const user = jwt.decode(window.localStorage.getItem("session"))
        dispatch({type: types.PING_USER, payload: {...user}});
    }catch {
        window.location.href = "/login";
    }
    
}