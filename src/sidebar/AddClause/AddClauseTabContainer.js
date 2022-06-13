/**
 *  AddClauseTabContainer is a container for AddClauseTab component
 */

/**
 * Change-Log:
 * - 2022-05-31, Wang, Add username
 * - 2022-06-01, Wang, Add setFavorite
 * - 6/5/2022, Attia, fetch tags type
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import AddClauseTab from './AddClauseTab';


class AddClauseTabContainer extends Component {
    componentDidMount() {
        this.props.resetTags();
    }

    render() {
        return (
            <AddClauseTab {...this.props} />
        );
    }
}

const mapStateToProps = (state) => ({
    initialClauseText: state.clause.addClauseText,
    practiceGroupsOptions: state.tag.practiceGroupsOptions,
    jurisdictionOptions: state.tag.jurisdictionOptions,
    sectorOptions: state.tag.sectorOptions,
    partiesOptions: state.tag.partiesOptions,
    clauseTypesOptions: state.tag.clauseTypesOptions,
    documentTypesOptions: state.tag.documentTypesOptions,
    clientsOptions: state.tag.clientsOptions,
    matterNumberOptions: state.tag.matterNumberOptions,
    authorsOptions: state.tag.authorsOptions,
    otherTagOptions: state.tag.otherTagOptions,
    currentBubbleCode: state.app.currentBubbleCode,
    visitedTeachingBubbles: state.app.visitedTeachingBubbles,
    workspaces: state.workspace.activeWorkspaces,
    workspace_id: state.app.appContext.workspace_id,
    usersname: state.app.appContext.usersname,

});

const mapDispatchToProps = (dispatch) => ({
    setSidebarTab: (sidebarTab) => dispatch.app.setSidebarTab({sidebarTab}),
    saveClause: (values) => dispatch.clause.saveClause({values}),
    setAddClauseText: (text) => dispatch.clause.setAddClauseText({text}),
    showNextTeachingBubble: () => dispatch.app.showNextTeachingBubble(),
    addBubbleCodeToVisited: (bubbleCode) => dispatch.app.addBubbleCodeToVisited(bubbleCode),
    switchWorkspace: (workspaceId) => dispatch.app.switchWorkspace(workspaceId),
    getTagsWithType: (tagType, input) => dispatch.tag.getTagsWithType({tagType, input, withNegations: false}),
    resetTags: () => dispatch.tag.resetTags(),
    setFavorite: (clauseId, isFavorite) => dispatch.clause.setFavorite({
        clause_id: clauseId, is_favorite: isFavorite,
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddClauseTabContainer);
