import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import { isFormEmpty, isPasswordValid } from './Validations';
import PropTypes from 'prop-types';
import {
    Grid,
    Form,
    Segment,
    Button,
    Header,
    Message,
    Icon
} from 'semantic-ui-react';

const Register = ({ setAlert, register, isAuthenticated, loading }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: ''
    });

    const { username, email, password, password2 } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!isFormValid()) {
            return;
        }
        register(formData);
    };

    const isFormValid = () => {
        if (isFormEmpty(formData)) {
            setAlert('Fill out the entire form', 'danger');
            return false;
        }

        if (!isPasswordValid(password, password2)) {
            setAlert(
                'Password is invalid. Make sure the passwords match and are at least 6 characters',
                'danger'
            );
            return false;
        }
        return true;
    };

    let theme = {
        primaryColor: 'blue',
        secondaryColor: ''
    };

    if (isAuthenticated) {
        return <Navigate to='/dashboard' />;
    }

    return (
        <Grid textAlign='center' verticalAlign='middle' className='app'>
            <Grid.Column style={{ maxWidth: 450 }}>
                <Header
                    as='h1'
                    icon
                    color={theme.primaryColor}
                    textAlign='center'
                >
                    <Icon name='puzzle piece' color={theme.primaryColor} />
                    Register for DevChat
                </Header>
                <Form size='large' onSubmit={onSubmit}>
                    <Segment stacked>
                        <Form.Input
                            fluid
                            name='username'
                            value={username}
                            icon='user'
                            iconPosition='left'
                            placeholder='Username'
                            onChange={onChange}
                            type='text'
                        />
                        <Form.Input
                            fluid
                            name='email'
                            value={email}
                            icon='mail'
                            iconPosition='left'
                            placeholder='Email Address'
                            onChange={onChange}
                            type='email'
                        />
                        <Form.Input
                            fluid
                            name='password'
                            value={password}
                            icon='lock'
                            iconPosition='left'
                            placeholder='Password'
                            onChange={onChange}
                            type='password'
                        />
                        <Form.Input
                            fluid
                            name='password2'
                            value={password2}
                            icon='repeat'
                            iconPosition='left'
                            placeholder='Confirm Password'
                            onChange={onChange}
                            type='password'
                        />

                        <Button
                            disabled={loading}
                            className={loading ? 'loading' : ''}
                            color={theme.primaryColor}
                            fluid
                            size='large'
                        >
                            Sign Up
                        </Button>
                    </Segment>
                </Form>
                <Message>
                    Already a user? <Link to='/login'>Login</Link>{' '}
                </Message>
            </Grid.Column>
        </Grid>
    );
};

Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
    loading: PropTypes.bool
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { setAlert, register })(Register);
