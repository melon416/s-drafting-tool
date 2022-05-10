import React, { Component } from 'react';
import { connect } from 'react-redux';
import AddClauseTab from './AddClauseTab';
import { getTagOptionsForType } from '../../models/tag';
import {
  TAG_TYPE_AUTHOR,
  TAG_TYPE_CLAUSE_TYPE, TAG_TYPE_CLIENT, TAG_TYPE_DOCUMENT_TYPE,
  TAG_TYPE_JURISDICTION, TAG_TYPE_OTHER,
  TAG_TYPE_PARTY,
  TAG_TYPE_PRACTICE_GROUP,
  TAG_TYPE_SECTOR,
  TAG_TYPE_MATTER_NUMBER
} from '../../consts';

class AddClauseTabContainer extends Component {
  render() {
    return (
      <AddClauseTab {...this.props} />
    );
  }
}

const mapStateToProps = (state) => ({
  initialClauseText: state.clause.addClauseText,
  practiceGroupsOptions: getTagOptionsForType(state.tag.tags, TAG_TYPE_PRACTICE_GROUP),
  jurisdictionOptions: getTagOptionsForType(state.tag.tags, TAG_TYPE_JURISDICTION),
  sectorOptions: getTagOptionsForType(state.tag.tags, TAG_TYPE_SECTOR),
  partiesOptions: getTagOptionsForType(state.tag.tags, TAG_TYPE_PARTY),
  clauseTypesOptions: getTagOptionsForType(state.tag.tags, TAG_TYPE_CLAUSE_TYPE),
  documentTypesOptions: getTagOptionsForType(state.tag.tags, TAG_TYPE_DOCUMENT_TYPE),
  clientsOptions: getTagOptionsForType(state.tag.tags, TAG_TYPE_CLIENT),
  matterNumberOptions: getTagOptionsForType(state.tag.tags, TAG_TYPE_MATTER_NUMBER),
  authorsOptions: getTagOptionsForType(state.tag.tags, TAG_TYPE_AUTHOR),
  otherTagOptions: getTagOptionsForType(state.tag.tags, TAG_TYPE_OTHER),
  currentBubbleCode: state.app.currentBubbleCode,
  visitedTeachingBubbles: state.app.visitedTeachingBubbles,
  workspaces: state.workspace.activeWorkspaces,
  workspace_id: state.app.appContext.workspace_id,
});

const mapDispatchToProps = (dispatch) => ({
  setSidebarTab: (sidebarTab) => dispatch.app.setSidebarTab({ sidebarTab }),
  saveClause: (values) => dispatch.clause.saveClause({ values }),
  setAddClauseText: (text) => dispatch.clause.setAddClauseText({ text }),
  showNextTeachingBubble: () => dispatch.app.showNextTeachingBubble(),
  addBubbleCodeToVisited: (bubbleCode) => dispatch.app.addBubbleCodeToVisited(bubbleCode),
  switchWorkspace: (workspaceId) => dispatch.app.switchWorkspace(workspaceId),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddClauseTabContainer);
