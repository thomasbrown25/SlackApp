import {
    UPLOAD_FILE,
    GET_FILE,
    UPLOAD_FILE_ERROR,
    GET_FILE_ERROR
} from '../actions/types';

const initialState = {
    file: null,
    storageRef: null,
    error: {}
};

function messageReducer(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case UPLOAD_FILE:
            return {
                ...state,
                storageRef: payload
            };

        case UPLOAD_FILE_ERROR:
            return {
                ...state,
                error: payload
            };

        default:
            return state;
    }
}

export default messageReducer;
