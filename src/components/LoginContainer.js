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

const mapStateToProps = (state) => ({
  isAzureLoginEnabled: state.app.isAzureLoginEnabled
});

const mapDispatchToProps = (dispatch) => ({
  login: dispatch.app.login,
  getAzureLoginUrl: dispatch.app.getAzureLoginUrl,
  loginWithAzure:dispatch.app.loginWithAzure,
  checkAzureLoginEnabled: dispatch.app.checkAzureLoginEnabled
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
