import React, { Component, PureComponent } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import getFragmentFromSelection from 'draft-js/lib/getFragmentFromSelection';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import './HTMLEditor.css';
import { IconButton } from 'office-ui-fabric-react';
import ContextMenu from 'react-context-menu';

class NewFile extends Component {
  render() {
    const { onClick } = this.props;
    return (
      <IconButton
        className="HTMLEditorNew rdw-option-wrapper"
        iconProps={{ iconName: 'NewFolder' }}
        onClick={onClick}
        title="New File"
      />
    );
  }
}

class OpenFile extends Component {
  render() {
    const { onClick } = this.props;
    return (
      <IconButton
        className="HTMLEditorOpen rdw-option-wrapper"
        iconProps={{ iconName: 'OpenFile' }}
        onClick={onClick}
        title="Open File"
      />
    );
  }
}

class SaveFile extends Component {
  render() {
    const { onClick } = this.props;
    return (
      <IconButton
        className="HTMLEditorSave rdw-option-wrapper"
        iconProps={{ iconName: 'SaveAs' }}
        onClick={onClick}
        title="Save File"
      />
    );
  }
}

export default class HTMLEditor extends PureComponent {
	state = {
	  editorState: this.getInitialEditorState(),
	};

	getInitialEditorState() {
	  const { defaultValue } = this.props;
	  const contentBlock = htmlToDraft(defaultValue || '');
	  if (contentBlock) {
	    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
	    return EditorState.createWithContent(contentState);
	  }

	  return EditorState.createEmpty();
	}

	onEditorStateChange = (editorState) => {
	  const { onChange, onEditorStateChange } = this.props;
	  onChange(draftToHtml(convertToRaw(editorState.getCurrentContent())));

	  onEditorStateChange(editorState);

	  this.setState({ editorState });
	};

	setEditorReference = (ref) => {
	  const { autoFocus } = this.props;
	  if (autoFocus && ref) {
	    ref.focus();
	  }
	};

  componentDidCatch() { // when error happens
      this.forceUpdate();
  }

	getSelectedText() {
	  const { editorState } = this.state;
	  const selected = getFragmentFromSelection(editorState);

	  return selected?.map((x) => x.getText()).join('\n') || '';
	}

	handleAskSyntheia = () => {
	  const { onAskSyntheia } = this.props;
	  onAskSyntheia(this.getSelectedText());
	};

	handleAddClause = () => {
	  const { onAddClause } = this.props;
	  onAddClause(this.getSelectedText());
	};

	render() {
	  const {
	    placeholder, onNewFile, onOpenFile, onSaveFile,
	  } = this.props;
	  const { editorState } = this.state;

	  return (
      <>
        <Editor
          editorState={editorState}
          onEditorStateChange={this.onEditorStateChange}
          placeholder={placeholder}
          editorClassName="HTMLEditor"
          editorRef={this.setEditorReference}
          toolbarCustomButtons={[<NewFile onClick={onNewFile} />, <OpenFile onClick={onOpenFile} />, <SaveFile onClick={onSaveFile} />]}
          wrapperId="HTMLEditorWrapper"
        />

        <ContextMenu
          contextId="rdw-wrapper-HTMLEditorWrapper"
          items={[
            { label: 'Ask Syntheia', onClick: this.handleAskSyntheia },
            { label: 'Add Clause', onClick: this.handleAddClause },
          ]}
          closeOnClick
        />
      </>
	  );
	}
}
