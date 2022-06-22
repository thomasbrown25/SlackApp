import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Menu } from 'semantic-ui-react';

const ChannelList = ({ channels }) => {
    const changeChannel = (channel) => {
        //set current channel (channel)
    };
    const displayChannels = channels.map((channel) => (
        <Menu.Item
            key={channel.id}
            onClick={() => changeChannel(channel)}
            name={channel.name}
            style={{ opacity: 0.7 }}
        >
            # {channel.name}
        </Menu.Item>
    ));

    return displayChannels;
};

ChannelList.propTypes = {
    channels: PropTypes.array.isRequired
};

export default connect(null)(ChannelList);

// if (displayChannels) {
//     return displayChannels;
// } else {
//     return <Fragment />;
// }
