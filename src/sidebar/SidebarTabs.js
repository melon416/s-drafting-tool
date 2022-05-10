import React, { Component } from 'react';
import Measure from 'react-measure';
import { PivotItem, Pivot } from 'office-ui-fabric-react/lib/Pivot';
import { Icon, IconButton, OverflowSet } from 'office-ui-fabric-react';
import SuggestionTabContainer from './Suggestion/SuggestionTabContainer';
import BrowserTabContainer from './Browser/BrowserTabContainer';
import { LayoutRow, LayoutRows } from '../shared/components/Layout';
import AddClauseTabContainer from './AddClause/AddClauseTabContainer';
import ChecklistTabContainer from './Checklist/ChecklistTabContainer';
import LoadTabContainer from './Load/LoadTabContainer';
import {
  SIDEBAR_TAB_ADD_CLAUSE,
  SIDEBAR_TAB_CHECKLIST,
  SIDEBAR_TAB_LOAD,
  SIDEBAR_TAB_SUGGEST,
  SIDEBAR_TAB_BROWSE,
  SIDEBAR_TAB_OVERFLOW_THRESHOLD,
} from '../consts';

class SidebarTabs extends Component {
	state = {
	  isShrink: false,
	}

	handleResize = ({ bounds: { width } }) => {
	  this.setState({
	    isShrink: width < SIDEBAR_TAB_OVERFLOW_THRESHOLD,
	  });
	}

	renderOverflowButton = (items) => (
    <IconButton
      role="menuitem"
      title="Tabs"
      styles={{ root: { marginTop: '5px', marginBottom: '-10px' } }}
      menuIconProps={{ iconName: 'More' }}
      menuProps={{ items }}
    />
	)

	renderLoadTab = () => {
	  const { handleLoadFile } = this.props;
	  return (
      <div className="SidebarTab LoadTab">
        <LoadTabContainer handleLoadFile={handleLoadFile} />
      </div>
	  );
	}

	renderSuggestionTab = () => {
	  const { getDocumentText } = this.props;
	  return (
      <div className="SidebarTab SuggestionTab">
        <SuggestionTabContainer getDocumentText={getDocumentText} />
      </div>
	  );
	}

  renderBrowseTab = () => {
    return (
      <div className="SidebarTab BrowserTab">
        <BrowserTabContainer />
      </div>
    )
  }

	renderAddClauseTab = () => (
    <div className="SidebarTab" style={{ overflow: 'auto' }}>
      <AddClauseTabContainer />
    </div>
	)

	renderChecklistTab = () => (
    <div className="SidebarTab">
      <ChecklistTabContainer />
    </div>
	)

	render() {
	  const {
	    sidebarTab, showLogout, logout, setSidebarTab,
	  } = this.props;
	  const { isShrink } = this.state;

	  return (
      <Measure bounds onResize={this.handleResize}>
        {({ measureRef }) => (
          <div ref={measureRef} style={{ width: '100%' }}>
            <LayoutRows className="cst-tabs-main">
              <LayoutRow
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {
                  isShrink
                    ? (
                      <OverflowSet
                        items={[]}
                        overflowItems={[
                          { // TODO: In this part, I decided to hide Load tab on Office screen. So shrink mode load menu is not needed at this moment.
                          	key: SIDEBAR_TAB_LOAD,
                          	name: 'Load',
                          	onClick: () => this.props.setSidebarTab(SIDEBAR_TAB_LOAD),
                          },
                          {
                            key: SIDEBAR_TAB_SUGGEST,
                            name: 'Suggest',
                            onClick: () => setSidebarTab(SIDEBAR_TAB_SUGGEST),
                          },
                          {
                            key:SIDEBAR_TAB_BROWSE,
                            name: 'Browse',
                            onClick: () => setSidebarTab(SIDEBAR_TAB_BROWSE),
                          },
                          {
                            key: SIDEBAR_TAB_ADD_CLAUSE,
                            name: 'Add Clause',
                            onClick: () => setSidebarTab(SIDEBAR_TAB_ADD_CLAUSE),
                          },
                          {
                            key: SIDEBAR_TAB_CHECKLIST,
                            name: 'Checklist',
                            onClick: () => setSidebarTab(SIDEBAR_TAB_CHECKLIST),
                          },
                        ]}
                        onRenderOverflowButton={this.renderOverflowButton}
                      />
                    )
                    : (
                      <div id="syntheiaTabs">
                        <Pivot
                          selectedKey={sidebarTab}
                          onLinkClick={(item) => setSidebarTab(item.props.itemKey)}
                          headersOnly
                        >
                          <PivotItem headerText="Load" itemKey={SIDEBAR_TAB_LOAD} />
                          <PivotItem headerText="Suggest" itemKey={SIDEBAR_TAB_SUGGEST} />
                          <PivotItem headerText="Browse" itemKey={SIDEBAR_TAB_BROWSE} />
                          <PivotItem headerText="Add Clause" itemKey={SIDEBAR_TAB_ADD_CLAUSE} />
                          <PivotItem headerText="Checklist" itemKey={SIDEBAR_TAB_CHECKLIST} />
                        </Pivot>
                      </div>
                    )
                }
                <div style={{ flexGrow: 1 }} />
                {showLogout && (
                <Icon
                  onClick={logout}
                  style={{ cursor: 'pointer', marginRight: 20, marginTop: isShrink ? "10" : "0"}}
                  iconName="Leave"
                  title="Logout"
                />
                )}
              </LayoutRow>

              {sidebarTab === SIDEBAR_TAB_LOAD && <LayoutRow flexible>{this.renderLoadTab()}</LayoutRow>}
              {sidebarTab === SIDEBAR_TAB_SUGGEST && <LayoutRow flexible>{this.renderSuggestionTab()}</LayoutRow>}
              {sidebarTab === SIDEBAR_TAB_BROWSE && <LayoutRow flexible>{this.renderBrowseTab()}</LayoutRow>}
              {sidebarTab === SIDEBAR_TAB_ADD_CLAUSE && <LayoutRow flexible scrolling>{this.renderAddClauseTab()}</LayoutRow>}
              {sidebarTab === SIDEBAR_TAB_CHECKLIST && <LayoutRow flexible scrolling>{this.renderChecklistTab()}</LayoutRow>}

            </LayoutRows>
          </div>
        )}
      </Measure>
	  );
	}
}

export default SidebarTabs;
