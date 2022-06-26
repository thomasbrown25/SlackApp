import { setAlert } from './alert';
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    SAVE_USER
} from './types';
import firebase from '../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import md5 from 'md5';

/*
  NOTE: we don't need a config object for axios as the
 default headers in axios are already Content-Type: application/json
 also axios stringifies and parses JSON for you, so no need for 
 JSON.stringify or JSON.parse
*/

// Load User
export const loadUser = (pushToHome) => async (dispatch) => {
    console.log('loading user');
    try {
        // const auth = getAuth();
        // const user = auth.currentUser;
        // if (user) {
        //     dispatch({
        //         type: USER_LOADED,
        //         payload: user,
        //     });
        // } else {
        //     // User is signed out
        //     // ...
        //     console.log('no user logged in');
        //     dispatch({
        //         type: LOGOUT,
        //     });
        // }
    } catch (err) {
        dispatch({
            type: AUTH_ERROR
        });
    }
};

// Register User
export const register = (formData) => async (dispatch) => {
    try {
        const { email, password } = formData;

        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then((createdUser) => {
                console.log(`created user.`);
                createdUser.user
                    .updateProfile({
                        displayName: formData.username,
                        photoURL: `http://gravatar.com/avatar/${md5(
                            createdUser.user.email
                        )}?d=identicon`
                    })
                    .then(() => {
                        dispatch({
                            type: SAVE_USER,
                            payload: createdUser
                        });
                        console.log('saved user to realtime db.');
                        dispatch({
                            type: REGISTER_SUCCESS,
                            payload: createdUser
                        });
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            })
            .catch((err) => {
                console.error(err);
                dispatch(
                    setAlert(
                        err.message
                            .replace('Firebase: ', '')
                            .replace(' (auth/email-already-in-use).', ''),
                        'danger'
                    )
                );

                dispatch({
                    type: REGISTER_FAIL,
                    payload: err
                });
            });
    } catch (err) {
        dispatch({
            type: REGISTER_FAIL,
            payload: err
        });
    }
};

// Login User
export const login = (formData) => async (dispatch) => {
    const { email, password } = formData;

    try {
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then((signedInUser) => {
                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: signedInUser
                });
            })
            .catch((err) => {
                console.error(err);
                dispatch({
                    type: LOGIN_FAIL,
                    payload: err
                });
                dispatch(setAlert(err.message, 'danger'));
            });
        dispatch(loadUser());
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: LOGIN_FAIL
        });
    }
};

// Logout
export const logout = () => async (dispatch) => {
    try {
        firebase
            .auth()
            .signOut()
            .then(() => {
                console.log('signed out');
                dispatch({
                    type: LOGOUT
                });
            });
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
        }
    }
};
