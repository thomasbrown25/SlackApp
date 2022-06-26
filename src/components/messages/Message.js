import React from 'react';
import { Comment, Image } from 'semantic-ui-react';
import moment from 'moment';
import '../../assets/messages.css';

const Message = ({ message, user }) => {
    //check to see if user is the one who wrote the comment/message for visual effects
    const isOwnMessage = (message, user) => {
        return message.user.id === user.uid ? 'message__self' : '';
    };

    const isImage = (message) => {
        return (
            message.hasOwnProperty('image') && !message.hasOwnProperty('value')
        );
    };

    const { timestamp, value } = message;

    const timeFromNow = (timestamp) => moment(timestamp).fromNow();

    return (
        <Comment>
            <Comment.Avatar src={message.user.avatar} />
            <Comment.Content className={isOwnMessage(message, user)}>
                <Comment.Author as='a'>{message.user.name}</Comment.Author>
                <Comment.Metadata>{timeFromNow(timestamp)}</Comment.Metadata>

                {isImage(message) ? (
                    <Image src={message.image} className='message__image' />
                ) : (
                    <Comment.Text>{message.value}</Comment.Text>
                )}
            </Comment.Content>
        </Comment>
    );
};

export default Message;
