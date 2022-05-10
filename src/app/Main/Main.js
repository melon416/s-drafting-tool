import React, { Component } from 'react';
import {
  Dialog, DialogFooter, DialogType, PrimaryButton,
} from 'office-ui-fabric-react';
import SidebarContainer from '../../sidebar/SidebarContainer';
import EditorContainer from './EditorContainer';
import { LayoutColumn, LayoutColumns } from '../../shared/components/Layout';
import { SIDEBAR_TAB_ADD_CLAUSE, SIDEBAR_TAB_SUGGEST } from '../../consts';
import '../../registerIcons';
import startTutorialImg from '../../assets/images/tutorial-intro.gif';
import outro from '../../assets/images/tutorial-outro.gif';

export default class Main extends Component {
	editorRef = React.createRef();

	state = {
	};

	updateAskSyntheiaText = (text) => {
	  const {
	    clearSuggestions, setSuggestionSearchText, setSuggestionSearchExtraText, setSidebarTab,
	  } = this.props;
	  clearSuggestions();
	  setSuggestionSearchText(text);
	  setSuggestionSearchExtraText('');
	  setSidebarTab(SIDEBAR_TAB_SUGGEST);
	};

	handleAddClause = (text) => {
	  const {
	    setSidebarTab, setAddClauseText,
	  } = this.props;
	  setSidebarTab(SIDEBAR_TAB_ADD_CLAUSE);
	  setAddClauseText(text);
	};

	handleShowNextCard = () => {
	  const {
	    setSidebarTab, startTutorial,
	  } = this.props;
	  setSidebarTab(SIDEBAR_TAB_SUGGEST);
	  setTimeout(() => {
	    startTutorial();
	  }, 100);
	}

	handleLoadFile = (file) => {
	  this.editorRef.current.loadDocument(file);
	}

	getDocumentText = async () => this.editorRef.current.getEditorText();

	render() {
	  const {
	    currentBubbleCode, setCurrentBubbleCode, rightPanelVisible,
	  } = this.props;
	  return (
      <>
        <LayoutColumns>
          <LayoutColumn flexible>
            <EditorContainer
              editorRef={this.editorRef}
              updateAskSyntheiaText={this.updateAskSyntheiaText}
              onAddClause={this.handleAddClause}
            />
            <Dialog
              minWidth={500}
              hidden={currentBubbleCode !== 'intro' || currentBubbleCode === 'skipped'}
              onDismiss={() => setCurrentBubbleCode('skipped')}
              dialogContentProps={{
                type: DialogType.normal,
                className: 'tutorial-dialog',
                title: 'WELCOME TO THE DRAFTING ASSISTANT',
              }}
              modalProps={{
                isBlocking: false,
              }}
            >
              <div className="start-tutorial-img">
                <img src={startTutorialImg} alt="" />
              </div>
              <div className="teaching-text">
                <p>Thank you for using Syntheia’s Drafting Assistant!</p>
                <br />
                <p>
                  This application is built as a
                  {' '}
                  <b>Word Add-in</b>
                  , and we have ported it to the web browser for this trial. This application demonstrates one way that our machine learning technology can help you apply your knowledge to improve the speed and quality of drafting.
                </p>
                <br />
                <p>To help you get started, this short tutorial will highlight the key features of the Drafting Assistant.</p>
              </div>

              <DialogFooter styles={{ marginTop: 0 }} className="edit-dialog-footer">
                <PrimaryButton
                  onClick={this.handleShowNextCard}
                  style={{ marginRight: 10 }}
                  text="Next"
                />
                {/* <DefaultButton */}
                {/*	onClick={() => this.props.setCurrentBubbleCode('skipped')} */}
                {/*	text="Skip Tutorial" */}
                {/* /> */}
              </DialogFooter>
            </Dialog>
            <Dialog
              minWidth={500}
              hidden={currentBubbleCode !== 'outro'}
              onDismiss={() => setCurrentBubbleCode('finish')}
              dialogContentProps={{
                type: DialogType.normal,
                title: 'WE HOPE THIS APPLICATION HELPS YOU CREATE YOUR BEST WORK',
                className: 'tutorial-dialog',
              }}
              modalProps={{
                isBlocking: false,
              }}
            >
              <div className="start-tutorial-img">
                <img src={outro} alt="" />
              </div>
              <div className="teaching-text">
                <p>We built the Drafting Assistant to help you create the best legal work for your client. </p>
                <br />
                <p>The Drafting Assistant is one example of our applications that applies your collective knowledge to a downstream task. </p>
                <br />
                <p>If you have any questions or feedback on the Drafting Assistant, or if you would like to see other applications which tap into your centralized repository of knowledge, we would love to hear from you at hello@syntheia.io!</p>
                <br />
              </div>

              <DialogFooter styles={{ marginTop: 0 }} className="edit-dialog-footer">
                <PrimaryButton
                  onClick={() => setCurrentBubbleCode('finish')}
                  style={{ marginRight: 10 }}
                  text="Finish Tutorial"
                />
              </DialogFooter>
            </Dialog>
          </LayoutColumn>
          <LayoutColumn className="MainSidebar" visible={rightPanelVisible}>
            <SidebarContainer
              getDocumentText={this.getDocumentText}
              handleLoadFile={this.handleLoadFile}
            />
          </LayoutColumn>
        </LayoutColumns>
      </>
	  );
	}
}
