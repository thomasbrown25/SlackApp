import { setAlert } from './alert';
import {
    ADD_CHANNEL,
    ADD_CHANNEL_ERROR,
    GET_CHANNELS,
    GET_CHANNELS_ERROR,
    SET_CURRENT_CHANNEL,
    SET_PRIVATE_CHANNEL
} from './types';
import firebase from '../firebase';

// Add Channel
export const addChannel = (newChannel) => async (dispatch) => {
    try {
        console.log(`addChannel() ---> channel to be added...`);
        console.log(newChannel);

        firebase
            .database()
            .ref('channels')
            .child(newChannel.id)
            .update(newChannel)
            .then(() => {
                console.log('addChannel() ---> channel added.');
                getChannels();
            });

        return;
    } catch (err) {
        console.log(`Error adding channel: ${err}`);
        dispatch(setAlert(`Error adding channel: ${err.message}`, 'danger'));
        dispatch({
            type: ADD_CHANNEL_ERROR,
            payload: err
        });
    }
};

// Get Channels
export const getChannels = () => async (dispatch) => {
    try {
        let channels = [];

        firebase
            .database()
            .ref('channels')
            .on('value', (snapshot) => {
                snapshot.forEach((snap) => {
                    channels.push(snap.val());
                });
            });

        console.log('getChannels() ---> getting all channels..');
        console.log(channels);

        dispatch({
            type: GET_CHANNELS,
            payload: channels
        });
    } catch (err) {
        console.log(`Error getting channels: ${err}`);
        dispatch(setAlert(`Error getting channels:: ${err.message}`, 'danger'));
        dispatch({
            type: GET_CHANNELS_ERROR,
            payload: err
        });
    }
};

// Set Current Channel
export const setCurrentChannel = (channel) => async (dispatch) => {
    dispatch({
        type: SET_CURRENT_CHANNEL,
        payload: channel
    });
};

// Set Private Channel
export const setPrivateChannel = (isPrivateChannel) => async (dispatch) => {
    dispatch({
        type: SET_PRIVATE_CHANNEL,
        payload: isPrivateChannel
    });
};
