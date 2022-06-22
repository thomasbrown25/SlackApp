import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';
import {
    addChannel,
    getChannels,
    setCurrentChannel
} from '../../actions/channels';
import firebase from '../../firebase/firebase';

const Channels = ({
    user,
    addChannel,
    getChannels,
    setCurrentChannel,
    channel: { channels, channelsRef }
}) => {
    useEffect(() => {
        getChannels();
    }, []);

    const [_channelsFromFirebase, setChannelsFromFirebase] = useState([]);

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
                console.log(channelsList);
                // if (channels == null && channelsFromFirebase != null) {
                //     console.log(
                //         'channels were not set initially, re-running getChannels()'
                //     );
                //     getChannels();
                // }
                // setFirstChannel();
            });
    };

    useEffect(() => {
        initializeChannels();
    }, []);

    const [activeChannel, setActiveChannel] = useState(null);

    const changeChannel = (channel) => {
        setCurrentChannel(channel);
        setActiveChannel(channel.id);
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
        let _channels = [];
        channelsRef.on('child_added', (snap) => {
            _channels.push(snap.val());
        });
        setChannelsFromFirebase(_channels);
        //setLoadedChannels({ loadedChannels: _loadedChannels });
        //console.log(loadedChannels);
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
            <Menu.Menu style={{ paddingBottom: '2em' }}>
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
    setCurrentChannel
})(Channels);
