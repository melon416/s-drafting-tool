import React, { Component } from 'react';
import {
  Dropdown, ResponsiveMode,
  Checkbox, Icon, Link, TeachingBubble,
} from 'office-ui-fabric-react';
import {
  PrimaryButton,
} from 'office-ui-fabric-react/lib/Button';
import { connect } from 'react-redux';
import { getId } from 'office-ui-fabric-react/lib/Utilities';
import { Stack, StackItem } from 'office-ui-fabric-react/lib/Stack';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';

import {
    SIDEBAR_TAB_ADD_CLAUSE,
    SIDEBAR_TAB_SUGGEST,
    TAG_TYPE_AUTHOR,
    TAG_TYPE_CLAUSE_TYPE,
    TAG_TYPE_CLIENT,
    TAG_TYPE_DOCUMENT_TYPE,
    TAG_TYPE_JURISDICTION,
    TAG_TYPE_MATTER_NUMBER, TAG_TYPE_OTHER,
    TAG_TYPE_PARTY,
    TAG_TYPE_PRACTICE_GROUP,
    TAG_TYPE_SECTOR,
    WORKSPACE_ID_DEFAULT
} from '../../consts';
import {getClauseBankURLPrefix} from '../../utils';
import {TagPickerCreatable} from '../../components/tag-picker/TagPicker';
import {LayoutRow} from '../../shared/components/Layout';
import addClauseImg from '../../assets/images/tutorial-add-clauses.gif';
import _ from "lodash";

class AddClauseTab extends Component {
	teachingBubbleTarget = React.createRef();

	teachingBubbleCode = 'add-clause';

	mounted = false;

	ids = {
	  clause_text: getId(),
	  title: getId(),
	  clause_type_id: getId(),
	  is_validated: getId(),
	  document_type_id: getId(),
	  client_id: getId(),
    matter_number_id: getId(),
	  party_id: getId(),
	  author_id: getId(),
	  practice_group_id: getId(),
	  jurisdiction_id: getId(),
	  sector_id: getId(),
	  other_tags_id: getId(),
	};

  constructor(props) {
    super(props);
    this.state = {
      clause: {
        // eslint-disable-next-line react/destructuring-assignment
        clause_text: this.props.initialClauseText,
        author_id: [this.props.usersname],
        is_favorite: true,
      },
      authorsOptions: [...this.props.authorsOptions, this.props.usersname],
      showAddSuccess: false,
      showAddSuccessCloseTimer: 0,
      showAddSuccessClauseID: null,
      isSaving: false,
    };
  }

	componentDidMount() {
	  this.mounted = true;
	}

	componentWillUnmount() {
	  this.mounted = false;
	}


    handleFetchTags = (tagType, input) => {
        /**
         *
         * @param {string} tagType
         * @param {string} input
         * @return {void}
         * @memberof AddClauseTab
         */
        const {getTagsWithType} = this.props;
        //Don't fetch tags unless there is an input value
        if (input) {
            getTagsWithType(tagType, input);
        }
    }

    debouncedFetch = _.debounce(this.handleFetchTags, 1000);


    static getDerivedStateFromProps(props, state) {
        if (props.initialClauseText !== state.initialClauseText) {
            return {
                initialClauseText: props.initialClauseText,
                clause: {
                    ...state.clause,
                    clause_text: props.initialClauseText,
                },
            };
        }

	  return null;
	}

	onCoachDismiss = () => {
	  const { addBubbleCodeToVisited } = this.props;
	  addBubbleCodeToVisited(this.teachingBubbleCode);
	};

	onShowNextBubble = () => {
	  const { showNextTeachingBubble } = this.props;
	  showNextTeachingBubble();
	}

	saveClause = async () => {
	  const { saveClause, setFavorite } = this.props;
	  const { clause } = this.state;
	  this.setState({
	    isSaving: true,
	  });
	  const clauseId = await saveClause(clause);
	  if (clauseId) {
      // set favourite
      setFavorite(clauseId, this.state.clause.is_favorite);

	    this.setState({
	      showAddSuccess: true,
	      showAddSuccessCloseTimer: 5,
	      showAddSuccessClauseID: clauseId,
	      isSaving: false,
        clause: {
          // eslint-disable-next-line react/destructuring-assignment
          clause_text: this.props.initialClauseText,
          author_id: [this.props.usersname],
          is_favorite: true,
        },
        authorsOptions: [...this.props.authorsOptions, this.props.usersname],
	    });

	    setTimeout(this.closeTimer, 1000);
	  }
	};

	closeTimer = () => {
	  const { showAddSuccess, showAddSuccessCloseTimer } = this.state;
	  if (!this.mounted || !showAddSuccess) {
	    return;
	  }

	  if (showAddSuccessCloseTimer >= 2) {
	    this.setState({ showAddSuccessCloseTimer: showAddSuccessCloseTimer - 1 });
	    setTimeout(this.closeTimer, 1000);
	  } else {
	    this.hideAddSuccess();
	  }
	};

	hideAddSuccess = () => {
	  const { setSidebarTab } = this.props;
	  this.setState({ showAddSuccess: false });
	  setSidebarTab(SIDEBAR_TAB_ADD_CLAUSE);
	};

	cancel = () => {
	  const { setAddClauseText, setSidebarTab } = this.props;
	  setAddClauseText('');
	  setSidebarTab(SIDEBAR_TAB_SUGGEST);
	};

  handleSwitchWorkspace = (e, selectedOption) => {
    const { switchWorkspace } = this.props;
    switchWorkspace(selectedOption.id);
  };

  renderAddSuccess() {
	  const { showAddSuccessCloseTimer, showAddSuccessClauseID } = this.state;
	  const { workspace_id: workspaceId } = this.props;
	  return (
      <div style={{ display: 'flex', flexFlow: 'column' }}>
        <div style={{ margin: 'auto' }}>
          <Icon
            style={{
              fontSize: '100px',
            }}
            onClick={this.hideAddSuccess}
            iconName="CheckMark"
          />
        </div>
        <div style={{ margin: 'auto', padding: 30 }}>
          Clause saved
        </div>
        <div style={{ margin: 'auto' }}>
          <PrimaryButton style={{ Zwidth: '100%' }} onClick={this.hideAddSuccess} className="primary-red-button">
            Closing in
            {' '}
            {showAddSuccessCloseTimer}
          </PrimaryButton>
        </div>
        <div style={{ margin: 'auto', padding: 30 }}>
          <Link href={`${getClauseBankURLPrefix()}/w/${workspaceId || WORKSPACE_ID_DEFAULT}/clause/${showAddSuccessClauseID}`} target="_blank">View in Clause Bank</Link>
        </div>
      </div>
	  );
  }

    render() {
        const {
            clauseTypesOptions,
            documentTypesOptions,
            clientsOptions,
            matterNumberOptions,
            partiesOptions,
            authorsOptions,
            practiceGroupsOptions,
            jurisdictionOptions,
            sectorOptions,
            otherTagOptions,
            currentBubbleCode,
            visitedTeachingBubbles,
            isAdmin,
            isSystemAdmin,
            workspaces,
            workspace_id: workspaceId,
        } = this.props;
        const {clause, showAddSuccess, isSaving} = this.state;

	  if (showAddSuccess) {
	    return this.renderAddSuccess();
	  }

        return (
            <div ref={this.teachingBubbleTarget}>
                <Stack>
                    <StackItem>
                        <Label for={this.ids.clause_text}>Clause Text</Label>
                        <TextField
                            id={this.ids.clause_text}
                            value={clause.clause_text}
                            multiline
                            onChange={(e) => this.setState({clause: {...clause, clause_text: e.target.value}})}
                            placeholder="Enter text of clause or definition"
                            autoAdjustHeight
                        />
                    </StackItem>
                    <StackItem>
                        <Label for={this.ids.title}>Clause Name</Label>
                        <TextField
                            id={this.ids.title}
                            value={clause.title}
                            onChange={(e) => this.setState({clause: {...clause, title: e.target.value}})}
                            placeholder="Enter the name of the clause or definition"
                        />
                    </StackItem>
                    <StackItem>
                        <TagPickerCreatable
                            creatable
                            id={this.ids.clause_type_id}
                            label="Clause Type"
                            value={clause.clause_type_id}
                            options={clauseTypesOptions}
                            onChange={(clauseTypeId) => this.setState({
                                clause: {
                                    ...clause,
                                    clause_type_id: clauseTypeId
                                }
                            })}
                            inputProps={{
                                placeholder: clause.clause_type_id?.length ? '' : 'Enter the typing of the clause or definition',
                            }}
                            onInputChange={(value) => {
                                this.debouncedFetch(TAG_TYPE_CLAUSE_TYPE, value);
                                return value;
                            }}
                        />
                    </StackItem>
                    <StackItem>
                        <TagPickerCreatable
                            creatable
                            id={this.ids.document_type_id}
                            label="Source Document Type"
                            value={clause.document_type_id}
                            options={documentTypesOptions}
                            onChange={(documentTypeId) => this.setState({
                                clause: {
                                    ...clause,
                                    document_type_id: documentTypeId
                                }
                            })}
                            inputProps={{
                                placeholder: clause.document_type_id?.length ? '' : 'Enter the typing of the source document',
                            }}
                            onInputChange={(value) => {
                                this.debouncedFetch(TAG_TYPE_DOCUMENT_TYPE, value);
                                return value;
                            }}
                        />
                    </StackItem>
                    <StackItem>
                        <TagPickerCreatable
                            creatable
                            id={this.ids.client_id}
                            label="Client"
                            value={clause.client_id}
                            options={clientsOptions}
                            inputProps={{
                                placeholder: clause.client_id?.length ? '' : 'Enter the identity of the instructing client',
                            }}
                            onChange={(clientId) => this.setState({clause: {...clause, client_id: clientId}})}
                            onInputChange={(value) => {
                                this.debouncedFetch(TAG_TYPE_CLIENT, value);
                                return value;
                            }}
                        />
                    </StackItem>
                    <StackItem>
                        <TagPickerCreatable
                            creatable
                            id={this.ids.matter_number_id}
                            label="Matter Number"
                            value={clause.matter_number_id}
                            options={matterNumberOptions}
                            inputProps={{
                                placeholder: clause.matter_number_id?.length ? '' : 'Enter the matter number',
                            }}
                            onChange={(matterNumberId) => this.setState({
                                clause: {
                                    ...clause,
                                    matter_number_id: matterNumberId
                                }
                            })}
                            onInputChange={(value) => {
                                this.debouncedFetch(TAG_TYPE_MATTER_NUMBER, value);
                                return value;
                            }}
                        />
                    </StackItem>
                    <StackItem>
                        <TagPickerCreatable
                            creatable
                            id={this.ids.party_id}
                            label="Parties"
                            value={clause.party_id}
                            options={partiesOptions}
                            onChange={(partyId) => this.setState({clause: {...clause, party_id: partyId}})}
                            inputProps={{
                                placeholder: clause.party_id?.length ? '' : 'Enter the identity of the parties to the document',
                            }}
                            onInputChange={(value) => {
                                this.debouncedFetch(TAG_TYPE_PARTY, value);
                                return value;
                            }}
                        />
                    </StackItem>
                    <StackItem>
                        <TagPickerCreatable
                            creatable
                            id={this.ids.author_id}
                            label="Author"
                            value={clause.author_id}
                            options={authorsOptions}
                            onChange={(authorId) => this.setState({clause: {...clause, author_id: authorId}})}
                            inputProps={{
                                placeholder: clause.author_id?.length ? '' : 'Enter the name of the author',
                            }}
                            onInputChange={(value) => {
                                this.debouncedFetch(TAG_TYPE_AUTHOR, value);
                                return value;
                            }}
                        />
                    </StackItem>
                    <StackItem>
                        <TagPickerCreatable
                            id={this.ids.practice_group_id}
                            label="Practice Group"
                            value={clause.practice_group_id}
                            options={practiceGroupsOptions}
                            onChange={(practiceGroupId) => this.setState({
                                clause: {
                                    ...clause,
                                    practice_group_id: practiceGroupId
                                }
                            })}
                            inputProps={{
                                placeholder: clause.practice_group_id?.length ? '' : 'Select the practice group',
                            }}
                            onInputChange={(value) => {
                                this.debouncedFetch(TAG_TYPE_PRACTICE_GROUP, value);
                                return value;
                            }}
                        />
                    </StackItem>
                    <StackItem>
                        <TagPickerCreatable
                            id={this.ids.sector_id}
                            label="Sector"
                            value={clause.sector_id}
                            options={sectorOptions}
                            onChange={(sectorId) => this.setState({clause: {...clause, sector_id: sectorId}})}
                            inputProps={{
                                placeholder: clause.sector_id?.length ? '' : 'Select the sector',
                            }}
                            onInputChange={(value) => {
                                this.debouncedFetch(TAG_TYPE_SECTOR, value);
                                return value;
                            }}
                        />
                    </StackItem>
                    <StackItem>
                        <TagPickerCreatable
                            label="Jurisdiction"
                            id={this.ids.jurisdiction_id}
                            value={clause.jurisdiction_id}
                            options={jurisdictionOptions}
                            onChange={(jurisdictionId) => this.setState({
                                clause: {
                                    ...clause,
                                    jurisdiction_id: jurisdictionId
                                }
                            })}
                            inputProps={{
                                placeholder: clause.jurisdiction_id?.length ? '' : 'Select the jurisdiction',
                            }}
                            onInputChange={(value) => {
                                this.debouncedFetch(TAG_TYPE_JURISDICTION, value);
                                return value;
                            }}
                        />
                    </StackItem>
                    <StackItem>
                        <TagPickerCreatable
                            creatable
                            label="Other tags"
                            id={this.ids.other_tags_id}
                            value={clause.other_tag_id}
                            options={otherTagOptions}
                            onChange={(otherTagId) => this.setState({clause: {...clause, other_tag_id: otherTagId}})}
                            inputProps={{
                                placeholder: clause.other_tag_id?.length ? '' : 'Enter other tags or labels',
                            }}
                            onInputChange={(value) => {
                                this.debouncedFetch(TAG_TYPE_OTHER, value);
                                return value;
                            }}
                        />
                    </StackItem>
                    {(isAdmin || isSystemAdmin) && (
                        <StackItem className="endorsed-checkbox">
                            <Checkbox
                                id="is_favorite"
                                label="Add to my favourite clauses"
                                styles={{ text: { fontSize: 12, color: 'inherit' }, checkbox: { height: 15, width: 15 } }}
                                checked={this.state.clause.is_favorite}
                                onChange={(e, isChecked) => this.setState({ clause: { ...clause, is_favorite: isChecked } })}
                            />
                        </StackItem>
                    )}
                    {(isAdmin || isSystemAdmin) && (
                        <StackItem className="endorsed-checkbox">
                            <Checkbox
                                id="is_endorsed"
                                label="Endorse as precedent clause"
                                styles={{text: {fontSize: 12, color: 'inherit'}, checkbox: {height: 15, width: 15}}}
                                onChange={(e, isChecked) => this.setState({
                                    clause: {
                                        ...clause,
                                        is_endorsed: isChecked
                                    }
                                })}
                            />
                        </StackItem>
                    )}
                </Stack>
                <LayoutRow>
                    <div className="tabThree_buttons_main" style={{marginTop: '20px', marginBottom: '20px'}}>
                        <PrimaryButton id="syntheiaSaveClauseButton" disabled={!clause.clause_text || isSaving}
                                       style={{marginRight: 20, width: '50%'}} onClick={this.saveClause}
                                       className="primary-red-button">
                            {isSaving && <Spinner size={SpinnerSize.small}/>}
                            Save
                        </PrimaryButton>
                        <Dropdown
                            id="syntheiaSaveClauseWorkspaceDropdown"
                            options={workspaces.map((el) => ({
                                key: el.workspace_id,
                                id: el.workspace_id,
                                text: el.name,
                            }))}
                            responsiveMode={ResponsiveMode.large}
                            label=""
                            onChange={this.handleSwitchWorkspace}
                            defaultSelectedKey={workspaceId}
                        />
                    </div>
                </LayoutRow>
                {currentBubbleCode === this.teachingBubbleCode
                    && !visitedTeachingBubbles.includes(this.teachingBubbleCode)
                    && (
                        <TeachingBubble
                            target={this.teachingBubbleTarget.current}
                            hasSmallHeadline
                            headline="ADD CLAUSES DIRECTLY TO THE KNOWLEDGE BANK"
                            illustrationImage={{src: addClauseImg, styles: {root: {width: 150, margin: '0 auto'}}}}
                            hasCloseButton
                            primaryButtonProps={{children: 'Next', onClick: this.onShowNextBubble}}
                            calloutProps={{
                                className: 'teaching-bubble-callout',
                                preventDismissOnLostFocus: true,
                                preventDismissOnResize: true,
                                preventDismissOnScroll: true,
                            }}
                            onDismiss={this.onCoachDismiss}
                        >
                            <p>The Drafting Assistant is connected to the Knowledge Bank. You do not need to manually
                                create precedents or templates in order for the Drafting Assistant to work. Your whole
                                library of documents is available as source material for the Drafting Assistant.</p>
                            <br/>
                            <p>
                                Since the Drafting Assistant is connected to the Knowledge Bank, you can add a clause
                                directly to the Knowledge Bank by inserting the text into the
                                {' '}
                                <b>Add Clause</b>
                                {' '}
                                tab and
                                {' '}
                                <b>saving</b>
                                {' '}
                                the clause. The saved clause is then available immediately to other users without your
                                leaving Microsoft Word environment.
                            </p>
                            <br/>
                            <p>Admin users can change the range of filters that are available.</p>
                        </TeachingBubble>
                    )}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
  isAdmin: state.app.appContext.isAdmin,
  isSystemAdmin: state.app.appContext.isSystemAdmin,
});

export default connect(mapStateToProps)(AddClauseTab);
