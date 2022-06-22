import { setAlert } from './alert';
import {
    UPLOAD_FILE,
    GET_FILE,
    UPLOAD_FILE_ERROR,
    GET_FILE_ERROR
} from './types';
import firebase from '../firebase/firebase';

// Add Channel
export const uploadFileToStorage = (fileData) => async (dispatch) => {
    try {
        console.log(
            `inside uploadFileStorage method, logging file data to be uploaded...`
        );
        console.log(fileData);

        const { file, filePath, metadata } = fileData;

        //upload file to storage
        const storageRef = firebase
            .storage()
            .ref()
            .child(filePath)
            .put(file, metadata);

        dispatch({
            type: UPLOAD_FILE,
            payload: storageRef
        });
        return;
    } catch (err) {
        console.log(`Error uploading file to storage: ${err}`);
        dispatch({
            type: UPLOAD_FILE_ERROR,
            payload: err
        });
    }
};
