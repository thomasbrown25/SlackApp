import React from 'react';
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

const SideNavbar = ({ auth: { isAuthenticated }, logout }) => {
  const authLinks = (
    <ul>
      <li>
        <Link to="/dashboard">
          <span className="hide-sm">Dashboard</span>
        </Link>
      </li>
      <li>
        <Link to="/myaccount">
          <i className="fas fa-user" />{' '}
          <span className="hide-sm">My Account</span>
        </Link>
      </li>
      <li>
        <a onClick={logout} href="#!">
          <i className="fas fa-sign-out-alt" />{' '}
          <span className="hide-sm">Logout</span>
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        <Link to="/profiles">Developers</Link>
      </li>
      <li>
        <Link to="/register">Register</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
    </ul>
  );

  const SideBar = (
    <ProSidebar>
      <a href ="https://placeholder.com/"><img src="https://via.placeholder.com/150x50"/></a>
            Financing App
    <Menu iconShape="square">
    <MenuItem icon={<FontAwesomeIcon icon="check-square" />}>Dashboard <Link to="/dashboard"/></MenuItem>
    <MenuItem icon={<FontAwesomeIcon icon="check-square" />}>Recurring <Link to="/"/></MenuItem>
    <MenuItem icon={<FontAwesomeIcon icon="check-square" />}>Spending <Link to="/"/></MenuItem>
    <MenuItem icon={<FontAwesomeIcon icon="check-square" />}>Net Worth <Link to="/"/></MenuItem>
    <MenuItem icon={<FontAwesomeIcon icon="check-square" />}>Transactions <Link to="/"/></MenuItem>
    </Menu>
  </ProSidebar>
  );

  return (
   SideBar
  );
};

SideNavbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logout })(SideNavbar);
