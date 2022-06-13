  /**
   *  SuggestionTab.js
   *  Author:
   *  Created:
   */
  
  /**
   * Change-Log:
   * - 2022-06-02, Wang,  Add code for word addin
   */


import React, { Component } from 'react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import {
  PrimaryButton,
} from 'office-ui-fabric-react/lib/Button';
import {
  Dropdown, ResponsiveMode,
  TeachingBubble,
} from 'office-ui-fabric-react';

import Loading from '../../components/Loading';
import { LayoutRow, LayoutRows } from '../../shared/components/Layout';
import suggestImg from '../../assets/images/tutorial-suggest.gif';

export default class SuggestionTab extends Component {
	coachTarget = React.createRef();

	teachingBubbleCode = 'suggest';

	onCoachDismiss = () => {
	  const { addBubbleCodeToVisited } = this.props;
	  addBubbleCodeToVisited(this.teachingBubbleCode);
	};

	onShowNextBubble = () => {
	  const { showNextTeachingBubble } = this.props;
	  this.handleSearch();
	  setTimeout(() => {
	    showNextTeachingBubble();
	  }, 100);
	}

	handleSearch = async () => {
	  const { search, getDocumentText } = this.props;
	  search(await getDocumentText());
	};

  handleSwitchWorkspace = (e, selectedOption) => {
    const { switchWorkspace } = this.props;
    switchWorkspace(selectedOption.id);
  };

  handleTextFieldChange = async (event) => {
    this.props.setSuggestionSearchText(event.target.value);
  };

  handleDrop = async (event) => { // when text drops and check if it is addin or web
    if(window.Office) {
      const selectedText = await this.getSelectedText();
      this.props.setSuggestionSearchText(selectedText);
    }
    else {
      this.props.setSuggestionSearchText(event.target.value);
    }
  }

  getSelectedText = async () => new Promise((resolve) => {
    window.Office.context.document.getSelectedDataAsync(window.Office.CoercionType.Ooxml, (asyncResult) => {
      if (asyncResult.status !== window.Office.AsyncResultStatus.Failed) {
        const textResult = this.getResultFromXML(asyncResult.value);
        resolve(textResult);
      } else {
        resolve('');
      }
    });
  });

  getResultFromXML = (xmlString) => {
    const parser = new DOMParser();
    let xmlDoc = parser.parseFromString(xmlString,"text/xml");
    const wp = xmlDoc.getElementsByTagName('w:p');
    let result = "";
    for(let i = 0; i < wp.length; i ++ ) {
        const wt = wp[i].getElementsByTagName('w:t');
        for(let j = 0; j < wt.length; j ++) {
            result += wt[j].textContent;
        }
        if(i !== wp.length -1)
            result += '\n';
    }

    return result;
  };

  render() {
	  const {
	    suggestionSearchText, suggestionSearchExtraText, suggestionIsLoading,
	    currentBubbleCode, visitedTeachingBubbles, setSuggestionSearchText,
	    setSuggestionSearchExtraText, workspaces, workspace_id: workspaceId,
	  } = this.props;

	  if (suggestionIsLoading) {
	    return <Loading />;
	  }

	  return (
      <LayoutRows>
        <LayoutRow flexible flexGrow={2}>
          <div ref={this.coachTarget} className="suggest-teaching-bubble-target" />
          <TextField
            label="Find a suggestion"
            multiline
            value={suggestionSearchText}
            onChange={this.handleTextFieldChange}
            onDrop={this.handleDrop}
            placeholder="Insert the text of a clause or a plain language description of a clause"
            resizable={false}
            id="syntheiaSuggestMainTextbox"
            className="FullHeight"
          />
          {currentBubbleCode === this.teachingBubbleCode
            && !visitedTeachingBubbles.includes(this.teachingBubbleCode)
            && (
              <TeachingBubble
                target={this.coachTarget.current}
                hasSmallHeadline
                headline="SUGGEST ALTERNATE LANGUAGE TO REVISE YOUR DRAFTING"
                illustrationImage={{ src: suggestImg, styles: { root: { width: 150, margin: '0 auto' } } }}
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
                  Start by
                  {' '}
                  <b>uploading</b>
                  {' '}
                  a Word document or
                  {' '}
                  <b>typing</b>
                  {' '}
                  in some text to the left hand side.
                  {' '}
                </p>
                <br />
                <p>
                  The Drafting Assistant can suggest alternate language to draft clauses based on the meaning of your text. When you click
                  {' '}
                  <b>suggest</b>
                  , the Drafting Assistant will read the text or clause you
                  {' '}
                  <b>inserted</b>
                  {' '}
                  into the panel on the right hand side (plus any additional concepts you want to include in the suggestions), and then suggest examples of how similar concepts have been drafted in the past.
                  {' '}
                </p>
                <br />
                <p>The Drafting Assistant will learn your preferences in order to augment its suggestions.</p>
              </TeachingBubble>
            )}
        </LayoutRow>
        <LayoutRow flexible>
            <TextField
              label="Advanced compound search"
              multiline
              value={suggestionSearchExtraText}
              onChange={(e) => setSuggestionSearchExtraText(e.target.value)}
              placeholder="(optionally) Type in additional or important text and concepts you want to include in suggestions"
              resizable={false}
              className="FullHeight"
              id="syntheiaSuggestSecondaryTextbox"
            />
        </LayoutRow>
        <LayoutRow>
          <div className="tabThree_buttons_main">
            <PrimaryButton
              onClick={this.handleSearch}
              disabled={!suggestionSearchText}
              style={{ marginRight: 20, width: '50%' }}
              className="primary-red-button"
              id="syntheiaSuggestButton"
            >
              Suggest
            </PrimaryButton>
            <Dropdown
              id="syntheiaWorkspacesDropdown"
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
      </LayoutRows>
	  );
  }
}