import { getChannels } from '../actions/channels';
import {
    ADD_CHANNEL,
    ADD_CHANNEL_ERROR,
    GET_CHANNELS,
    GET_CHANNELS_ERROR,
    SET_CURRENT_CHANNEL
} from '../actions/types';
import firebase from '../firebase/firebase';

const initialState = {
    channels: [],
    currentChannel: null,
    channelsRef: firebase.database().ref('channels'),
    error: {},
    loading: true
};

function channelReducer(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case ADD_CHANNEL:
            return {
                ...state,
                channelsRef: firebase
                    .database()
                    .ref('channels')
                    .child(payload.id)
                    .update(payload)
            };

        case GET_CHANNELS:
            return {
                ...state,
                channels: payload,
                loading: false
            };

        case SET_CURRENT_CHANNEL:
            return {
                ...state,
                currentChannel: payload
            };

        case GET_CHANNELS_ERROR:
        case ADD_CHANNEL_ERROR:
            return {
                ...state,
                error: payload
            };

        default:
            return state;
    }
}

export default channelReducer;
