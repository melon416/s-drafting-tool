import React, { Component } from 'react';
import { connect } from 'react-redux';
import LoadTab from './LoadTab';

class LoadTabContainer extends Component {
  render() {
    return (
      <LoadTab {...this.props} />
    );
  }
}

const mapStateToProps = (state) => ({
  recentSearches: state.document.recentSearches,
  documents: state.document.documents,
  isLoading: state.document.isLoading,
  wasLoaded: state.document.wasLoaded,
  workspaces: state.workspace.activeWorkspaces,
  workspaceId: state.app.appContext.workspace_id,
});

const mapDispatchToProps = (dispatch) => ({
  searchDocuments: (filter) => dispatch.document.searchDocuments({ filter }),
  switchWorkspace: (workspaceId) => dispatch.app.switchWorkspace(workspaceId),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoadTabContainer);
