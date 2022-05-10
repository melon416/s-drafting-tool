import React, { Component } from 'react';
import {
  Dropdown, PrimaryButton, ResponsiveMode,
} from 'office-ui-fabric-react';
import QuickSearchInput from './QuickSearchInput';

class QuickSearch extends Component {
	search = () => {
	  const { filter, onSearch } = this.props;
	  onSearch(filter);
	};

  handleSwitchWorkspace = (e, selectedOption) => {
    const { switchWorkspace } = this.props;
    switchWorkspace(selectedOption.id);
  };

  render() {
	  const {
	    filterOptions,
	    type,
	    convertFilterToCompactCriteriaOptions,
	    recentSearches,
	    updateFilter,
	    filter,
	    quickSearchPrefix,
      workspaceId,
      workspaces,
	  } = this.props;
	  return (
      <>
        <div style={{ marginTop: 10 }} id="syntheiaQuickSearchInput" > 
          <QuickSearchInput
            filter={filter}
            filterOptions={filterOptions}
            autoFocus
            convertFilterToCompactCriteriaOptions={convertFilterToCompactCriteriaOptions}
            type={type}
            recentSearches={recentSearches}
            updateFilter={updateFilter}
            searchPrefix={quickSearchPrefix}
          />
        </div>
        <div className="ButtonBar tabThree_buttons_main" id="syntheiaWorkspaceSelector">
          <PrimaryButton
            text="Search"
            onClick={this.search}
            style={{ marginRight: 20, width: '50%' }}
          />
          <Dropdown
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
      </>
	  );
  }
}

export default QuickSearch;
