import React, { Component } from 'react';
import { connect } from 'react-redux';
import TaskpaneApp from './TaskpaneApp';

class TaskpaneAppContainer extends Component {
  render() {
    return (
      <TaskpaneApp {...this.props} />
    );
  }
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.app.appContext.isLoggedIn,
});

const mapDispatchToProps = (dispatch) => ({
  requestAppContext: () => dispatch.app.requestAppContext(),
  setSuggestionSearchText: (searchText) => dispatch.suggestion.setSuggestionSearchText({ searchText }),
  setSuggestionSearchExtraText: (searchExtraText) => dispatch.suggestion.setSuggestionSearchExtraText({ searchExtraText }),
  clearSuggestions: () => dispatch.suggestion.clear(),
  setSidebarTab: (sidebarTab) => dispatch.app.setSidebarTab({ sidebarTab }),
  setAddClauseText: (text) => dispatch.clause.setAddClauseText({ text }),
  // eslint-disable-next-line camelcase
  getDocumentFile: (doc_id) => dispatch.document.getDocumentFile({ doc_id }),
});

export default connect(mapStateToProps, mapDispatchToProps)(TaskpaneAppContainer);
