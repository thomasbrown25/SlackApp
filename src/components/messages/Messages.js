import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Segment, Comment } from 'semantic-ui-react';
import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import Message from './Message';
import '../../assets/Messages.css';
import firebase from '../../firebase';

const Messages = ({ currentChannel, user }) => {
    const [_messagesRef, setMessagesRef] = useState(
        firebase.database().ref('messages')
    );

    const [_messages, setMessages] = useState({
        messages: [],
        messagesLoading: true
    });

    useEffect(() => {
        if (currentChannel && user) {
            addListeners(currentChannel.id);
        }
    }, []);

    const addListeners = (channelId) => {
        addMessageListener(channelId);
    };

    //add message to loaded messages prop once created
    const addMessageListener = (channelId) => {
        let loadedMessages = [];
        _messagesRef.child(channelId).on('child_added', (snap) => {
            loadedMessages.push(snap.val());
            setMessages({ messages: loadedMessages, messagesLoading: false });
        });
        console.log('loading messages...');
    };

    //display list of messages
    const displayMessages =
        _messages.messages.length > 0 &&
        _messages.messages.map((msg) => (
            <Message key={msg.timestamp} message={msg} user={user} />
        ));

    return (
        <Fragment>
            <MessagesHeader />

            <Segment>
                <Comment.Group className='messages'>
                    {/* Messages */}
                    {displayMessages}
                </Comment.Group>
            </Segment>

            <MessageForm
                messagesRef={_messagesRef}
                channel={currentChannel}
                user={user}
            />
        </Fragment>
    );
};

// Messages.propTypes = {
//     currentChannel: PropTypes.object
// };

export default Messages;
