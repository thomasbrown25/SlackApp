import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';

//Components
import ColorPanel from '../color-panel/ColorPanel';
import SidePanel from '../side-panel/SidePanel';
import Messages from '../messages/Messages';
import MetaPanel from '../meta-panel/MetaPanel';

//Actions

const Dashboard = ({
    auth: { user },
    profile: { profile },
    currentChannel,
    isPrivateChannel
}) => {
    return (
        <Grid columns='equal' className='app' style={{ background: '#eee' }}>
            <ColorPanel />
            <SidePanel key={user && user.id} user={user} />

            <Grid.Column style={{ marginLeft: 320 }}>
                <Messages
                    key={currentChannel && currentChannel.id}
                    currentChannel={currentChannel}
                    user={user}
                    isPrivateChannel={isPrivateChannel}
                />
            </Grid.Column>

            <Grid.Column width={4}>
                <MetaPanel />
            </Grid.Column>
        </Grid>
    );
};

Dashboard.propTypes = {
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    profile: state.profile,
    currentChannel: state.channel.currentChannel,
    isPrivateChannel: state.channel.isPrivateChannel
});

export default connect(mapStateToProps, {})(Dashboard);
