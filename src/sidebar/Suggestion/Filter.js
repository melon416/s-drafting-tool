 /**
  *  Filter.js is a class based components responsible for filtering clause suggestions
  */
 
 /**
  * Change-Log:
  * - 2022-05-11, Wang, Fix breaking on Other Tags (some values were undefined and this was the cause)
  * - 2022-06-05, Attia, Fetch tags by type on user input
  */


/* eslint-disable camelcase */
import React, { Component } from 'react';
import {
  DefaultButton, PrimaryButton,
} from 'office-ui-fabric-react/lib/Button';
import { Stack, StackItem } from 'office-ui-fabric-react/lib/Stack';
import { DatePicker, DayOfWeek } from 'office-ui-fabric-react/lib/DatePicker';
import { Label } from 'office-ui-fabric-react/lib/Label';
import _ from 'lodash';
import { getId } from 'office-ui-fabric-react/lib/Utilities';
import { Text } from 'office-ui-fabric-react/lib/Text';
import { TeachingBubble, TextField } from 'office-ui-fabric-react';
import { formatDatePlain, toDate } from '../../shared/date';
import Select from '../../components/Select';
import DocumentIdPicker from '../../components/DocumentIdPicker';
import filterImg from '../../assets/images/tutorial-filters.gif';
import {
    SIDEBAR_TAB_ADD_CLAUSE,
    TAG_TYPE_AUTHOR, TAG_TYPE_CLAUSE_TYPE,
    TAG_TYPE_CLIENT,
    TAG_TYPE_DOCUMENT_TYPE, TAG_TYPE_JURISDICTION, TAG_TYPE_OTHER,
    TAG_TYPE_PARTY, TAG_TYPE_PRACTICE_GROUP, TAG_TYPE_SECTOR
} from '../../consts';
import {getExpandedTagIds} from '../../models/tag';

export default class Filter extends Component {
	teachingBubbleTarget = React.createRef();

	teachingBubbleCode = 'filter';

	ids = {
	  document_id: getId(),
	  clause_type_id: getId(),
	  document_type_id: getId(),
	  client_id: getId(),
      matter_number_id: getId(),
	  party_id: getId(),
	  author_id: getId(),
	  practice_group_id: getId(),
	  jurisdiction_id: getId(),
	  sector_id: getId(),
	  other_id: getId(),
	  clause_date_from: getId(),
	  clause_date_to: getId(),
	};

	constructor(props) {
	  super(props);
	  this.state = {
	    filter: _.cloneDeep(props.initialFilter),
      practiceGroupsOptions: _.cloneDeep(props.practiceGroupsOptions),
      jurisdictionOptions: _.cloneDeep(props.jurisdictionOptions),
      sectorOptions: _.cloneDeep(props.sectorOptions),
      partiesOptions: _.cloneDeep(props.partiesOptions),
      clauseTypesOptions: _.cloneDeep(props.clauseTypesOptions),
      documentTypesOptions: _.cloneDeep(props.documentTypesOptions),
      clientsOptions: _.cloneDeep(props.clientsOptions),
      matterNumbersOptions: _.cloneDeep(props.matterNumbersOptions),
      authorsOptions: _.cloneDeep(props.authorsOptions),
      otherOptions: _.cloneDeep(props.otherOptions),
      dateAfter: new Date('01 01 1990')
	  };

    const key = Object.keys(this.state.filter);

    key.forEach(each_key => {
      if( !this.state.filter[each_key] ) return;

      if( each_key === "clause_type_id" ) {
        const newOptions = this.state.clauseTypesOptions.filter(item => !this.state.filter.clause_type_id.includes(-item.key))
        this.state.clauseTypesOptions = newOptions;
      }

      if( each_key === "document_type_id" ) {
        const newOptions = this.state.documentTypesOptions.filter(item => !this.state.filter.document_type_id.includes(-item.key))
        this.state.documentTypesOptions = newOptions;
      }

      if( each_key === "client_id" ) {
        const newOptions = this.state.clientsOptions.filter(item => !this.state.filter.client_id.includes(-item.key))
        this.state.clientsOptions = newOptions;
      }

      if( each_key === "party_id" ) {
        const newOptions = this.state.partiesOptions.filter(item => !this.state.filter.party_id.includes(-item.key))
        this.state.partiesOptions = newOptions;
      }

      if( each_key === "author_id" ) {
        const newOptions = this.state.authorsOptions.filter(item => !this.state.filter.author_id.includes(-item.key))
        this.state.authorsOptions = newOptions;
      }

      if( each_key === "practice_group_id") {
        const newOptions = this.state.practiceGroupsOptions.filter(item => !this.state.filter.practice_group_id.includes(-item.key))
        this.state.practiceGroupsOptions = newOptions;
      }

      if( each_key === "jurisdiction_id") {
        const newOptions = this.state.jurisdictionOptions.filter(item => !this.state.filter.jurisdiction_id.includes(-item.key))
        this.state.jurisdictionOptions = newOptions;
      }

      if( each_key === "sector_id") {
        const newOptions = this.state.sectorOptions.filter(item => !this.state.filter.sector_id.includes(-item.key))
        this.state.sectorOptions = newOptions;
      }

      if( each_key === "other_tag_id" ) {
        const newOptions = this.state.otherOptions.filter(item => !this.state.filter.other_tag_id.includes(-item.key))
        this.state.otherOptions = newOptions;
      }
    })

	}

	onCoachDismiss = () => {
	  const { addBubbleCodeToVisited } = this.props;
	  addBubbleCodeToVisited(this.teachingBubbleCode);
	};

	onShowNextBubble = () => {
	  const { setSidebarTab, showNextTeachingBubble } = this.props;
	  setSidebarTab(SIDEBAR_TAB_ADD_CLAUSE);
	  showNextTeachingBubble();
	}

	updateFilter = () => {
	  const {
	    jurisdictionTags, practiceGroupTags, sectorTags,
	    setSuggestionFilter, searchFilter, onDone,
	  } = this.props;
	  const { filter } = this.state;
	  const {
	    jurisdiction_id, practice_group_id, sector_id,
	  } = filter;

	  setSuggestionFilter({
	    ...filter,
	    jurisdiction_id: getExpandedTagIds(jurisdictionTags, jurisdiction_id),
	    practice_group_id: getExpandedTagIds(practiceGroupTags, practice_group_id),
	    sector_id: getExpandedTagIds(sectorTags, sector_id),
	  });
	  searchFilter();
	  onDone();
	};

  /**
   * 
   * @param value 
   * @param key
   * @param options */
  onChangeOptions = (value, key, options) => {
    const { filter } = this.state;
    const data = this.state[`${options}`];
    const diffData = _.xor(value, filter[`${key}`])[0];
    let newOptions = []

    if (value.length > (filter[`${key}`]?.length || 0)) { // Adding new item
      newOptions = data.filter(item => item.key != -diffData)
    } else { // Removing existing one
      const newOption = this.props[`${options}`].find(item => item.key === -diffData);
      const newOptionPos = data.findIndex(item => item.key === diffData) + (diffData > 0 ? 1 : 0);
      newOptions = data;
      newOptions.splice(newOptionPos, 0, newOption)
    }
    this.setState({ [`${options}`]: newOptions.filter(n => n), filter: { ...filter, [`${key}`]: value } })
  }

    handleFetchTags = (tagType, input) => {
        /**
         *
         * @param {string} tagType
         * @param {string} input
         * @return {void}
         * @memberof Filter
         */
        const {getTagsWithType} = this.props;
        //Don't fetch tags unless there is an input value
        if (input) {
            getTagsWithType(tagType, input);
        }
    }

    debouncedFetch = _.debounce(this.handleFetchTags, 1000);

    render() {
        const {
            currentBubbleCode,
            visitedTeachingBubbles,
            onDone,
            partiesOptions,
            clauseTypesOptions,
            documentTypesOptions,
            clientsOptions,
            authorsOptions,
            practiceGroupsOptions,
            jurisdictionOptions,
            sectorOptions,
            otherOptions
        } = this.props;

        const {
            filter,
        } = this.state;

        return (
            <div className="SuggestionFilter" ref={this.teachingBubbleTarget}>
                <Stack>
                    <StackItem>
                        <Text variant="medium" block style={{marginBottom: 10}}>Update suggestions by changing the
                            parameters below</Text>
                    </StackItem>
                    <StackItem>
                        <Label for={this.ids.clause_type_id}>Keywords</Label>
                        <TextField
                            value={filter.keyword}
                            placeholder="Insert a keyword or phrase as filter"
                            onChange={(e, keyword) => this.setState({filter: {...filter, keyword}})}
                        />
                    </StackItem>
                    <StackItem>
                        <Label>Clause Name</Label>
                        <TextField
                            value={filter.title}
                            placeholder="Select a clause name as filter"
                            onChange={(e, clauseTitle) => this.setState({
                                filter: {
                                    ...filter,
                                    title: clauseTitle === "" ? null : [clauseTitle]
                                }
                            })}
                        />
                    </StackItem>
                    <StackItem>
                        <Label for={this.ids.clause_type_id}>Clause Type</Label>
                        <Select
                            id={this.ids.clause_type_id}
                            value={filter.clause_type_id}
                            options={clauseTypesOptions}
                            onChange={(clause_type_id) => this.onChangeOptions(clause_type_id, 'clause_type_id', 'clauseTypesOptions')}
                            placeholder="Select a clause type as filter"
                            onInputChange={(value) => {
                                this.debouncedFetch(TAG_TYPE_CLAUSE_TYPE, value);
                                return value;
                            }}/>
                    </StackItem>
                    <StackItem>
                        <Label for={this.ids.document_id}>Source Document Name or ID</Label>
                        <DocumentIdPicker
                            onChange={(tags) => this.setState({
                                filter: {
                                    ...filter,
                                    document_id: tags.map((t) => t.key),
                                    documents: tags,
                                },
                            })}
                            defaultSelectedItems={filter.documents}
                            ids={filter.document_id || []}
                        />
                    </StackItem>
                    <StackItem>
                        <Label for={this.ids.document_type_id}>Source Document Type</Label>
                        <Select
                            id={this.ids.document_type_id}
                            value={filter.document_type_id}
                            options={documentTypesOptions}
                            onChange={(document_type_id) => this.onChangeOptions(document_type_id, 'document_type_id', 'documentTypesOptions')}
                            placeholder="Select a type of source document as filter"
                            onInputChange={(value) => {
                                this.debouncedFetch(TAG_TYPE_DOCUMENT_TYPE, value);
                                return value;
                            }}/>
                    </StackItem>
                    <StackItem>
                        <Label for={this.ids.client_id}>Client</Label>
                        <Select
                            id={this.ids.client_id}
                            value={filter.client_id}
                            options={clientsOptions}
                            onChange={(client_id) => this.onChangeOptions(client_id, 'client_id', 'clientsOptions')}
                            placeholder="Select a client as filter"
                        />
                    </StackItem>
                    <StackItem>
                        <Label for={this.ids.matter_number_id}>Matter Number</Label>
                        <Select
                            id={this.ids.matter_number_id}
                            value={filter.matter_number_id}
                            options={clientsOptions}
                            onChange={(matter_number_id) => this.onChangeOptions(matter_number_id, 'matter_number_id', 'matterNumbersOptions')}
                            placeholder="Select a matter number as filter"
                            onInputChange={(value) => {
                                this.debouncedFetch(TAG_TYPE_CLIENT, value);
                                return value;
                            }}/>
                    </StackItem>
                    <StackItem>
                        <Label for={this.ids.party_id}>Party</Label>
                        <Select
                            id={this.ids.party_id}
                            value={filter.party_id}
                            options={partiesOptions}
                            onChange={(party_id) => this.onChangeOptions(party_id, 'party_id', 'partiesOptions')}
                            placeholder="Select a party as filter"
                            onInputChange={(value) => {
                                this.debouncedFetch(TAG_TYPE_PARTY, value);
                                return value;
                            }}
                        />
                    </StackItem>
                    <StackItem>
                        <Label for={this.ids.author_id}>Author</Label>
                        <Select
                            id={this.ids.author_id}
                            value={filter.author_id}
                            options={authorsOptions}
                            onChange={(author_id) => this.onChangeOptions(author_id, 'author_id', 'authorsOptions')}
                            placeholder="Select an author as filter"
                            onInputChange={(value) => {
                                this.debouncedFetch(TAG_TYPE_AUTHOR, value);
                                return value;
                            }}/>
                    </StackItem>
                    <StackItem>
                        <Label for={this.ids.practice_group_id}>Practice Group</Label>
                        <Select
                            id={this.ids.practice_group_id}
                            value={filter.practice_group_id}
                            options={practiceGroupsOptions}
                            onChange={(practice_group_id) => this.onChangeOptions(practice_group_id, 'practice_group_id', 'practiceGroupsOptions')}
                            placeholder="Select a practice group as filter"
                            onInputChange={(value) => {
                                this.debouncedFetch(TAG_TYPE_PRACTICE_GROUP, value);
                                return value;
                            }}
                        />
                    </StackItem>
                    <StackItem>
                        <Label for={this.ids.jurisdiction_id}>Jurisdiction</Label>
                        <Select
                            id={this.ids.jurisdiction_id}
                            value={filter.jurisdiction_id}
                            options={jurisdictionOptions}
                            onChange={(jurisdiction_id) => this.onChangeOptions(jurisdiction_id, 'jurisdiction_id', 'jurisdictionOptions')}
                            placeholder="Select a jurisdiction as filter"
                            onInputChange={(value) => {
                                this.debouncedFetch(TAG_TYPE_JURISDICTION, value);
                                return value;
                            }}/>
                    </StackItem>
                    <StackItem>
                        <Label for={this.ids.sector_id}>Sector</Label>
                        <Select
                            id={this.ids.sector_id}
                            value={filter.sector_id}
                            options={sectorOptions}
                            onChange={(sector_id) => this.onChangeOptions(sector_id, 'sector_id', 'sectorOptions')}
                            placeholder="Any"
                            onInputChange={(value) => {
                                this.debouncedFetch(TAG_TYPE_SECTOR, value);
                                return value;
                            }}/>
                    </StackItem>
                    <StackItem>
                        <Label for={this.ids.other_id}>Other Tags</Label>
                        <Select
                            id={this.ids.other_id}
                            value={filter.other_tag_id}
                            options={otherOptions}
                            onChange={(other_tag_id) => this.onChangeOptions(other_tag_id, 'other_tag_id', 'otherOptions')}
                            placeholder="Select additional tags as filters"
                            onInputChange={(value) => {
                                this.debouncedFetch(TAG_TYPE_OTHER, value);
                                return value;
                            }}/>
                    </StackItem>
                    <Stack horizontal tokens={{childrenGap: 20}}>
                        <StackItem grow>
                            <Label for={this.ids.clause_date_from}>Document dated after</Label>
                            <DatePicker
                                id={this.ids.clause_date_from}
                                value={toDate(filter.clause_date_from)}
                                onSelectDate={(date) => this.setState({
                                    filter: {
                                        ...filter,
                                        clause_date_from: formatDatePlain(date)
                                    }, dateAfter: new Date(date)
                                })}
                                firstDayOfWeek={DayOfWeek.Monday}
                                formatDate={(date) => formatDatePlain(date) || ''}
                                allowTextInput
                                placeholder="Pick a date"
                                maxDate={new Date()}
                                showMonthPickerAsOverlay
                            />
                        </StackItem>
                        <StackItem grow>
                            <Label for={this.ids.clause_date_to}>Document dated before</Label>
                            <DatePicker
                                id={this.ids.clause_date_to}
                                value={toDate(filter.clause_date_to)}
                                onSelectDate={(date) => this.setState({
                                    filter: {
                                        ...filter,
                                        clause_date_to: formatDatePlain(date)
                                    }
                                })}
                                firstDayOfWeek={DayOfWeek.Monday}
                                formatDate={formatDatePlain}
                                allowTextInput
                                placeholder="Pick a date"
                                minDate={this.state.dateAfter}
                                maxDate={new Date()}
                                showMonthPickerAsOverlay
                            />
                        </StackItem>
                    </Stack>
                </Stack>
                <Stack style={{marginTop: 20}} horizontal tokens={{childrenGap: 20}}>
                    <StackItem grow>
                        <PrimaryButton style={{width: '100%'}} onClick={this.updateFilter}
                                       className="primary-red-button">Update</PrimaryButton>
                    </StackItem>
                    <StackItem grow>
                        <DefaultButton style={{width: '100%'}} onClick={onDone}>Cancel</DefaultButton>
                    </StackItem>
                </Stack>
                {currentBubbleCode === this.teachingBubbleCode
                && !visitedTeachingBubbles.includes(this.teachingBubbleCode)
                && (
                    <TeachingBubble
                        target={this.teachingBubbleTarget.current}
                        hasSmallHeadline
                        headline="FILTER AND HONE YOUR SUGGESTIONS"
                        illustrationImage={{src: filterImg, styles: {root: {width: 150, margin: '0 auto'}}}}
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
                        <p>
                            You can use one or more
                            {' '}
                            <b>tags</b>
                            {' '}
                            as
                            {' '}
                            <b>filters</b>
                            {' '}
                            to narrow the suggestions the Drafting Assistant offers to you.
                        </p>
                        <br/>
                        <p>
                            Filtering can be useful when you want to find clauses that fit specific criteria. For
                            example, clauses that contain certain
                            {' '}
                            <b>keywords</b>
                            , clauses used for specific
                            {' '}
                            <b>clients</b>
                            {' '}
                            in the past, clauses from a
                            {' '}
                            <b>time range</b>
                            , drafting by certain
                            {' '}
                            <b>authors</b>
                            {' '}
                            or experts, or clauses from a specified list of desirable
                            {' '}
                            <b>documents</b>
                            .
                        </p>
                        <br/>
                        <p>Admin users can change the range of filters that are available.</p>
                    </TeachingBubble>
                )}
            </div>
        );
    }
}
