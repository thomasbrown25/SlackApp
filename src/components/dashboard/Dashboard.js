import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SideNavbar from '../layout/SideNavbar';
import ErrorBoundary from '../../utils/ErrorBoundary'

//Actions
import { getCurrentProfile, getTransactions } from '../../actions/profile';

const Dashboard = ({
  auth: { user },
  profile: { profile },
}) => {


  return (
    <section className="container">
 
    </section>
  );
};

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(mapStateToProps, { })(
  Dashboard
);
