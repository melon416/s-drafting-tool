/* eslint-disable camelcase */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import BrowserResult from './BrowserResult';
import { getTagOptionsForType } from '../../models/tag';
import { TAG_TYPE_CLAUSE_TYPE } from '../../consts';

class BrowserResultContainer extends Component {
  render() {
    return (
      <BrowserResult {...this.props} />
    );
  }
}

const mapStateToProps = (state) => ({
  filter: state.clause.filter,
  goodSuggestions: state.clause.goodSuggestions,
  badSuggestions: state.clause.badSuggestions,
  suggestions: state.clause.suggestions,
  suggestionMoreAvailable: state.clause.moreAvailable,
  suggestionIsLoading: state.clause.isLoading,
  suggestionSearchText: state.clause.searchText,
  unusualPhrases: state.clause.unusualPhrases,
  suggestionHasFilter: !!Object.keys(_.omitBy(state.clause.filter, _.isEmpty)).length,
  clauseTypesOptions: getTagOptionsForType(state.tag.tags, TAG_TYPE_CLAUSE_TYPE),
  currentBubbleCode: state.app.currentBubbleCode,
  visitedTeachingBubbles: state.app.visitedTeachingBubbles,
  bookmarks: state.bookmarks.bookmarks,
});

const mapDispatchToProps = (dispatch) => ({
  addActivity: (activity_type, activity_data, owner_id) => dispatch.activity.addActivity({ activity_type, activity_data, owner_id }),
  searchRefine: () => dispatch.clause.searchRefine({}),
  clear: () => dispatch.clause.clear({}),
  markGoodSuggestion: (id) => dispatch.clause.markGoodSuggestion({ id }),
  markBadSuggestion: (id) => dispatch.clause.markBadSuggestion({ id }),
  setSidebarTab: (sidebarTab) => dispatch.app.setSidebarTab({ sidebarTab }),
  setUnusualPhrases: (args) => dispatch.clause.setUnusualPhrases({ ...args }),
  updateUnusualPhrases: (highlight, clauseTypeID) => dispatch.clause.updateUnusualPhrases({ highlight, clauseTypeID }),
  showNextTeachingBubble: () => dispatch.app.showNextTeachingBubble(),
  showPrevTeachingBubble: () => dispatch.app.showPrevTeachingBubble(),
  addBubbleCodeToVisited: (bubbleCode) => dispatch.app.addBubbleCodeToVisited(bubbleCode),
  setSelectedSuggestion: (suggestion) => dispatch.clause.setSelectedSuggestion({ suggestion }),
});

export default connect(mapStateToProps, mapDispatchToProps)(BrowserResultContainer);
