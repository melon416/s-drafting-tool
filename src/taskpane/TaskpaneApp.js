/* eslint-disable camelcase */
/* global Office, Word */
import 'office-ui-fabric-react/dist/css/fabric.min.css';
import React, { Component } from 'react';
import Loading from '../components/Loading';
import '../globalstyle';
import LoginContainer from '../components/LoginContainer';
import SidebarContainer from '../sidebar/SidebarContainer';
import { SIDEBAR_TAB_ADD_CLAUSE } from '../consts';

export default class TaskpaneApp extends Component {
	state = {
	  isOfficeInitialized: false,
	  checkedLoggedIn: false,
	};

	async componentDidMount() {
	  const urlParams = new URLSearchParams(window.location.search);
	  const {
	    setSidebarTab, clearSuggestions, setSuggestionSearchExtraText,
	    setSuggestionSearchText, setAddClauseText, requestAppContext,
	  } = this.props;

	  Office.onReady(async () => {
	    const selectedText = await this.getSelectedText();

	    switch (urlParams.get('tab')) {
	      case SIDEBAR_TAB_ADD_CLAUSE:
	        setSidebarTab(SIDEBAR_TAB_ADD_CLAUSE);
	        break;
	      default:
	        clearSuggestions();
	        setSuggestionSearchExtraText('');
	    }

	    setSuggestionSearchText(selectedText);
	    setAddClauseText(selectedText);

	    this.setState({ isOfficeInitialized: true });
	  });

	  try {
	    await requestAppContext();
	  } finally {
	    this.setState({ checkedLoggedIn: true });
	  }
	}

	getDocumentText = async () => Word.run(async (context) => {
	  const { paragraphs } = context.document.body;

	  context.load(paragraphs, 'text');
	  await context.sync();

	  return paragraphs.items.map((p) => p.text).join('\n');
	});

	getSelectedText = async () => new Promise((resolve) => {
		console.log("Here is selected text:");
	    Office.context.document.getSelectedDataAsync(Office.CoercionType.Html, (asyncResult) => {
	      if (asyncResult.status !== Office.AsyncResultStatus.Failed) {
	        resolve(this.getTextFromHtml(asyncResult.value));
	      } else {
	        resolve('');
	      }
	    });
	  })

	getTextFromHtml = (val) => {
		let span = document.createElement('span');
		span.innerHTML = val;
		let contentDiv = span.getElementsByClassName("WordSection1")
		return contentDiv[0].textContent.replace(/^\s+|\s+$/g, '') || contentDiv[0].innerText.replace(/^\s+|\s+$/g, '');
  	}

	arrayBufferToBase64 = (bytes) => {
	  let binary = '';
	  const len = bytes.byteLength;
	  for (let i = 0; i < len; i += 1) {
	    binary += String.fromCharCode(bytes[i]);
	  }
	  return window.btoa(binary);
	}

	handleLoadFile = async ({ doc_id }) => {
	  const { getDocumentFile } = this.props;
	  const data = await getDocumentFile(doc_id);

	  if (data) {
	    Word.run((context) => {
	      let binary = '';
	      const len = data.byteLength;
	      for (let i = 0; i < len; i += 1) {
	        binary += String.fromCharCode(data[i]);
	      }
	      const base64String = window.btoa(binary);
	      const myNewDoc = context.application.createDocument(base64String);
	      context.load(myNewDoc);

	      return context.sync()
	        .then(() => {
	          myNewDoc.open();
	          context.sync();
	        })
	        .catch((myError) => {
	          console.log(myError);
	        });
	    })
	      .catch((myError) => {
	        console.log(myError);
	      });
	  }
	}

	render() {
	  const { isLoggedIn } = this.props;
	  const { checkedLoggedIn, isOfficeInitialized } = this.state;

	  if (!isLoggedIn) {
	    if (checkedLoggedIn) {
	      return <LoginContainer />;
	    }

	    return <Loading />;
	  }

	  if (!isOfficeInitialized) {
	    return <Loading />;
	  }

	  return (
			<SidebarContainer
				handleLoadFile={this.handleLoadFile}
				getDocumentText={this.getDocumentText}
				showLogout
			/>
	  );
	}
}
