import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    SAVE_USER,
    LOGOUT,
    ACCOUNT_DELETED
} from '../actions/types';
import firebase from '../firebase/firebase';

const initialState = {
    isAuthenticated: null,
    loading: true,
    user: null,
    usersRef: firebase.database().ref('users'),
    error: {}
};

function authReducer(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: payload
            };
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            return {
                ...state,
                ...payload,
                isAuthenticated: true,
                loading: false
            };
        case SAVE_USER: //save to realtime db
            return {
                ...state,
                usersRef: firebase
                    .database()
                    .ref('users')
                    .child(payload.user.uid)
                    .set({
                        name: payload.user.displayName,
                        avatar: payload.user.photoURL
                    })
            };
        case AUTH_ERROR:
        case REGISTER_FAIL:
            return {
                ...state,
                error: payload
            };
        case ACCOUNT_DELETED:
        case LOGOUT:
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false,
                user: null
            };
        default:
            return state;
    }
}

export default authReducer;
