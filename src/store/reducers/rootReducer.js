import * as types from '../actions/actionsTypes';

export default function reducer (state = {}, action) {
    const s = {...state};
    switch(action.type) {
        case(types.LOGIN):
            break;
        default:
            return s;
    }
}