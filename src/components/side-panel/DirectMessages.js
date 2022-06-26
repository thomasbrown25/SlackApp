import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useResolvedPath } from 'react-router-dom';
import { Menu, Icon } from 'semantic-ui-react';
import { setCurrentChannel, setPrivateChannel } from '../../actions/channels';
import firebase from '../../firebase';

const DirectMessages = ({ user, setCurrentChannel, setPrivateChannel }) => {
    useEffect(() => {
        if (user) {
            addListeners(user.uid);
        }
    }, []);

    const [_users, setUsers] = useState([]);
    const [_usersRef, setUsersRef] = useState(firebase.database().ref('users'));
    const [_connectedRef, setConnectedRef] = useState(
        firebase.database().ref('.info/connected')
    );
    //presenceRef is used to define users online status
    const [_presenceRef, setPresenceRef] = useState(
        firebase.database().ref('presence')
    );

    const [_activeChannel, setActiveChannel] = useState();

    const addListeners = (currentUserUid) => {
        let loadedUsers = [];

        // if not current user, set status to offline
        _usersRef.on('child_added', (snap) => {
            if (currentUserUid !== snap.key) {
                let user = snap.val();
                user['uid'] = snap.key;
                user['status'] = 'offline';
                loadedUsers.push(user);
                setUsers(loadedUsers);
                console.log('offline users...');
                console.log(loadedUsers);
            }
        });

        // if user is connected, set online to true
        _connectedRef.on('value', (snap) => {
            if (snap.val() === true) {
                const ref = _presenceRef.child(currentUserUid);
                ref.set(true);
                ref.onDisconnect().remove((err) => {
                    if (err) console.error(err);
                });
                console.log('connected users...');
                console.log(loadedUsers);
            }
        });

        _presenceRef.on('child_added', (snap) => {
            if (currentUserUid !== snap.key) {
                // give user online status
                addStatusToUser(snap.key);
            }
        });

        _presenceRef.on('child_removed', (snap) => {
            if (currentUserUid !== snap.key) {
                // give user offline status
                addStatusToUser(snap.key, false);
            }
        });
    };

    const addStatusToUser = (userId, connected = true) => {
        const updatedUsers = _users.reduce((acc, user) => {
            if (user.uid === userId) {
                user['status'] = `${connected ? 'online' : 'offline'}`;
            }
            return acc.concat(user);
        }, []);
        setUsers(updatedUsers);
        console.log('setting users');
        console.log(_users);
    };

    const isUserOnline = (user) => user.status === 'online';

    const changeChannel = (user) => {
        const channelId = getChannelId(user.uid);
        const channelData = {
            id: channelId,
            name: user.name
        };
        setCurrentChannel(channelData);
        setPrivateChannel(true);
        setActiveChannel(user.uid);
    };

    const getChannelId = (userId) => {
        const currentUserId = user.uid;
        return userId < currentUserId
            ? `${userId}/${currentUserId}`
            : `${currentUserId}/${userId}`;
    };

    return (
        <Menu.Menu className='menu'>
            <Menu.Item>
                <span>
                    <Icon name='mail' /> DIRECT MESSAGES
                </span>{' '}
                ({_users.length})
            </Menu.Item>
            {/* Users to Send Direct Messages */}
            {_users.map((user) => (
                <Menu.Item
                    key={user.uid}
                    active={user.uid === _activeChannel}
                    onClick={() => changeChannel(user)}
                    style={{ opacity: 0.7, fontStyle: 'italic' }}
                >
                    <Icon
                        name='circle'
                        color={isUserOnline(user) ? 'green' : 'grey'}
                    />
                    @ {user.name}
                </Menu.Item>
            ))}
        </Menu.Menu>
    );
};

export default connect(null, { setCurrentChannel, setPrivateChannel })(
    DirectMessages
);
