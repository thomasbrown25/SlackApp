import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dropdown, Grid, Header, Icon, Image } from 'semantic-ui-react';
import { logout } from '../../actions/auth';

const UserPanel = ({ user, logout }) => {
    const dropdownOptions = () => [
        {
            key: 'user',
            text: (
                <span>
                    Signed in as <strong>{user.displayName}</strong>
                </span>
            ),
            disabled: true
        },
        {
            key: 'avatar',
            text: <span>Change Avatar</span>
        },
        {
            key: 'signout',
            text: <span onClick={logout}>Sign Out</span>
        }
    ];
    console.log(user);
    return (
        <Grid style={{ background: '#4c3c4c' }}>
            <Grid.Column>
                <Grid.Row style={{ padding: '1.2em', margin: 0 }}>
                    {/* App Header */}
                    <Header inverted floated='left' as='h2'>
                        <Icon name='code' />
                        <Header.Content>DevChat</Header.Content>
                    </Header>

                    {/* User Dropdown */}
                    <Header style={{ padding: '0.25em' }} as='h4' inverted>
                        <Dropdown
                            trigger={
                                <span>
                                    <Image
                                        src={user.photoURL}
                                        spaced='right'
                                        avatar
                                    />
                                    {user.displayName}
                                </span>
                            }
                            options={dropdownOptions()}
                        />
                    </Header>
                </Grid.Row>
            </Grid.Column>
        </Grid>
    );
};

UserPanel.propTypes = {
    logout: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { logout })(UserPanel);
