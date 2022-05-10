import React, { Component } from 'react';
import { connect } from 'react-redux';
import ChecklistTab from './ChecklistTab';

class AddClauseTabContainer extends Component {
  render() {
    return (
      <ChecklistTab {...this.props} />
    );
  }
}

const mapStateToProps = (state) => ({
  app_user_id: state.app.appContext.app_user_id,
  last_checklist_saved: state.app.appContext.last_checklist_saved,
});

const mapDispatchToProps = (dispatch) => ({
  setSidebarTab: (sidebarTab) => dispatch.app.setSidebarTab({ sidebarTab }),
  addNotification: (type) => dispatch.notification.addNotification({ type }),
  // eslint-disable-next-line camelcase
  setChecklistSavedDate: (last_checklist_saved) => dispatch.app.setChecklistSavedDate({ last_checklist_saved }),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddClauseTabContainer);
