import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Menu } from 'semantic-ui-react';
import UserPanel from './UserPanel';
import Channels from './Channels';

const SidePanel = ({ user }) => {
    return (
        <Menu
            size='large'
            inverted
            fixed='left'
            vertical
            style={{ background: '#4c3c4c', fontSize: '1.2rem' }}
        >
            <UserPanel user={user} />
            <Channels user={user} />
        </Menu>
    );
};

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default connect(mapStateToProps, {})(SidePanel);
