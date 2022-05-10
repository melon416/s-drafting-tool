/* eslint-disable camelcase */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import SuggestionDetail from './SuggestionDetail';

class SuggestionDetailContainer extends Component {
  componentDidMount() {
    const { getUsers } = this.props;
    getUsers();
  }

  render() {
    return (
      <SuggestionDetail {...this.props} />
    );
  }
}

const mapStateToProps = (state) => ({
  selectedSuggestion: state.suggestion.selectedSuggestion,
  comments: state.suggestion.comments,
  isCommentLoading: state.suggestion.isCommentLoading,
  users: state.user.users,
  bookmarks: state.bookmarks.bookmarks,
  workspaceId: state.app.appContext.workspace_id,
});

const mapDispatchToProps = (dispatch) => ({
  addActivity: (activity_type, activity_data, owner_id) => dispatch.activity.addActivity({ activity_type, activity_data, owner_id }),
  setSidebarTab: (sidebarTab) => dispatch.app.setSidebarTab({ sidebarTab }),
  getCommentsFor: (owner_id) => dispatch.suggestion.getCommentsFor({ owner_id }),
  saveComment: (values) => dispatch.suggestion.saveComment(values),
  getUsers: () => dispatch.user.loadInitialData(),
  getNextClause: (clause_id) => dispatch.suggestion.getNextClause({ clause_id }),
  saveBookmark: (values) => dispatch.bookmarks.saveBookmark(values),
  deleteBookmark: (values) => dispatch.bookmarks.deleteBookmark(values),
});

export default connect(mapStateToProps, mapDispatchToProps)(SuggestionDetailContainer);
