/**
 *  SidebarContainer is a container for Sidebar component
 */

/**
 * Change-Log:
 * - 6/5/2022, Attia, stop fetching all tags on component mount
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Sidebar from './Sidebar';

class SidebarContainer extends Component {

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
  logout: () => dispatch.app.logout(),
});

export default connect(mapStateToProps, mapDispatchToProps)(SidebarContainer);
