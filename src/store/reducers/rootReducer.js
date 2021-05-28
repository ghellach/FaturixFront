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

        case(types.SET_COMPANY_STATE): {
            state.hasCompany = action.payload.hasCompany;
            state.selectedCompany = action.payload.selectedCompany;
            state.company = action.payload.company;
            return state;
        }

        default:
            return state;
    }
}





