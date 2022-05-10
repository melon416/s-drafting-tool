import React, { Component } from 'react';
import {
  Dropdown, PrimaryButton, ResponsiveMode,
} from 'office-ui-fabric-react';
import BrowserSelect from './BrowserSelect';

class BrowseSearch extends Component {
  search = () => {
    const { filter, onSearch, displayBrowserResultList } = this.props;
    displayBrowserResultList();
    onSearch(filter);
  };

  handleSwitchWorkspace = (e, selectedOption) => {
    const { switchWorkspace } = this.props;
    switchWorkspace(selectedOption.id);
  };

  mergeFilter = (values) => {
    this.props.updateTitleFilter(values)
  };

  render() {
    const {
      filter,
      titleFilter,
      workspaceId,
      workspaces,
    } = this.props;

    var checkDisable = filter.bookmarked | filter.favourite | filter.endorsed;

    return (
      <>
        <div style={{ marginTop: 10 }}>
          <BrowserSelect
            onChange={(tags) => {
              this.mergeFilter(tags.filter((tag) => {
                if( tag.name.startsWith('Title:')) return true;
                return false;
              }).map((tag) => tag.name.substr(7)))
            }}
            count={titleFilter ? titleFilter.length : 0}
            defaultSelectedItems={titleFilter.map(title => ({ key: title, name: 'Title:' + title }))}
            className="SelectSearchIcon"
          />
        </div>
        <div className="ButtonBar tabThree_buttons_main" style={{ marginTop: 10 }}>
          <PrimaryButton
            text="Browse"
            disabled={!checkDisable}
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

export default BrowseSearch;