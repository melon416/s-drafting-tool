  /**
   *  SuggestionResultContainer.js
   *  Author:
   *  Created:
   */
  
  /**
   * Change-Log:
   * - 2022-05-24, Wang,  Add fetchBookmarks
   * - 2022-06-05, Attia, remove unused tags code
   */

/* eslint-disable camelcase */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import SuggestionResult from './SuggestionResult';

class SuggestionResultContainer extends Component {
  render() {
    return (
      <SuggestionResult {...this.props} />
    );
  }
}

const mapStateToProps = (state) => ({
    filter: state.suggestion.filter,
    goodSuggestions: state.suggestion.goodSuggestions,
    badSuggestions: state.suggestion.badSuggestions,
    suggestions: state.suggestion.suggestions,
    suggestionMoreAvailable: state.suggestion.moreAvailable,
    suggestionIsLoading: state.suggestion.isLoading,
    suggestionSearchText: state.suggestion.searchText,
    suggestionSearchExtraText: state.suggestion.searchExtraText,
    unusualPhrases: state.suggestion.unusualPhrases,
    suggestionHasFilter: !!Object.keys(_.omitBy(state.suggestion.filter, _.isEmpty)).length,
    currentBubbleCode: state.app.currentBubbleCode,
    visitedTeachingBubbles: state.app.visitedTeachingBubbles,
    bookmarks: state.bookmarks.bookmarks,
    showWraningForDisableNLP: state.suggestion.showWraningForDisableNLP,
});

const mapDispatchToProps = (dispatch) => ({
  addActivity: (activity_type, activity_data, owner_id) => dispatch.activity.addActivity({ activity_type, activity_data, owner_id }),
  searchRefine: () => dispatch.suggestion.searchRefine({}),
  clear: () => dispatch.suggestion.clear({}),
  markGoodSuggestion: (id) => dispatch.suggestion.markGoodSuggestion({ id }),
  markBadSuggestion: (id) => dispatch.suggestion.markBadSuggestion({ id }),
  setSidebarTab: (sidebarTab) => dispatch.app.setSidebarTab({ sidebarTab }),
  setUnusualPhrases: (args) => dispatch.suggestion.setUnusualPhrases({ ...args }),
  updateUnusualPhrases: (highlight, clauseTypeID) => dispatch.suggestion.updateUnusualPhrases({ highlight, clauseTypeID }),
  showNextTeachingBubble: () => dispatch.app.showNextTeachingBubble(),
  showPrevTeachingBubble: () => dispatch.app.showPrevTeachingBubble(),
  addBubbleCodeToVisited: (bubbleCode) => dispatch.app.addBubbleCodeToVisited(bubbleCode),
  setSelectedSuggestion: (suggestion) => dispatch.suggestion.setSelectedSuggestion({ suggestion }),
  fetchBookmarks: () => dispatch.bookmarks.fetchUserBookmarks(),
});

export default connect(mapStateToProps, mapDispatchToProps)(SuggestionResultContainer);
