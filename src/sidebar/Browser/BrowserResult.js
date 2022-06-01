/* eslint-disable camelcase */
import React, { Component } from 'react';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { Text } from 'office-ui-fabric-react/lib/Text';
import { Separator } from 'office-ui-fabric-react/lib/Separator';
import { Slider } from 'office-ui-fabric-react/lib/Slider';
import { Dropdown, ResponsiveMode } from 'office-ui-fabric-react';
import _ from 'lodash';
import { SIDEBAR_TAB_BROWSER_DETAIL, SIDEBAR_TAB_BROWSE } from '../../consts';
import Select from '../../components/Select';
import { LayoutRow, LayoutRows } from '../../shared/components/Layout';
import SingleClause from './SingleClause';
import Loading from '../../components/Loading';
import { suggestion } from '../../models';

export default class BrowserResult extends Component {
  teachingBubbleTarget = React.createRef();

  teachingBubbleCode = 'pick-and-choose';

  state = {
    showFilter: false,
    compareText: false,
    compareTextImproveReadability: true,
    declined: [],
    sortOptions: [{ key: 0, text: "Date ascending" }, { key: 1, text: "Date descending" }, { key: 2, text: "A -> Z" }, { key: 3, text: "Z -> A" }],
    sortOption: 0
  };

  componentDidMount() {
    this.forceUpdate();
  }

  onCoachDismiss = () => {
    const { addBubbleCodeToVisited } = this.props;
    addBubbleCodeToVisited(this.teachingBubbleCode);
  };

  onShowNextBubble = () => {
    const { showNextTeachingBubble } = this.props;
    this.setState({ showFilter: true });
    showNextTeachingBubble();
  }

  handleSuggestionDetail = (suggestion) => {
    const { setSidebarTab, setSelectedSuggestion } = this.props;
    setSidebarTab(SIDEBAR_TAB_BROWSER_DETAIL);
    setSelectedSuggestion([suggestion]);
  }

  onFilterDone = () => {
    this.setState({ showFilter: false });
  };

  handleDecline = (suggestion) => {
    const { declined } = this.state;
    const { markBadSuggestion } = this.props;
    this.setState({ declined: declined.concat(suggestion.id) }, () => {
      setTimeout(() => {
        markBadSuggestion(suggestion.id);
        this.setState({ declined: declined.filter((id) => id !== suggestion.id) });
      }, 367);
    });
  };

  handleSortChange = (e, selectedOption) => {
    this.setState({
      sortOption: selectedOption.key,
    });
  }

  handleIfOver5Words = (clause) => {
    const wordCount = clause.clause_text.split(' ').length
    if (wordCount >= 5) {
      return true
    }
    return false
  }

  renderSuggestions() {
    const {
      goodSuggestions, badSuggestions, markGoodSuggestion, suggestions, suggestionMoreAvailable,
      suggestionIsLoading, unusualPhrases, suggestionSearchText, bookmarks,
      addActivity, filter,
    } = this.props;
    const { declined, compareText, compareTextImproveReadability } = this.state;

    if (!suggestions.length) {
      if (suggestionIsLoading) {
        return <Loading />;
      }

      if (!suggestionMoreAvailable) {
        return <div className="SuggestionNoResult">No clauses found, try changing your input and filters</div>;
      }

      return null;
    }

    return (
      <LayoutRows className="SuggestionResultList" flexible style={{ overflow: 'visible' }}>
        {suggestions
          .filter((value, index) => suggestions.findIndex(t => (t.content_id === undefined && t.clause_text === undefined) || (t.content_id !== undefined && t.content_id === value.content_id) || (t.clause_text !== undefined && t.clause_text === value.clause_text)) === index)
          .filter((sug) => !badSuggestions.includes(sug.id))
          .sort((a, b) => {
            if (a.clause_date_to > b.clause_date_to) return this.state.sortOption === 0 ? 1 : -1;
            if (a.clause_date_to < b.clause_date_to) return this.state.sortOption === 1 ? 1 : -1;
            if (a.clause_text > b.clause_text) return this.state.sortOption === 2 ? 1 : -1;
            if (a.clause_text < b.clause_text) return this.state.sortOption === 3 ? 1 : -1;
            return 0;
          })
          .map((clause, idx) => {
            const isBookmarked = bookmarks.find(({ owner_id }) => owner_id === clause.clause_id);
            //check if the clause_text has more than 5 words 
            // if( !this.handleIfOver5Words(clause) && isBookmarked !== undefined && clause.is_favorite && clause.is_endorsed ) return null;
            
            return (
              <SingleClause
                addActivity={addActivity}
                accepted={goodSuggestions.includes(clause.id)}
                handleAccept={(clause) => markGoodSuggestion(clause.id)}
                handleDecline={this.handleDecline}
                handleSuggestionDetail={this.handleSuggestionDetail}
                key={idx}
                suggestion={clause}
                unusualPhrases={unusualPhrases}
                compareText={compareText}
                compareTextImproveReadability={compareTextImproveReadability}
                suggestionSearchText={suggestionSearchText}
                declined={declined.includes(clause.id)}
                filter={filter}
                isBookmarked={!!isBookmarked}
              />
            );
          })}
      </LayoutRows>
    );
  }

  render() {
    const {
      setSidebarTab, unusualPhrases, setUnusualPhrases, clauseTypesOptions,
      updateUnusualPhrases
    } = this.props;
    const { showFilter } = this.state;
    return (
      <div className="SuggestionResult" ref={this.teachingBubbleTarget}>
        <LayoutRows>
          <LayoutRow>
            <CommandBar
              styles={{
                icon: { color: 'black' },
                width: '70%'
              }}
              className="SuggestionResultCommandBar"
              items={[{
                key: 'back',
                iconProps: {
                  iconName: 'ChevronLeft',
                },
                buttonStyles: {
                  icon: { color: 'black' },
                  iconHovered: { color: 'black' },
                },
                onClick: () => {
                  setSidebarTab(SIDEBAR_TAB_BROWSE);
                },
                disabled: showFilter,
              }, {
                key: 'sugs',
                name: <Text className="ClauseTitle" variant="large">Browse</Text>,
                disabled: true,
              }]}
            />
          </LayoutRow>
          <LayoutRow>
            <Separator />
          </LayoutRow>
          <LayoutRow>
            <Dropdown
              options={this.state.sortOptions.map((el) => ({
                key: el.key,
                text: el.text,
              }))}
              id="sortDropDown"
              placeholder="Sort"
              style={{ width: '30%', float: 'right' }}
              responsiveMode={ResponsiveMode.large}
              onChange={this.handleSortChange}
            // defaultSelectedKey={}
            />
          </LayoutRow>
          {!showFilter && (
            <LayoutRow style={{ margin: 10 }}>
              {unusualPhrases.highlight && unusualPhrases.showAdvanced && (
                <>
                  {/* <Select
                    id="BrowseUnusualPhrasesClauseType"
                    value={unusualPhrases.clauseTypeID ? [unusualPhrases.clauseTypeID] : null}
                    options={clauseTypesOptions}
                    onChange={(clauseTypeID) => {
                      if (clauseTypeID && clauseTypeID.length) {
                        updateUnusualPhrases(unusualPhrases.highlight, clauseTypeID.filter((id) => id !== unusualPhrases.clauseTypeID).shift());
                      } else {
                        updateUnusualPhrases(unusualPhrases.highlight, null);
                      }
                    }}
                    placeholder="Specify clause types to use as baseline for determining anomaly"
                  /> */}
                  <Slider
                    min={2}
                    max={25}
                    value={unusualPhrases.percentage}
                    onChange={_.debounce((percentage) => {
                      setUnusualPhrases({ percentage });
                    }, 200)}
                    showValue={false}
                  />
                </>
              )}
            </LayoutRow>
          )}
          <LayoutRow flexible scrolling>
            {!showFilter && this.renderSuggestions()}
          </LayoutRow>
        </LayoutRows>
      </div>
    );
  }
}