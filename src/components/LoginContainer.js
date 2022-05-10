import React, { Component } from 'react';
import { connect } from 'react-redux';
import Login from './Login';

class LoginContainer extends Component {
  render() {
    return (
      <Login {...this.props} />
    );
  }
}

const mapStateToProps = () => ({
});

const mapDispatchToProps = (dispatch) => ({
  login: ({ username, password, token }) => dispatch.app.login({ username, password, token }),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
