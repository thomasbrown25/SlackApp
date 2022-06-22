import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';
import {
    Grid,
    Form,
    Segment,
    Button,
    Header,
    Message,
    Icon
} from 'semantic-ui-react';

const Login = ({ login, isAuthenticated, loading }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { email, password } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = (e) => {
        e.preventDefault();
        login(formData);
    };

    // const isFormValid = () => {
    //   if (isFormEmpty(formData)) {
    //     setAlert('Fill out the entire form', 'danger');
    //     return false
    //   }

    //   if (!isPasswordValid(password, password2)) {
    //     setAlert('Password is invalid. Make sure the passwords match and are at least 6 characters', 'danger');
    //     return false
    //   }
    //   return true
    // }

    let theme = {
        primaryColor: 'violet',
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
                    <Icon name='code branch' color={theme.primaryColor} />
                    Login to DevChat
                </Header>
                <Form size='large' onSubmit={onSubmit}>
                    <Segment stacked>
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

                        <Button
                            disabled={loading}
                            className={loading ? 'loading' : ''}
                            color={theme.primaryColor}
                            fluid
                            size='large'
                        >
                            Sign In
                        </Button>
                    </Segment>
                </Form>
                <Message>
                    Don't have an account?{' '}
                    <Link to='/register'>Create Account</Link>{' '}
                </Message>
            </Grid.Column>
        </Grid>
    );
};

Login.propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { login })(Login);
