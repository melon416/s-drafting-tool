import React, { Component } from 'react';
import SidebarTabs from './SidebarTabs';
import './Sidebar.css';
import { SIDEBAR_TAB_SUGGESTION_DETAIL, SIDEBAR_TAB_SUGGESTION_RESULT, SIDEBAR_TAB_BROWSER_RESULT,  SIDEBAR_TAB_BROWSER_DETAIL} from '../consts';
import SuggestionResultContainer from './Suggestion/SuggestionResultContainer';
import SuggestionDetailContainer from './Suggestion/SuggestionDetailContainer';

import BrowserResultContainer from './Browser/BrowserResultContainer';
import BrowserDetailContainer from './Browser/BrowserDetailContainer';

export default class Sidebar extends Component {
  renderSidebar() {
    const {
      sidebarTab, setSidebarTab, getDocumentText,
      showLogout, logout, handleLoadFile,
    } = this.props;
    if (sidebarTab === SIDEBAR_TAB_SUGGESTION_RESULT) {
      return <SuggestionResultContainer />;
    }

    if (sidebarTab === SIDEBAR_TAB_SUGGESTION_DETAIL) {
      return <SuggestionDetailContainer />;
    }

    if (sidebarTab === SIDEBAR_TAB_BROWSER_RESULT) {
      return <BrowserResultContainer />;
    }

    if (sidebarTab === SIDEBAR_TAB_BROWSER_DETAIL) {
      return <BrowserDetailContainer />;
    }

    return (
      <SidebarTabs
        setSidebarTab={setSidebarTab}
        sidebarTab={sidebarTab}
        getDocumentText={getDocumentText}
        showLogout={showLogout}
        logout={logout}
        handleLoadFile={handleLoadFile}
      />
    );
  }

  render() {
    return (
      <div className="SidebarInner">
        {this.renderSidebar()}
      </div>
    );
  }
}
