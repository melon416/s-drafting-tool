import React, { Component } from 'react';
import mammoth from 'mammoth';
import html2docx from 'html-docx-js/dist/html-docx';
import draftToHtml from 'draftjs-to-html';
import { ContentState, convertToRaw } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import HTMLEditor from './HTMLEditor';
import { ACTIVITY_DT_DOCUMENT_DOWNLOADED, ACTIVITY_DT_DOCUMENT_OPENED } from '../../consts';
import { removeHTMLImages } from '../../utils';
import { downloadFile, getFileAsArrayBuffer } from '../../shared/clientUtils';
import Loading from '../../components/Loading';

function buildFileSelector() {
  const fileSelector = document.createElement('input');
  fileSelector.setAttribute('type', 'file');
  fileSelector.setAttribute('accept', '.docx');

  return fileSelector;
}

export default class Editor extends Component {
  constructor(props) {
    super(props);
    this.fileSelector = null;
    this.state = {
      htmleditorkey: 1,
      editorText: null,
      editorState: null,
      isLoading: false,
    };
  }

  componentDidMount() {
	  this.fileSelector = buildFileSelector();
	  this.fileSelector.addEventListener('change', (e) => this.loadFile(e.target.files[0]), false);
  }

	handleEditorStateChange = (editorState) => {
	  this.setState({ editorState });
	};

	setEditorContent(editorText) {
	  const { htmleditorkey } = this.state;
	  this.setState({
	    htmleditorkey: htmleditorkey + 1,
	    editorText,
	    editorState: null,
	  });
	}

	getEditorText() {
	  const { editorState, editorText } = this.state;

	  if (editorState) {
	    return editorState.getCurrentContent().getPlainText('').trim() || '';
	  }

	  const contentBlock = htmlToDraft(editorText || '');
	  if (contentBlock) {
	    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
	    return contentState.getPlainText('').trim() || '';
	  }

	  return '';
	}

	loadDocument = async ({ doc_id: docId }) => {
	  const { getDocumentFile } = this.props;
	  this.setState({
	    isLoading: true,
	  });

	  const data = await getDocumentFile(docId);
	  if (data) {
	    await this.loadArrayBuffer(data);
	  }

	  this.setState({
	    isLoading: false,
	  });
	}

	loadArrayBuffer = async (arrayBuffer) => {
	  const { addActivity } = this.props;
	  const HTML = await mammoth.convertToHtml({ arrayBuffer });
	  this.setEditorContent(HTML.value);
	  addActivity(ACTIVITY_DT_DOCUMENT_OPENED, { document: removeHTMLImages(HTML) });
	}

	loadFile = async (file) => {
	  if (!file) return;

	  const arrayBuffer = await getFileAsArrayBuffer(file);
	  await this.loadArrayBuffer(arrayBuffer);
	};

	handleDownload = () => {
	  const { editorState } = this.state;
	  const { addActivity } = this.props;
	  if (!editorState?.getCurrentContent().getPlainText('').trim()) {
	    alert('Empty or unchanged document');
	    return;
	  }

	  const HTML = draftToHtml(convertToRaw(editorState.getCurrentContent()));

	  const DOCX = html2docx.asBlob(HTML);
	  const docName = window.prompt('Name of document')?.trim();

	  if (docName) {
	    downloadFile(`${docName.replace(/\.docx$/i, '')}.docx`, DOCX);

	    addActivity(ACTIVITY_DT_DOCUMENT_DOWNLOADED, { document: removeHTMLImages(HTML) });
	  } else {
	    alert('You must give the document a name');
	  }
	};

	handleNewFile = () => {
	  this.setEditorContent('');
	};

	handleOpenFile = () => {
	  this.fileSelector.click();
	};

	handleEditorTextChange = (editorText) => {
	  this.setState({ editorText });
	};

	render() {
	  const { isLoading, htmleditorkey, editorText } = this.state;
	  const { updateAskSyntheiaText, onAddClause } = this.props;
	  return (
			<div className="cst_content_main">
				<HTMLEditor
					key={`htmleditor-${htmleditorkey}`}
					defaultValue={editorText}
					onNewFile={this.handleNewFile}
					onOpenFile={this.handleOpenFile}
					onSaveFile={this.handleDownload}
					onChange={this.handleEditorTextChange}
					onEditorStateChange={this.handleEditorStateChange}
					onAskSyntheia={updateAskSyntheiaText}
					onAddClause={onAddClause}
				/>
				{
					isLoading
					&& (
						<div className="loader">
							<Loading />
						</div>
					)
				}
			</div>
	  );
	}
}
