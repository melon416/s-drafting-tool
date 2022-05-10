import React, { Component } from 'react';
import { connect } from 'react-redux';
import BrowserTab from './BrowserTab';

class BrowserTabContainer extends Component {
    render() {
        return (
            <BrowserTab {...this.props} />
        );
    }
}

const mapStateToProps = (state) => ({
    recentSearches: state.document.recentSearches,
    documents: state.document.documents,
    clauses: state.clause.clauses,
    filter: state.clause.filter,
    titleFilter: state.clause.titleFilter,
    bookmarks: state.bookmarks.bookmarks,
    isLoading: state.clause.isLoading,
    wasLoaded: state.clause.wasLoaded,
    workspaces: state.workspace.activeWorkspaces,
    workspaceId: state.app.appContext.workspace_id,
  });

const mapDispatchToProps = (dispatch) => ({
    fetchBookmarks: () => dispatch.bookmarks.fetchUserBookmarks(),
    searchDocuments: (filter) => dispatch.document.searchDocuments({ filter }),
    searchClauses: (filter) => dispatch.clause.searchClauses({ filter }),
    handleLoadClause: (clauses) => dispatch.clause.handleLoadClause(clauses),
    switchWorkspace: (workspaceId) => dispatch.app.switchWorkspace(workspaceId),
    saveClauses: (clauses) => dispatch.clause.saveClauses( clauses ),
    setClauseFilter: (filter) => dispatch.clause.setClauseFilter({ filter }),
    setTitleFilter: (titleFilter) => dispatch.clause.setTitleFilter({ titleFilter })
});

export default connect(mapStateToProps, mapDispatchToProps)(BrowserTabContainer);