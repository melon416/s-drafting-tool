import React, { Component } from 'react';
import { connect } from 'react-redux';
import Filter from './Filter';
import { getOptionsWithNegations, getTagOptionsForType, getTagsForType } from '../../models/tag';
import {
  TAG_TYPE_AUTHOR,
  TAG_TYPE_CLAUSE_TYPE, TAG_TYPE_CLIENT, TAG_TYPE_DOCUMENT_TYPE,
  TAG_TYPE_JURISDICTION,
  TAG_TYPE_PARTY,
  TAG_TYPE_PRACTICE_GROUP,
  TAG_TYPE_SECTOR,
  TAG_TYPE_OTHER,
  TAG_TYPE_MATTER_NUMBER,
} from '../../consts';

class FilterContainer extends Component {
  render() {
    return (
      <Filter {...this.props} />
    );
  }
}

const mapStateToProps = (state) => ({
  initialFilter: state.suggestion.filter,
  practiceGroupTags: getTagsForType(state.tag.tags, TAG_TYPE_PRACTICE_GROUP),
  jurisdictionTags: getTagsForType(state.tag.tags, TAG_TYPE_JURISDICTION),
  sectorTags: getTagsForType(state.tag.tags, TAG_TYPE_SECTOR),
  practiceGroupsOptions: getOptionsWithNegations(getTagOptionsForType(state.tag.tags, TAG_TYPE_PRACTICE_GROUP)),
  jurisdictionOptions: getOptionsWithNegations(getTagOptionsForType(state.tag.tags, TAG_TYPE_JURISDICTION)),
  sectorOptions: getOptionsWithNegations(getTagOptionsForType(state.tag.tags, TAG_TYPE_SECTOR)),
  partiesOptions: getOptionsWithNegations(getTagOptionsForType(state.tag.tags, TAG_TYPE_PARTY)),
  clauseTypesOptions: getOptionsWithNegations(getTagOptionsForType(state.tag.tags, TAG_TYPE_CLAUSE_TYPE)),
  documentTypesOptions: getOptionsWithNegations(getTagOptionsForType(state.tag.tags, TAG_TYPE_DOCUMENT_TYPE)),
  clientsOptions: getOptionsWithNegations(getTagOptionsForType(state.tag.tags, TAG_TYPE_CLIENT)),
  matterNumbersOptions: getOptionsWithNegations(getTagOptionsForType(state.tag.tags, TAG_TYPE_MATTER_NUMBER)),
  authorsOptions: getOptionsWithNegations(getTagOptionsForType(state.tag.tags, TAG_TYPE_AUTHOR)),
  otherOptions: getTagOptionsForType(state.tag.tags, TAG_TYPE_OTHER),
  currentBubbleCode: state.app.currentBubbleCode,
  visitedTeachingBubbles: state.app.visitedTeachingBubbles,
});

const mapDispatchToProps = (dispatch) => ({
  setSuggestionFilter: (filter) => dispatch.suggestion.setSuggestionFilter({ filter }),
  searchFilter: () => dispatch.suggestion.searchFilter({}),
  showNextTeachingBubble: () => dispatch.app.showNextTeachingBubble(),
  addBubbleCodeToVisited: (bubbleCode) => dispatch.app.addBubbleCodeToVisited(bubbleCode),
  setSidebarTab: (sidebarTab) => dispatch.app.setSidebarTab({ sidebarTab }),
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterContainer);
