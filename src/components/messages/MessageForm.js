import React, { useEffect, useState } from 'react';
import { Segment, Input, Button } from 'semantic-ui-react';
import uuidv4 from 'uuidv4';
import '../../assets/Messages.css';
import firebase from '../../firebase/firebase';
import FileModal from './FileModal';

const MessageForm = ({ messagesRef, channel, user }) => {
    const [_messageData, setMessageData] = useState({
        value: ''
    });
    const { value } = _messageData;
    const onChange = (e) =>
        setMessageData({ ..._messageData, [e.target.name]: e.target.value });

    const [_loading, setLoading] = useState(false);

    const [_storageRef, setStorageRef] = useState(firebase.storage().ref());

    const createMessage = (fileUrl = null) => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: user.uid,
                name: user.displayName,
                avatar: user.photoURL
            }
        };
        if (fileUrl) {
            message['image'] = fileUrl;
        } else {
            message['value'] = _messageData.value;
        }
        console.log('creating message');
        console.log(message);
        return message;
    };

    const sendMessage = () => {
        if (_messageData && _messageData.value) {
            setLoading(true);
            messagesRef
                .child(channel.id)
                .push()
                .set(createMessage())
                .then(() => {
                    setLoading(false);
                    setMessageData({ value: '' });
                })
                .catch((err) => {
                    console.error(err);
                    setLoading(false);
                });
        }
    };

    const [modal, setModal] = useState(false);
    const closeModal = () => setModal(false);
    const openModal = () => setModal(true);

    const [_uploadState, setUploadState] = useState(false);
    const [_uploadTask, setUploadTask] = useState(null);
    const [_percentUploaded, setPercentUploaded] = useState(0);

    const uploadFile = (file, metadata) => {
        const filePath = `chat/public/${uuidv4}.jpg`;

        setUploadState('uploading');
        setUploadTask(_storageRef.child(filePath).put(file, metadata));
    };

    useEffect(() => {
        if (channel && messagesRef && _uploadTask) {
            try {
                console.log('about to upload image');
                const pathToUpload = channel.id;
                const ref = messagesRef;

                console.log(`ref: ${ref}`);
                console.log(`path to upload: ${pathToUpload}`);

                _uploadTask.on(
                    'state_changed',
                    (snap) => {
                        const percentUploaded = Math.round(
                            (snap.bytesTransferred / snap.totalBytes) * 100
                        );
                        setPercentUploaded(percentUploaded);
                        console.log('setting percent load ' + percentUploaded);
                    },
                    () => {
                        console.log('about to get download url');
                        _uploadTask.snapshot.ref
                            .getDownloadURL()
                            .then((downloadUrl) => {
                                console.log(`download url: ${downloadUrl}`);
                                console.log(`ref: ${ref}`);
                                console.log(`path to upload: ${pathToUpload}`);
                                sendFileMessage(downloadUrl, ref, pathToUpload);
                            })
                            .catch((err) => {
                                console.error(err);
                                setUploadState('error');
                                setUploadTask(null);
                            });
                    }
                );
            } catch (err) {
                console.error(err);
            }
        }
    }, [_uploadTask]);

    const sendFileMessage = (fileUrl, ref, pathToUpload) => {
        ref.child(pathToUpload)
            .push()
            .set(createMessage(fileUrl))
            .then(() => {
                setUploadState('done');
            })
            .catch((err) => {
                console.error(err);
            });
    };

    return (
        <Segment className='message__form'>
            <Input
                fluid
                name='value'
                value={value}
                onChange={onChange}
                style={{ marginBottom: '0.7em' }}
                label={<Button icon={'add'} />}
                labelPosition='left'
                placeholder='Write your message'
            />
            <Button.Group icon widths='2'>
                <Button
                    onClick={sendMessage}
                    disabled={_loading}
                    color='orange'
                    content='Add Reply'
                    labelPosition='left'
                    icon='edit'
                />
                <Button
                    onClick={openModal}
                    color='teal'
                    content='Upload Media'
                    labelPosition='right'
                    icon='cloud upload'
                />
                <FileModal
                    modal={modal}
                    closeModal={closeModal}
                    uploadFile={uploadFile}
                />
            </Button.Group>
        </Segment>
    );
};

export default MessageForm;
