import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Segment, Comment } from 'semantic-ui-react';
import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import Message from './Message';
import '../../assets/messages.css';
import firebase from '../../firebase';

const Messages = ({ currentChannel, user, isPrivateChannel }) => {
    const [_messagesRef, setMessagesRef] = useState(
        firebase.database().ref('messages')
    );

    // const [_messages, setMessages] = useState({
    //     messages: [],
    //     messagesLoading: true
    // });
    const [_messages, setMessages] = useState([]);
    const [_messagesLoading, setMessagesLoading] = useState(true);
    const [_numUniqueUsers, setNumUniqueUsers] = useState('');

    const [_searchTerm, setSearchTerm] = useState('');
    const [_searchLoading, setSearchLoading] = useState(false);
    const [_searchResults, setSearchResults] = useState([]);
    const [_triggerSearch, setTriggerSearch] = useState(null);

    const [_privateMessagesRef, setPrivateMessagesRef] = useState(
        firebase.database().ref('privateMessages')
    );

    useEffect(() => {
        if (currentChannel) addListeners(currentChannel.id);
    }, []);

    const addListeners = (channelId) => {
        addMessageListener(channelId);
    };

    //add message to loaded messages prop once created
    const addMessageListener = (channelId) => {
        let loadedMessages = [];

        const ref = getMessagesRef();

        console.log('loading messages...');
        ref.child(channelId).on('child_added', (snap) => {
            loadedMessages.push(snap.val());
            setMessages([...loadedMessages]);
            setMessagesLoading(false);
            // setMessages({
            //     messages: loadedMessages,
            //     messagesLoading: false
            // });
            countUniqueUsers(loadedMessages);
        });
    };

    const countUniqueUsers = (messages) => {
        const uniqueUsers = messages.reduce((acc, message) => {
            if (!acc.includes(message.user.name)) {
                acc.push(message.user.name);
            }
            return acc;
        }, []);
        const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0;
        setNumUniqueUsers(`${uniqueUsers.length} user${plural ? 's' : ''}`);
    };

    // displaying private and public channels differently
    const displayChannelName = (channel) => {
        return channel ? `${isPrivateChannel ? '@' : '#'}${channel.name}` : '';
    };

    const onSearchChange = (e) => {
        e.preventDefault();
        setSearchTerm(e.target.value);
        setSearchLoading(true);

        // this is so we can trigger the useEffect method as a promise to the onSearchChange method
        if (_triggerSearch === 'triggering') {
            setTriggerSearch('triggering again');
        } else {
            setTriggerSearch('triggering');
        }
    };

    useEffect(() => {
        if (_triggerSearch) {
            console.log('triggered the search');
            searchMessages();
        }
    }, [_triggerSearch]);

    const searchMessages = () => {
        const channelMessages = [..._messages];
        const regex = new RegExp(_searchTerm, 'gi');
        console.log(`searching term ${_searchTerm}`);
        console.log(channelMessages);
        const searchResults = channelMessages.reduce((acc, message) => {
            if (
                (message.value && message.value.match(regex)) ||
                (message.user && message.user.name.match(regex))
            ) {
                acc.push(message);
            }
            return acc;
        }, []);
        setSearchResults(searchResults);
        setTimeout(() => setSearchLoading(false), 150);
    };

    const getMessagesRef = () => {
        return isPrivateChannel ? _privateMessagesRef : _messagesRef;
    };

    const displayMessages = (messages) => {
        if (messages.length > 0) {
            return messages.map((msg) => (
                <Message key={msg.timestamp} message={msg} user={user} />
            ));
        }
    };

    return (
        <Fragment>
            <MessagesHeader
                channelName={displayChannelName(currentChannel)}
                numUniqueUsers={_numUniqueUsers}
                onSearchChange={onSearchChange}
                searchLoading={_searchLoading}
                isPrivateChannel={isPrivateChannel}
            />

            <Segment>
                <Comment.Group className='messages'>
                    {/* Messages */}
                    {_searchTerm
                        ? displayMessages(_searchResults)
                        : displayMessages(_messages)}
                </Comment.Group>
            </Segment>

            <MessageForm
                messagesRef={_messagesRef}
                channel={currentChannel}
                user={user}
                isPrivateChannel={isPrivateChannel}
                getMessagesRef={getMessagesRef}
            />
        </Fragment>
    );
};

export default Messages;

//display list of messages
// const displayMessages =
//     _messages.messages.length > 0 &&
//     _messages.messages.map((msg) => (
//         <Message key={msg.timestamp} message={msg} user={user} />
//     ));
