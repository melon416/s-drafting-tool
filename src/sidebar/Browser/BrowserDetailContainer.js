/* eslint-disable camelcase */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import BrowserDetail from './BrowserDetail';

class BrowserDetailContainer extends Component {
  componentDidMount() {
    const { getUsers } = this.props;
    getUsers();
  }

  render() {
    return (
      <BrowserDetail {...this.props} />
    );
  }
}

const mapStateToProps = (state) => ({
  selectedSuggestion: state.clause.selectedSuggestion,
  comments: state.clause.comments,
  isCommentLoading: state.clause.isCommentLoading,
  users: state.user.users,
  bookmarks: state.bookmarks.bookmarks,
  workspaceId: state.app.appContext.workspace_id,
});

const mapDispatchToProps = (dispatch) => ({
  addActivity: (activity_type, activity_data, owner_id) => dispatch.activity.addActivity({ activity_type, activity_data, owner_id }),
  setSidebarTab: (sidebarTab) => dispatch.app.setSidebarTab({ sidebarTab }),
  saveComment: (values) => dispatch.clause.saveComment(values),
  getUsers: () => dispatch.user.loadInitialData(),
  getNextClause: (clause_id) => dispatch.clause.getNextClause({ clause_id }),
  saveBookmark: (values) => dispatch.bookmarks.saveBookmark(values),
  deleteBookmark: (values) => dispatch.bookmarks.deleteBookmark(values),
});

export default connect(mapStateToProps, mapDispatchToProps)(BrowserDetailContainer);
