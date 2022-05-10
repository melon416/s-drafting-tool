import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from './Header/Header';

class HeaderContainer extends Component {
  render() {
    return (
      <Header {...this.props} />
    );
  }
}

const mapStateToProps = (state) => ({
  usersname: state.app.appContext.usersname,
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch.app.logout(),
});

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer);
