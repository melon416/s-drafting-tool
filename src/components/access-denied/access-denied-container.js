import React, { Component } from 'react';
import { connect } from 'react-redux';
import AccessDenied from './access-denied';

class AccessDeniedContainer extends Component {
  render() {
    return (
      <AccessDenied {...this.props} />
    );
  }
}

const mapStateToProps = () => ({
});

const mapDispatchToProps = (dispatch) => ({
  logout: dispatch.app.logout,
});

export default connect(mapStateToProps, mapDispatchToProps)(AccessDeniedContainer);
