import * as types from '../actions/actionsTypes';

export default function reducer (s = {}, action) {
    const state = {...s};
    switch(action.type) {
        case(types.LOGIN):
            break;

        case(types.PING_USER): {
            state.user = action.payload;
            return state;
        }

        default:
            return state;
    }
}





