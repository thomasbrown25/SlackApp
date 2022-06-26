import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';
import {
    addChannel,
    getChannels,
    setCurrentChannel,
    setPrivateChannel
} from '../../actions/channels';
import firebase from '../../firebase/firebase';

const Channels = ({
    user,
    addChannel,
    getChannels,
    setCurrentChannel,
    setPrivateChannel,
    channel: { channels, channelsRef }
}) => {
    useEffect(() => {
        getChannels();
    }, []);

    const [_channelsFromFirebase, setChannelsFromFirebase] = useState([]);

    const [_messagesRef, setMessagesRef] = useState(
        firebase.database().ref('messages')
    );
    const [_channel, setChannel] = useState();
    const [_notifications, setNotifications] = useState();

    //bandaid put into place for race condition because the components were not updating once props were updated using the store.
    const initializeChannels = () => {
        let channelsList = [];
        firebase
            .database()
            .ref('channels')
            .on('value', (snapshot) => {
                snapshot.forEach((snap) => {
                    channelsList.push(snap.val());
                });
                setChannelsFromFirebase(channelsList);
                console.log('set channels from firebase');
            });
    };

    useEffect(() => {
        initializeChannels();
    }, []);

    const [activeChannel, setActiveChannel] = useState(null);

    const changeChannel = (channel) => {
        setCurrentChannel(channel);
        setActiveChannel(channel.id);
        setPrivateChannel(false);
        setChannel(channel);
    };

    const setFirstChannel = () => {
        if (channels.length > 0) {
            const firstChannel = channels[0];
            setCurrentChannel(firstChannel);
            setActiveChannel(firstChannel.id);
        }
    };

    useEffect(() => {
        setFirstChannel();
    }, [_channelsFromFirebase]);

    const addListeners = () => {
        console.log('hit add listener');
        let loadedChannels = [];
        channelsRef.on('child_added', (snap) => {
            loadedChannels.push(snap.val());
            setChannelsFromFirebase(loadedChannels);
            addNotificationListener(snap.key);
        });
    };

    const addNotificationListener = (channelId) => {
        _messagesRef.child(channelId).on('value', (snap) => {
            if (_channel) {
                handleNotifications(
                    channelId,
                    _channel.id,
                    _notifications,
                    snap
                );
            }
        });
    };

    const handleNotifications = (
        channelId,
        currentChannelId,
        notifications,
        snap
    ) => {
        let lastTotal = 0;

        let index = notifications.findIndex(
            (notification) => notification.id === channelId
        );

        if (index !== -1) {
            if (channelId !== currentChannelId) {
                lastTotal = notifications[index].total;

                if (snap.numChildren() - lastTotal > 0) {
                    notifications[index].count = snap.numChildren() - lastTotal;
                }
            }
            notifications[index].lastKnownTotal = snap.numChildren();
        } else {
            notifications.push({
                id: channelId,
                total: snap.numChildren(),
                lastKnownTotal: snap.numChildren(),
                count: 0
            });
        }
        console.log('set notification');
        console.log(notifications);
        setNotifications(notifications);
    };

    useEffect(() => {
        addListeners();
    }, [channels]);
    useEffect(() => {
        return function listenerCleanup() {
            channelsRef.off();
        };
    }, []);

    const [modal, setModal] = useState(false);
    const [channelData, setChannelData] = useState({
        channelName: '',
        channelDetails: ''
    });
    const { channelName, channelDetails } = channelData;

    const onChange = (e) =>
        setChannelData({ ...channelData, [e.target.name]: e.target.value });

    const closeModal = () => setModal(false);
    const openModal = () => setModal(true);

    const onSubmit = (e) => {
        e.preventDefault();
        if (isFormValid(channelName, channelDetails)) {
            const key = channelsRef.push().key;

            const newChannel = {
                id: key,
                name: channelName,
                details: channelDetails,
                createdBy: {
                    name: user.displayName,
                    avatar: user.photoURL
                }
            };

            addChannel(newChannel);
            setChannelData({ channelName: '', channelDetails: '' });
            closeModal();
        }
    };

    const isFormValid = (channelName, channelDetails) =>
        channelName && channelDetails;

    //display list of channels
    const displayChannels =
        _channelsFromFirebase.length > 0 &&
        _channelsFromFirebase.map((channel) => (
            <Menu.Item
                key={channel.id}
                onClick={() => changeChannel(channel)}
                name={channel.name}
                style={{ opacity: 0.7 }}
                active={channel.id === activeChannel}
            >
                # {channel.name}
            </Menu.Item>
        ));

    return (
        <Fragment>
            <Menu.Menu className='menu'>
                <Menu.Item>
                    <span>
                        <Icon name='exchange' /> CHANNELS
                    </span>
                    ({_channelsFromFirebase.length}){' '}
                    <Icon name='add' onClick={openModal} />
                </Menu.Item>
                {/* Channels */}
                {displayChannels}
            </Menu.Menu>

            {/* Add Channel Modal */}
            <Modal basic open={modal} onClose={closeModal}>
                <Modal.Header>Add a Channel</Modal.Header>
                <Modal.Content>
                    <Form onSubmit={onSubmit}>
                        <Form.Field>
                            <Input
                                fluid
                                label='Name of Channel'
                                name='channelName'
                                onChange={onChange}
                            />
                        </Form.Field>

                        <Form.Field>
                            <Input
                                fluid
                                label='About the Channel'
                                name='channelDetails'
                                onChange={onChange}
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <Button color='green' inverted onClick={onSubmit}>
                        <Icon name='checkmark' /> Add
                    </Button>
                    <Button color='red' inverted onClick={closeModal}>
                        <Icon name='remove' /> Cancel
                    </Button>
                </Modal.Actions>
            </Modal>
        </Fragment>
    );
};

Channels.propTypes = {
    addChannel: PropTypes.func.isRequired,
    getChannels: PropTypes.func.isRequired,
    setCurrentChannel: PropTypes.func.isRequired,
    setPrivateChannel: PropTypes.func.isRequired,
    channel: PropTypes.object.isRequired,
    channels: PropTypes.array.isRequired
};

const mapStateToProps = (state) => ({
    channel: state.channel,
    channels: state.channel.channels
});

export default connect(mapStateToProps, {
    addChannel,
    getChannels,
    setCurrentChannel,
    setPrivateChannel
})(Channels);
