 /**
  *  ChecklistTabContainer.js
  *  Author:
  *  Created:
  */
 
 /**
  * Change-Log:
  * - 2022-05-09, Wang, Get users
  */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import ChecklistTab from './ChecklistTab';

class AddClauseTabContainer extends Component {
  componentDidMount() {
    const { getUsers } = this.props;
    getUsers();
  }

  render() {
    return (
      <ChecklistTab {...this.props} />
    );
  }
}

const mapStateToProps = (state) => ({
  app_user_id: state.app.appContext.app_user_id,
  last_checklist_saved: state.app.appContext.last_checklist_saved,
  users: state.user.users,
});

const mapDispatchToProps = (dispatch) => ({
  setSidebarTab: (sidebarTab) => dispatch.app.setSidebarTab({ sidebarTab }),
  addNotification: (type) => dispatch.notification.addNotification({ type }),
  getUsers: () => dispatch.user.loadInitialData(),
  // eslint-disable-next-line camelcase
  setChecklistSavedDate: (last_checklist_saved) => dispatch.app.setChecklistSavedDate({ last_checklist_saved }),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddClauseTabContainer);
