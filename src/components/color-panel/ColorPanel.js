import React from 'react';
import { Menu, Sidebar, Divider, Button } from 'semantic-ui-react';

const ColorPanel = ({ auth }) => {
    return (
        <Sidebar
            as={Menu}
            icon='labeled'
            inverted
            vertical
            visible
            width='very thin'
        >
            <Divider />
            <Button icon='add' size='small' color='blue' />
        </Sidebar>
    );
};
const mapStateToProps = (state) => ({});

export default ColorPanel;
