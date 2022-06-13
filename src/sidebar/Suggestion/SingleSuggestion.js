  /**
   *  SingleSuggestion.js
   *  Author:
   *  Created:
   */
  
  /**
   * Change-Log:
   * - 2022-05-10, Wang,  Search by every word in suggestion
   */

  /**
   * Change-Log:
   * - 2022-05-24, Wang, update the match accurate instance.mark
   */


/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import { AnimationStyles } from 'office-ui-fabric-react/lib/Styling';
import { Callout, DirectionalHint } from 'office-ui-fabric-react/lib/Callout';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import Mark from 'mark.js';
import { ACTIVITY_DT_SUGGESTION_INSERTED, BOOKMARK_BONUS_SCORE } from '../../consts';
import TrigramHighlighter from './TrigramHighlighter';
import DiffHighlighter from './DiffHighlighter';
import { LayoutRow } from '../../shared/components/Layout';
import { copyToClipboard } from '../../shared/clientUtils';

function convertDecimalToRoundedPercentage(decimal) {
  return Math.round(decimal * 100);
}

export default class SingleSuggestion extends Component {
	_infoButton = null;

	textElement = null;

	_copyIconElement = null;

	wrapStyles={
	  display: 'block',
	  flexFlow: 'column',
	};

	state = {
	  showExpandButton: false,
	  expandBox: false,
	  showCopied: false,
	};

	componentDidMount() {
	  const textHeight = this.textElement.clientHeight;
	  if (textHeight > 170) {
	    this.setState({ showExpandButton: true });
	  }
	}

	componentDidUpdate() {
	  const { filter, suggestionSearchExtraText } = this.props;
	  const { keyword } = filter;
    const suggestionKeyWords = suggestionSearchExtraText.split(" "); // splitting compounds words into each word

    if( document.querySelector('div.PreWrapped.clause-plain-text') ) {
	    const instance = new Mark('div.PreWrapped.clause-plain-text');
      instance.mark([...suggestionKeyWords], {
        accuracy: "exactly",
	      separateWordSearch: false,
	      className: 'keyword-bold',
	    });
    }

	  if (keyword && document.querySelector('div.PreWrapped.clause-plain-text')) {
	    const instance = new Mark('div.PreWrapped.clause-plain-text');

	    let phrases = keyword;
	    const notIndex = keyword.toLowerCase().indexOf('not');
	    if (notIndex >= 0) {
	      phrases = keyword.substring(0, notIndex).trim();
	    }
	    instance.mark(phrases.split(/ and | or /i), {
        accuracy: "exactly",
	      separateWordSearch: true,
	      className: 'keyword',
	    });
	  }
	}

	handleExpandBox = () => {
	  const { expandBox } = this.state;
	  this.setState({ expandBox: !expandBox });
	};

	handleCopy = () => {
	  const { suggestion } = this.props;
	  copyToClipboard(suggestion.clause_text);
	  this.setState({ showCopied: true });
	  setTimeout(() => {
	    this.setState({ showCopied: false });
	  }, 1000);
	};

	handleDragStart = (e) => {
	  const { suggestion } = this.props;
	  e.dataTransfer.setData('text/plain', suggestion.clause_text);
	};

	handleDragEnd = (e) => {
	  const { suggestion, addActivity } = this.props;
	  try {
	    if (e.dataTransfer?.dropEffect !== 'copy') {
	      return;
	    }
	  } catch (e) { // Edge error...
	  }

	  // the clause could be dropped anywhere, but I could not find a way to see where it is dropped - should be good enough for now
	  addActivity(ACTIVITY_DT_SUGGESTION_INSERTED, { clause_id: suggestion.clause_id }, suggestion.clause_id);
	};

	getClauseDisplay() {
	  const {
	    suggestion, unusualPhrases, compareText, suggestionSearchText, compareTextImproveReadability,
	  } = this.props;

	  if (unusualPhrases.highlight) {
	    return (
        <TrigramHighlighter
          unusualPhrases={unusualPhrases}
          text={suggestion.clause_text}
          trigrams={suggestion.trigrams}
        />
	    );
	  }

	  if (compareText) {
	    return (
        <DiffHighlighter
          originalText={suggestionSearchText}
          text={suggestion.clause_text}
          improveReadability={compareTextImproveReadability}
        />
	    );
	  }

	  return <div className="PreWrapped clause-plain-text">{String(suggestion.clause_text || '').trim()}</div>;
	}

	render() {
	  const {
	    suggestion, declined, suggestionSearchText, handleSuggestionDetail, isBookmarked,
	    accepted, handleAccept, handleDecline,
	  } = this.props;

	  const { showCopied, showExpandButton, expandBox } = this.state;
	  const exactMatch = suggestionSearchText && suggestion.clause_text && suggestionSearchText.split('\n').join(' ').trim() === suggestion.clause_text.split('\n').join(' ').trim();
	  const score = suggestion.score * (isBookmarked ? BOOKMARK_BONUS_SCORE : 1);
    const comments_count = parseInt(suggestion.comments_count)

	  return (
      <div style={declined ? { ...this.wrapStyles, ...AnimationStyles.slideRightOut10 } : this.wrapStyles}>
        <LayoutRow
          className="SuggestionBox"
          style={{
            height: showExpandButton ? (expandBox ? null : 182) : null,
            backgroundColor: accepted ? '#E0FDE0' : '#fff',
            overflow: 'hidden',
            borderColor: suggestion.is_endorsed ? '#33cccc' : '#ccc',
          }}
        >
          <div style={{ display: 'flex', flexFlow: 'row', height: '100%' }}>
            <div style={{ display: 'flex', flexFlow: 'column' }}>
              <Icon
                className="SuggestionBoxIcon"
                style={{
                  color: 'rgb(16, 124, 16)',
                  flex: '0 0 auto',
                }}
                onClick={() => handleAccept(suggestion)}
                iconName="Completed"
              />
              <Icon
                className="SuggestionBoxIcon"
                style={{
                  color: 'rgb(168, 0, 0)',
                  flex: '0 0 auto',
                  marginBottom: 16,
                }}
                onClick={() => handleDecline(suggestion)}
                iconName="ErrorBadge"
              />
              <div
                className="SuggestionBoxIcon"
                ref={(copyIconElement) => { this._copyIconElement = copyIconElement; return copyIconElement; }}
                style={{
                  flex: '0 0 auto',
                  marginBottom: 16,
                }}
              >
                <Icon
                  style={{
                    color: 'black',
                  }}
                  onClick={this.handleCopy}
                  iconName="Copy"
                />
              </div>
              {showCopied && (
                <Callout
                  target={this._copyIconElement}
                  directionalHint={DirectionalHint.rightCenter}
                >
                  <div style={{ margin: 10 }}>
                    Copied to clipboard
                  </div>
                </Callout>
              )}
              <div
                className="SuggestionBoxIcon"
                ref={(infoButton) => { this._infoButton = infoButton; return infoButton; }}
                style={{
                  flex: '0 0 auto',
                }}
              >
                <Icon
                  style={{
                    color: 'rgb(51, 51, 51)',
                  }}
                  onClick={() => handleSuggestionDetail(suggestion)}
                  iconName="Info"
                />
              </div>
              <div style={{ flex: '1 1 auto' }} />
              {showExpandButton && (
                <Icon
                  className="SuggestionBoxIcon"
                  style={{
                    color: 'rgb(0, 120, 212)',
                    zIndex: 3,
                    flex: '0 0 auto',
                  }}
                  onClick={this.handleExpandBox}
                  iconName={expandBox ? 'Movers' : 'Sell'}
                />
              )}
            </div>
            <div
              onDragStart={this.handleDragStart}
              onDragEnd={this.handleDragEnd}
              draggable
              ref={(textElement) => { this.textElement = textElement; return textElement; }}
              className="tabThree_infoText"
            >
              {this.getClauseDisplay()}
            </div>
            {/* Following is a div to put a 'faded' look at bottom of div */}
            {(!expandBox && showExpandButton) && (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: '70%',
                  right: 0,
                  bottom: 0,
                  backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)',
                  opacity: '0.9',
                }}
              />
            )}
          </div>
        </LayoutRow>
        <LayoutRow
          style={{
            marginBottom: '15px',
            marginTop: '2px',
            fontSize: '11px',
            fontWeight: '500',
          }}
        >
          {convertDecimalToRoundedPercentage(Math.min(score, 1))}
          % relevant
          <br />
          {comments_count > 0 ? "Click the info button to see additional commentary" : ''}
          {suggestion.is_endorsed ? <span className="endorsed-clause"> - Endorsed</span> : ''}
          {isBookmarked ? <span className="endorsed-clause"> - Bookmarked</span> : ''}
          {exactMatch && ' - Exact match'}
        </LayoutRow>
      </div>
	  );
	}
}
