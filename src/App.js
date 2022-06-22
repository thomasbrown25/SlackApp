import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
import Dashboard from './components/slack-dashboard/Dashboard';
import MyAccount from './components/dashboard/MyAccount';
import ProfileForm from './components/profile-forms/ProfileForm';
import AddExperience from './components/profile-forms/AddExperience';
import AddEducation from './components/profile-forms/AddEducation';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import Posts from './components/posts/Posts';
import Post from './components/post/Post';
import NotFound from './components/layout/NotFound';
import PrivateRoute from './components/routing/PrivateRoute';
import { LOGOUT, USER_LOADED } from './actions/types';

// Redux
import { Provider } from 'react-redux';
import store from './store';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import './assets/App.css';
import 'semantic-ui-css/semantic.min.css';

const App = () => {
    useEffect(() => {
        // Firebase Auth listener
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in
                store.dispatch({
                    type: USER_LOADED,
                    payload: user
                });
            } else {
                // User is signed out
                store.dispatch({ type: LOGOUT });
            }
        });
    }, []);

    return (
        <Provider store={store}>
            <Router>
                <Alert />
                <Routes>
                    <Route path='/' element={<Landing />} />
                    <Route path='register' element={<Register />} />
                    <Route path='login' element={<Login />} />
                    <Route path='profiles' element={<Profiles />} />
                    <Route path='profile/:id' element={<Profile />} />
                    <Route
                        path='dashboard'
                        element={<PrivateRoute component={Dashboard} />}
                    />
                    <Route
                        path='myaccount'
                        element={<PrivateRoute component={MyAccount} />}
                    />
                    <Route
                        path='create-profile'
                        element={<PrivateRoute component={ProfileForm} />}
                    />
                    <Route
                        path='edit-profile'
                        element={<PrivateRoute component={ProfileForm} />}
                    />
                    <Route
                        path='add-experience'
                        element={<PrivateRoute component={AddExperience} />}
                    />
                    <Route
                        path='add-education'
                        element={<PrivateRoute component={AddEducation} />}
                    />
                    <Route
                        path='posts'
                        element={<PrivateRoute component={Posts} />}
                    />
                    <Route
                        path='posts/:id'
                        element={<PrivateRoute component={Post} />}
                    />
                    <Route path='/*' element={<NotFound />} />
                </Routes>
            </Router>
        </Provider>
    );
};

export default App;
