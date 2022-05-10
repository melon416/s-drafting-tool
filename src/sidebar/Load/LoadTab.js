import React from 'react';
import moize from 'moize';
import _ from 'lodash';
import QuickSearch from './QuickSearch';
import { isArrayEmpty } from '../../shared/clientUtils';
import { convertDocumentFilterToCriteriaOptions } from '../../models/document';
import './LoadTab.scss';
import DocumentList from './DocumentList';
import Loading from '../../components/Loading';

function clearFilter(filter) {
  return _.pickBy(filter, (v) => !_.isNil(v) && (!Array.isArray(v) || (v.length > 0)));
}

export default class LoadTab extends React.PureComponent {
  state = {
    filter: {},
  };

  convertFilterToCompactCriteriaOptions = moize.simple((filter) => {
    const { tagsIndexed } = this.props;
    return convertDocumentFilterToCriteriaOptions(tagsIndexed, filter);
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
    this.setState({ filter });
  };

  handleSearch = (filter) => {
    const { searchDocuments } = this.props;
    const copyFilter = clearFilter(filter);

    if (!Object.keys(filter).length) {
      copyFilter.most_recent = true;
    }

    searchDocuments(copyFilter);
  };

  render() {
    const {
      recentSearches,
      documents,
      isLoading,
      handleLoadFile,
      wasLoaded,
      workspaceId,
      workspaces,
      switchWorkspace,
    } = this.props;
    const { filter } = this.state;

    return (
      <div className="load-tab">
        <QuickSearch
          filter={filter}
          updateFilter={this.updateFilter}
          onSearch={this.handleSearch}
          type="documents"
          filterOptions={this.getFilterOptions(filter, null)}
          convertFilterToCompactCriteriaOptions={this.convertFilterToCompactCriteriaOptions}
          recentSearches={recentSearches}
          workspaceId={workspaceId}
          workspaces={workspaces}
          switchWorkspace={switchWorkspace}
          quickSearchPrefix="Search document names, IDs and types for"
        />
        { wasLoaded && <DocumentList items={documents} handleLoadFile={handleLoadFile} />}
        {
          isLoading && <Loading />
        }
      </div>
    );
  }
}
