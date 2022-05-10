import React, { Component } from 'react';
import { connect } from 'react-redux';
import AuthenticatedApp from './AuthenticatedApp';

class AuthenticatedAppContainer extends Component {
  render() {
    return (
      <AuthenticatedApp {...this.props} />
    );
  }
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.app.appContext.isLoggedIn,
  can_access_cb: state.app.appContext.can_access_cb,
  can_access_dt: state.app.appContext.can_access_dt,
});

const mapDispatchToProps = (dispatch) => ({
  requestAppContext: () => dispatch.app.requestAppContext(),
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthenticatedAppContainer);
