import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Segment, Input, Button } from 'semantic-ui-react';
import { v4 as uuidv4 } from 'uuid';
import firebase from '../../firebase/firebase';
import { uploadBytesResumable } from 'firebase/storage';
import FileModal from './FileModal';
import { uploadFileToStorage } from '../../actions/messages';
import ProgressBar from './ProgressBar';
import '../../assets/messages.css';

const MessageForm = ({
    messagesRef,
    channel,
    user,
    uploadFileToStorage,
    storageRef,
    isPrivateChannel,
    getMessagesRef
}) => {
    const [_messageData, setMessageData] = useState({
        value: ''
    });
    const { value } = _messageData;
    const onChange = (e) =>
        setMessageData({ ..._messageData, [e.target.name]: e.target.value });

    const [_loading, setLoading] = useState(false);

    const [modal, setModal] = useState(false);
    const closeModal = () => setModal(false);
    const openModal = () => setModal(true);

    const [_uploadState, setUploadState] = useState(false);
    const [_beginUpload, setBeginUpload] = useState(null);
    const [_percentUploaded, setPercentUploaded] = useState(0);

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
        console.log('sending message');
        console.log(message);
        return message;
    };

    const sendMessage = () => {
        if (_messageData && _messageData.value) {
            setLoading(true);
            getMessagesRef()
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

    const uploadFile = (file, metadata) => {
        setUploadState('uploading');
        console.log('uploading.....');

        const filePath = `${getPath()}/${uuidv4()}.jpg`;

        const fileData = {
            file: file,
            filePath: filePath,
            metadata: metadata
        };
        uploadFileToStorage(fileData);
    };

    const getPath = () => {
        if (isPrivateChannel) {
            return `chat/private-${channel.id}`;
        } else {
            return 'chat/public';
        }
    };

    useEffect(() => {
        if (channel && messagesRef && storageRef) {
            try {
                storageRef.on(
                    'state_changed',
                    (snap) => {
                        const percentUploaded = Math.round(
                            (snap.bytesTransferred / snap.totalBytes) * 100
                        );
                        setPercentUploaded(percentUploaded);
                        console.log(`upload is ${percentUploaded}% done`);
                    },
                    (err) => {
                        console.error(err);
                    },
                    () => {
                        console.log('getting file to display in message');
                        const pathToUpload = channel.id;
                        const ref = getMessagesRef();
                        storageRef.snapshot.ref
                            .getDownloadURL()
                            .then((downloadUrl) => {
                                sendFileMessage(downloadUrl, ref, pathToUpload);
                            })
                            .catch((err) => {
                                console.error(err);
                                setUploadState('error');
                            });
                    }
                );
            } catch (err) {
                console.error(err);
            }
        }
    }, [storageRef]);

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
                    content='Send'
                    labelPosition='left'
                    icon='edit'
                />
                <Button
                    onClick={openModal}
                    disabled={_uploadState === 'uploading'}
                    color='teal'
                    content='Add Media'
                    labelPosition='right'
                    icon='cloud upload'
                />
            </Button.Group>
            <FileModal
                modal={modal}
                closeModal={closeModal}
                uploadFile={uploadFile}
            />
            <ProgressBar
                uploadState={_uploadState}
                percentUploaded={_percentUploaded}
            />
        </Segment>
    );
};

MessageForm.propTypes = {
    uploadFileToStorage: PropTypes.func.isRequired,
    storageRef: PropTypes.object
};

const mapStateToProps = (state) => ({
    storageRef: state.message.storageRef
});

export default connect(mapStateToProps, {
    uploadFileToStorage
})(MessageForm);
