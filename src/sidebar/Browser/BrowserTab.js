import React from 'react';
import moize from 'moize';
import _ from 'lodash';
import BrowseSearch from './BrowseSearch';
import { isArrayEmpty } from '../../shared/clientUtils';
import { convertDocumentBrowserFilterToCriteriaOptions } from '../../models/document';
import './BrowserTab.scss';
import BrowserResultList from './BrowserResultList';
import Loading from '../../components/Loading';
import {
  Checkbox, Stack
} from 'office-ui-fabric-react';

function clearFilter(filter) {
  return _.pickBy(filter, (v) => !_.isNil(v) && (!Array.isArray(v) || (v.length > 0)));
}

export default class BrowserTab extends React.PureComponent {

  constructor() {
    super();

    this.state = {
      isDisplayBrowserResultList: true,
    };

    this.displayBrowserResultList = this.displayBrowserResultList.bind(this)
  }

  convertFilterToCompactCriteriaOptions = moize.simple((filter) => {
    const { tagsIndexed } = this.props;
    return convertDocumentBrowserFilterToCriteriaOptions(tagsIndexed, filter);
  })

  getFilterOptions = moize.simple((filter, filterFields) => {
    let filterOptions = {};
    if (filterFields) {
      filterFields.forEach((prop) => {
        if (filter[prop]) {
          filterOptions[prop] = filter[prop];
        }
      });
    } else {
      filterOptions = { ...filter };
    }

    if (!Object.keys(filterOptions).length) {
      return [];
    }

    const { quick } = filterOptions;
    delete filterOptions.quick;
    const quickOptions = [];
    if (!isArrayEmpty(quick)) {
      quick.forEach((q) => {
        quickOptions.push({
          value: `quick_${q.toLowerCase()}`,
          label: `Quick: ${q}`,
        });
      });
    }

    return quickOptions.concat(this.convertFilterToCompactCriteriaOptions(filterOptions));
  });

  updateFilter = (filter) => {
    this.props.setSuggestionFilter({ ...this.props.filter, filter})
  };

  updateTitleFilter = (value) => {
    this.props.setTitleFilter(value)
  }

  handleSearch = async (filter) => {
    const { searchClauses, saveClauses, fetchBookmarks } = this.props;

    const copyFilter = clearFilter(filter);

    if (!Object.keys(filter).length) {
      copyFilter.most_recent = true;
    }
    var result = [];
    // if it is bookmarked we should searchClause all and filter bookmarked
    if (Object.keys(filter).includes("bookmarked") && filter.bookmarked === true) {
      await fetchBookmarks();

      const bookmarked_clauses = []
      for (let i = 0; i < this.props.bookmarks.length; i++) {
        bookmarked_clauses.push(this.props.bookmarks[i].clause)
      }

      result = [...bookmarked_clauses]
    }

    if (Object.keys(filter).includes('favourite') && filter.favourite === true) {
      let tempFilter = {
        "favourite": true,
      }
      let clauses_f = await searchClauses(tempFilter);

      if (clauses_f) {
        result = [...result, ...clauses_f];
      }
    }

    if (Object.keys(filter).includes('endorsed') && filter.endorsed === true) {
      let tempFilter = {
        "endorsed": true,
      }
      let clauses_e = await searchClauses(tempFilter);

      if (clauses_e) {
        result = [...result, ...clauses_e];
      }
    }
    
    result = result.filter(item => {
      if( this.props.titleFilter.length === 0 ) return true;
      let included = false;
      this.props.titleFilter.forEach(title => {
        if( item.title && item.title.toLowerCase().includes(title.toLowerCase()))
          included = true;
      })
      return included;
    })

    // Remove Duplicates   
    const resultDump = {};
    result.forEach(item => {
      if( !resultDump[item.clause_id] )
        resultDump[item.clause_id] = item
    });

    result = Object.keys(resultDump).map(clause_id => resultDump[clause_id])

    saveClauses(result);
  };

  _onChange(el, isChecked, name) {
    this.props.setClauseFilter({...this.props.filter, [name]: isChecked});
  }

  displayBrowserResultList() {
    if (!this.state.isDisplayBrowserResultList) {
      this.setState({ isDisplayBrowserResultList: true })
    }
  }

  render() {
    const {
      recentSearches,
      clauses,
      filter,
      titleFilter,
      isLoading,
      handleLoadClause,
      wasLoaded,
      workspaceId,
      workspaces,
      switchWorkspace,
    } = this.props;

    return (
      <div className="browser-tab">
        <div className="BrowseTitle">Collections</div>
        <Stack className="clause-checkboxes">
          <Checkbox className="clause-checkbox bookmarked" label="Bookmarked" data-value="bookmarked" checked={filter.bookmarked} onChange={(e, c) => this._onChange(e, c, 'bookmarked')}/>
          <Checkbox className="clause-checkbox favourite" label="Favourited" data-value="favourite" checked={filter.favourite} onChange={(e, c) => this._onChange(e, c, 'favourite')} />
          <Checkbox className="clause-checkbox endorsed" label="Endorsed" data-value="endorsed" checked={filter.endorsed} onChange={(e, c) => this._onChange(e, c, 'endorsed')} />
        </Stack>
        <BrowseSearch
          filter={filter}
          titleFilter={titleFilter}
          updateFilter={this.updateFilter}
          updateTitleFilter={this.updateTitleFilter}
          onSearch={this.handleSearch}
          displayBrowserResultList={this.displayBrowserResultList}
          type="clause"
          filterOptions={this.getFilterOptions(filter, null)}
          convertFilterToCompactCriteriaOptions={this.convertFilterToCompactCriteriaOptions}
          recentSearches={recentSearches}
          workspaceId={workspaceId}
          workspaces={workspaces}
          switchWorkspace={switchWorkspace}
          quickSearchPrefix="Browse clauses names for"
        />
        {this.state.isDisplayBrowserResultList && wasLoaded && <BrowserResultList items={clauses} handleLoadClause={handleLoadClause} />}

        {
          this.state.isDisplayBrowserResultList && isLoading && <Loading />
        }
      </div>
    );
  }
}
