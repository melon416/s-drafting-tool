  /**
   *  SuggestionResult.js
   *  Author:
   *  Created:
   */
  
  /**
   * Change-Log:
   * - 2022-05-24, Wang,  fetchBookmarks
   * - 2022-06-05, Attia, remove unused tags code
   */


/* eslint-disable camelcase */
import React, { Component } from 'react';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { Text } from 'office-ui-fabric-react/lib/Text';
import { Separator } from 'office-ui-fabric-react/lib/Separator';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { Slider } from 'office-ui-fabric-react/lib/Slider';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { TeachingBubble, MessageBar, MessageBarType} from 'office-ui-fabric-react';
import _ from 'lodash';
import { SIDEBAR_TAB_SUGGEST, SIDEBAR_TAB_SUGGESTION_DETAIL } from '../../consts';
import FilterContainer from './FilterContainer';
import pickImg from '../../assets/images/tutorial-pick-and-choose.gif';
import { LayoutRow, LayoutRows } from '../../shared/components/Layout';
import SingleSuggestion from './SingleSuggestion';
import Loading from '../../components/Loading';

export default class SuggestionResult extends Component {
	teachingBubbleTarget = React.createRef();

	teachingBubbleCode = 'pick-and-choose';

	state = {
	  showFilter: false,
	  compareText: false,
	  compareTextImproveReadability: true,
	  declined: [],
	};

	componentDidMount() {
	  this.forceUpdate();
    this.props.fetchBookmarks();
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
	  setSidebarTab(SIDEBAR_TAB_SUGGESTION_DETAIL);
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

	renderSuggestions() {
	  const {
	    goodSuggestions, badSuggestions, markGoodSuggestion, suggestions, suggestionMoreAvailable,
	    suggestionIsLoading, unusualPhrases, suggestionSearchText, bookmarks, searchRefine,
	    addActivity, filter, suggestionSearchExtraText
	  } = this.props;
	  const { declined, compareText, compareTextImproveReadability } = this.state;

	  if (!suggestions.length) {
	    if (suggestionIsLoading) {
	      return <Loading />;
	    }

	    if (!suggestionMoreAvailable) {
	      return <div className="SuggestionNoResult">No suggestions found, try changing your input and filters</div>;
	    }

	    return null;
	  }

	  const moreButton = suggestionMoreAvailable
	    ? <DefaultButton onClick={searchRefine}>Load More</DefaultButton>
	    : (
        <div style={{ padding: '15px 0', textAlign: 'center' }}>
          No further suggestions available.
          <br />
          {' '}
          Try changing your input and filters.
        </div>
	    );

	  return (
      <LayoutRows className="SuggestionResultList" flexible style={{ overflow: 'visible' }}>
        {suggestions.filter((sug) => !badSuggestions.includes(sug.id)).map((suggestion) => {
          const isBookmarked = bookmarks.find(({ owner_id }) => owner_id === suggestion.clause_id);
          return (
            <SingleSuggestion
              addActivity={addActivity}
              accepted={goodSuggestions.includes(suggestion.id)}
              handleAccept={(suggestion) => markGoodSuggestion(suggestion.id)}
              handleDecline={this.handleDecline}
              handleSuggestionDetail={this.handleSuggestionDetail}
              key={suggestion.id}
              suggestion={suggestion}
              unusualPhrases={unusualPhrases}
              compareText={compareText}
              compareTextImproveReadability={compareTextImproveReadability}
              suggestionSearchText={suggestionSearchText}
              suggestionSearchExtraText={suggestionSearchExtraText}
              declined={declined.includes(suggestion.id)}
              filter={filter}
              isBookmarked={!!isBookmarked}
            />
          );
        })}
        <LayoutRow style={{ marginBottom: 15 }}>
          {suggestionIsLoading ? <Loading /> : moreButton}
        </LayoutRow>
      </LayoutRows>
	  );
	}

	render() {
	  const {
	    setSidebarTab, clear, suggestionHasFilter, unusualPhrases, setUnusualPhrases,
	    updateUnusualPhrases, currentBubbleCode, visitedTeachingBubbles, showWraningForDisableNLP,
      suggestionMoreAvailable
	  } = this.props;
	  const { showFilter, compareText, compareTextImproveReadability} = this.state;
	  return (
      <div className="SuggestionResult" ref={this.teachingBubbleTarget}>
        <LayoutRows>
          <LayoutRow>
            <CommandBar
              styles={{
                icon: { color: 'black' },
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
                  clear();
                  setSidebarTab(SIDEBAR_TAB_SUGGEST);
                },
                disabled: showFilter,
              }, {
                key: 'sugs',
                name: <Text className="SuggestionTitle" variant="large">Suggestions</Text>,
                disabled: true,
              }]}
              farItems={[{
                key: 'filters',
                name: 'Filter',
                iconProps: {
                  iconName: showFilter ? 'FilterSolid' : 'Filter',
                },
                buttonStyles: {
                  icon: { color: suggestionHasFilter ? 'red' : 'black' },
                  iconHovered: { color: suggestionHasFilter ? 'red' : 'black' },
                },
                onClick: () => this.setState({ showFilter: !showFilter }),
              }]}
            />
          </LayoutRow>
          <LayoutRow>
            <Separator />
          </LayoutRow>
          {(showWraningForDisableNLP && suggestionMoreAvailable) &&
          <MessageBar
              messageBarType={MessageBarType.warning}
              isMultiline={false}
              dismissButtonAriaLabel="Close"
            >
              No results in top 1,000 NLP matches. Showing results using keywords matches.
            </MessageBar>
          }
          {!showFilter && (
          <LayoutRow style={{ margin: 10 }}>
            <div className="ToggleWithCheckbox">
              <Toggle
                label="Compare text"
                inlineLabel
                checked={compareText}
                onText="On"
                offText="Off"
                onChange={(ev, compareText) => {
                  this.setState({ compareText });

                  if (compareText) {
                    setUnusualPhrases({ highlight: false });
                  }
                }}
              />
              {compareText && (
              <Checkbox
                checked={compareTextImproveReadability}
                label="Tidy"
                boxSide="end"
                onChange={(ev, compareTextImproveReadability) => {
                  this.setState({ compareTextImproveReadability });
                }}
              />
              )}
            </div>
            <div className="ToggleWithCheckbox">
              <Toggle
                styles={{ root: { alignItems: 'flex-start' }, container: { paddingTop: 5 } }}
                label="Highlight unusual text"
                inlineLabel
                checked={unusualPhrases.highlight}
                onText="On"
                offText="Off"
                onChange={(ev, highlight) => {
                  updateUnusualPhrases(highlight, unusualPhrases.clauseTypeID);

                  if (highlight) {
                    this.setState({ compareText: false });
                  }
                }}
              />
              {unusualPhrases.highlight && unusualPhrases.loading && <Spinner size={SpinnerSize.small} />}
              {unusualPhrases.highlight && (
              <Checkbox
                checked={unusualPhrases.showAdvanced}
                label="Advanced"
                boxSide="end"
                onChange={(ev, showAdvanced) => {
                  setUnusualPhrases({ showAdvanced });
                }}
              />
              )}
            </div>
            {unusualPhrases.highlight && unusualPhrases.showAdvanced && (
            <>
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
            {showFilter && <FilterContainer onDone={this.onFilterDone} />}
            {!showFilter && this.renderSuggestions()}
          </LayoutRow>
        </LayoutRows>
        {currentBubbleCode === this.teachingBubbleCode
          && !visitedTeachingBubbles.includes(this.teachingBubbleCode)
          && (
            <TeachingBubble
              target={this.teachingBubbleTarget.current}
              hasSmallHeadline
              headline="REFINE SUGGESTIONS THROUGH INTERACTIONS"
              illustrationImage={{ src: pickImg, styles: { root: { width: 150, margin: '0 auto' } } }}
              hasCloseButton
              primaryButtonProps={{ children: 'Next', onClick: this.onShowNextBubble }}
              calloutProps={{
                className: 'teaching-bubble-callout',
                preventDismissOnLostFocus: true,
                preventDismissOnResize: true,
                preventDismissOnScroll: true,
              }}
              onDismiss={this.onCoachDismiss}
            >
              <p>
                The Drafting Assistant provides suggested clauses as
                {' '}
                <b>“cards”.</b>
              </p>
              <br />
              <p>
                Each card has buttons for
                {' '}
                <b>liking</b>
                {' '}
                and
                {' '}
                <b>disliking</b>
                {' '}
                the suggestion, which the machine will use as feedback for refining additional suggestions. You can click on the
                {' '}
                <b>info</b>
                {' '}
                button to discover the context and more information about a suggested clause.
              </p>
              <br />
              <p>
                You can also use functions like
                {' '}
                <b>comparing</b>
                {' '}
                your input text against the suggestions or highlighting words and phrases that might be
                {' '}
                <b>unusual</b>
                .
              </p>
            </TeachingBubble>
          )}
      </div>
	  );
	}
}
