import React, { Component, Fragment } from 'react';
import moize from 'moize';
import _ from 'lodash';
import SelectCreatable from './SelectCreatable';
import { isArrayEmpty } from '../../shared/clientUtils';
import { omit } from '../../utils';

function mergeFilters(filter1, filter2) {
  // eslint-disable-next-line consistent-return
  return _.mergeWith({ ...filter1 }, filter2, (objValue, srcValue) => {
    if (Array.isArray(objValue) && Array.isArray(srcValue)) {
      return _.uniqBy(objValue.concat(srcValue), (x) => String(x).toLowerCase());
    }
  });
}

export default class QuickSearchInput extends Component {
	defaultStaticSearches = [
	  { filter: { most_recent: true } },
	  { filter: { recently_viewed: true } },
	  { filter: { endorsed: true } },
	];

	selectRef = React.createRef();

	getValue = moize.simple((filterOptions) => filterOptions.map((fo) => fo.value));

	getOptions = moize.simple((staticSearches, recentSearches, filterOptions) => {
	  const { convertFilterToCompactCriteriaOptions } = this.props;
	  const result = [...filterOptions];

	  if (!isArrayEmpty(staticSearches)) {
	    result.push({
	      label: 'Default Searches',
	      options: staticSearches.map((f) => ({ ...f, label: this.convertCriteriaOptionsToText(convertFilterToCompactCriteriaOptions(f.filter)) })),
	    });
	  }

	  if (!isArrayEmpty(recentSearches)) {
	    result.push({
	      label: 'Your Recent Searches',
	      options: recentSearches.map((f) => ({ ...f, label: this.convertCriteriaOptionsToText(convertFilterToCompactCriteriaOptions(f.filter)) })),
	    });
	  } else {
	    result.push({
	      label: 'Your Recent Searches',
	      options: [{ label: 'None', disabled: true }],
	    });
	  }

	  return result;
	});

	convertCriteriaOptionsToText = (options) => options.map((o, i) => (
		<Fragment key={i}>
			{!!i && ' and '}
			{o.label}
		</Fragment>
	))

	isOptionDisabled = (option) => option.disabled;

	isValidNewOption = (inputValue) => inputValue !== '';

	formatGroupLabel = (group) => (
  <div style={{ display: 'flex' }}>
    <span style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}><hr style={{ width: '100%' }} /></span>
    <span style={{ marginLeft: 5, marginRight: 5 }}>{group.label}</span>
    <span style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}><hr style={{ width: '100%' }} /></span>
  </div>
	);

	focusNewOption = () => {
	  setTimeout(() => {
	    // eslint-disable-next-line no-underscore-dangle
	    if (this.selectRef.current && (!this.selectRef.current.select.select.state.focusedOption || !this.selectRef.current.select.select.state.focusedOption.__isNew__)) {
	      this.selectRef.current.select.select.setState({ focusedOption: this.selectRef.current.select.select.props.options[0] });
	    }
	  }, 1);

	  return undefined;
	};

	handleSelect = (options, meta) => {
	  const { filter, updateFilter } = this.props;
	  let m;
	  switch (meta.action) {
	    case 'select-option':
	      updateFilter(mergeFilters(filter, meta.option.filter));
	      break;
	    case 'pop-value':
	    case 'remove-value':
	      if (meta.removedValue) {
	        m = String(meta.removedValue.value).match(/^quick_(.+)$/);
	        if (m) {
	          updateFilter({ ...filter, quick: filter.quick.filter((q) => String(q).toLowerCase() !== m[1]) });
	        } else {
	          updateFilter(omit(filter, [meta.removedValue.value]));
	        }
	      }
	      break;
	    case 'clear':
	      updateFilter({});
	      break;
	    case 'create-option':
	      updateFilter(mergeFilters(filter, { quick: [meta.option.value] }));
	      break;
	    default:
	      throw new Error(JSON.stringify(meta));
	  }
	};

	render() {
	  const {
	    autoFocus, type, recentSearches, filterOptions, searchPrefix,
	  } = this.props;
	  return (
			<SelectCreatable
				placeholder={`Search for ${type}...`}
				valueIsOptions
				options={this.getOptions(this.defaultStaticSearches, recentSearches, filterOptions)}
				value={this.getValue(filterOptions)}
				filterOption={() => true}
				isValidNewOption={this.isValidNewOption}
				createOptionPosition="first"
				formatCreateLabel={(value) => `${searchPrefix} "${value}"`}
				formatGroupLabel={this.formatGroupLabel}
				onChange={this.handleSelect}
				className="SelectSearchIcon"
				autoFocus={autoFocus}
				selectRef={this.selectRef}
				onInputChange={this.focusNewOption}
				isClearable
				isMulti
				isOptionDisabled={this.isOptionDisabled}
			/>
	  );
	}
}
