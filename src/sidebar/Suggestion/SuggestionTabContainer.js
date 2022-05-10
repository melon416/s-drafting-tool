/* eslint-disable camelcase */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import SuggestionTab from './SuggestionTab';

class SuggestionTabContainer extends Component {
  render() {
    return (
      <SuggestionTab {...this.props} />
    );
  }
}

const mapStateToProps = (state) => ({
  suggestionSearchText: state.suggestion.searchText,
  suggestionSearchExtraText: state.suggestion.searchExtraText,
  suggestionIsLoading: state.suggestion.isLoading,
  currentBubbleCode: state.app.currentBubbleCode,
  visitedTeachingBubbles: state.app.visitedTeachingBubbles,
  workspaces: state.workspace.activeWorkspaces,
  workspace_id: state.app.appContext.workspace_id,
});

const mapDispatchToProps = (dispatch) => ({
  search: (document_text) => dispatch.suggestion.search({ document_text }),
  setSuggestionSearchText: (searchText) => dispatch.suggestion.setSuggestionSearchText({ searchText }),
  setSuggestionSearchExtraText: (searchExtraText) => dispatch.suggestion.setSuggestionSearchExtraText({ searchExtraText }),
  updateUnusualPhrases: (highlight, clauseTypeID) => dispatch.suggestion.updateUnusualPhrases({ highlight, clauseTypeID }),
  clear: () => dispatch.suggestion.clear(),
  showNextTeachingBubble: () => dispatch.app.showNextTeachingBubble(),
  showPrevTeachingBubble: () => dispatch.app.showPrevTeachingBubble(),
  addBubbleCodeToVisited: (bubbleCode) => dispatch.app.addBubbleCodeToVisited(bubbleCode),
  switchWorkspace: (workspaceId) => dispatch.app.switchWorkspace(workspaceId),
});

export default connect(mapStateToProps, mapDispatchToProps)(SuggestionTabContainer);
