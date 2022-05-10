import React, { Component } from 'react';
import { connect } from 'react-redux';
import Sidebar from './Sidebar';

class SidebarContainer extends Component {
  componentDidMount() {
    const { requestTags } = this.props;
    requestTags();
  }

  render() {
    return (
      <Sidebar {...this.props} />
    );
  }
}

const mapStateToProps = (state) => ({
  sidebarTab: state.app.sidebarTab,
});

const mapDispatchToProps = (dispatch) => ({
  setSidebarTab: (sidebarTab) => dispatch.app.setSidebarTab({ sidebarTab }),
  requestTags: () => dispatch.tag.requestTags(),
  logout: () => dispatch.app.logout(),
});

export default connect(mapStateToProps, mapDispatchToProps)(SidebarContainer);
