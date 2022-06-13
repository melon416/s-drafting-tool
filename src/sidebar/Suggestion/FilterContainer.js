/**
 *  FilterContainer is a wrapper for Filter component
 */

/**
 * Change-Log:
 * - 6/5/2022, Attia, update component to fetch tags by type
 * - 6/12/2022, Attia, move reset tags to suggestionTabContainer
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import Filter from './Filter';
import {getTagsForType} from '../../models/tag';
import {
    TAG_TYPE_JURISDICTION,
    TAG_TYPE_PRACTICE_GROUP,
    TAG_TYPE_SECTOR,
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
    practiceGroupsOptions: state.tag.practiceGroupsOptions,
    jurisdictionOptions: state.tag.jurisdictionOptions,
    sectorOptions: state.tag.sectorOptions,
    partiesOptions: state.tag.partiesOptions,
    clauseTypesOptions: state.tag.clauseTypesOptions,
    documentTypesOptions: state.tag.documentTypesOptions,
    clientsOptions: state.tag.clientsOptions,
    matterNumbersOptions: state.tag.matterNumbersOptions,
    authorsOptions: state.tag.authorsOptions,
    otherOptions: state.tag.otherOptions,
    currentBubbleCode: state.app.currentBubbleCode,
    visitedTeachingBubbles: state.app.visitedTeachingBubbles,
});

const mapDispatchToProps = (dispatch) => ({
    setSuggestionFilter: (filter) => dispatch.suggestion.setSuggestionFilter({filter}),
    searchFilter: () => dispatch.suggestion.searchFilter({}),
    showNextTeachingBubble: () => dispatch.app.showNextTeachingBubble(),
    addBubbleCodeToVisited: (bubbleCode) => dispatch.app.addBubbleCodeToVisited(bubbleCode),
    setSidebarTab: (sidebarTab) => dispatch.app.setSidebarTab({sidebarTab}),
    getTagsWithType: (tagType, input) => dispatch.tag.getTagsWithType({tagType, input, withNegations: true}),
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterContainer);
