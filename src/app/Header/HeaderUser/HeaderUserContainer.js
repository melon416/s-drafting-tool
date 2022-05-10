import React, { Component } from 'react';
import { connect } from 'react-redux';
import HeaderUser from './HeaderUser';

class HeaderUserContainer extends Component {
  render() {
    return (
      <HeaderUser {...this.props} />
    );
  }
}

const mapStateToProps = (state) => ({
  usersname: state.app.appContext.usersname,
  users_picture: state.app.appContext.picture,
  rightPanelVisible: state.app.rightPanelVisible,
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch.app.logout(),
  setRightPanelVisible: dispatch.app.setRightPanelVisible,
  setCurrentBubbleCode: (code) => dispatch.app.setCurrentBubbleCode(code),
});

export default connect(mapStateToProps, mapDispatchToProps)(HeaderUserContainer);
