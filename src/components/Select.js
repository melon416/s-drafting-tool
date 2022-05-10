import React, { Component } from 'react';
import moize from 'moize';
import { TagPicker } from 'office-ui-fabric-react/lib/Pickers';

// from react-select
const trimString = (str) => str.replace(/^\s+|\s+$/g, '');

export const createFilter = (config) => (
  option,
  rawInput,
) => {
  const { ignoreCase, stringify, trim } = {
    ignoreCase: true,
    trim: true,
    ...config,
  };
  let input = trim ? trimString(rawInput) : rawInput;
  let candidate = trim ? trimString(stringify(option)) : stringify(option);
  if (ignoreCase) {
    input = input.toLowerCase();
    candidate = candidate.toLowerCase();
  }
  return candidate.indexOf(input) > -1;
};

export default class Select extends Component {
	pickerRef = React.createRef();

	filterOption = createFilter({
	  stringify: (option) => option.filter || option.name,
	});

	handleChange = (tags) => {
	  const { onChange } = this.props;
	  if (onChange) {
	    onChange(tags ? tags.map((t) => t.key) : null);
	  }
	};

	onFilterChanged = moize.simple((filterText, tagList) => {
	  const { single } = this.props;
	  if (single && this.pickerRef.current.items?.length) {
	    return [];
	  }

	  const { options, maxDisplayedItems } = this.props;
	  const result = [];

	  let optionIndex = 0;
	  const optionLength = options.length;
	  while ((result.length < maxDisplayedItems) && (optionIndex < optionLength)) {
	    if ((!filterText || this.filterOption(options[optionIndex], filterText)) && !this.isTagAlreadySelected(options[optionIndex], tagList)) {
	      result.push(options[optionIndex]);
	    }

	    optionIndex += 1;
	  }

	  return result;
	});

	onItemSelected = (item) => {
	  if (this.pickerRef.current && this.isTagAlreadySelected(item, this.pickerRef.current.items)) {
	    return null;
	  }
	  return item;
	};

	isTagAlreadySelected = (tag, tagList) => {
	  if (!tagList || !tagList.length || tagList.length === 0) {
	    return false;
	  }

	  return !!tagList.find((compareTag) => compareTag.key === tag.key);
	}

	render() {
	  const { value, placeholder, ...rest } = this.props;
	  const setProps = {};

	  if (placeholder && (!value || !value.length)) {
	    setProps.inputProps = { placeholder };
	  }

	  return (
			<TagPicker
				componentRef={this.pickerRef}
				selectedItems={value ? rest.options.filter((opt) => value.includes(opt.key)) : []}
				pickerSuggestionsProps={{
				  noResultsFoundText: 'No options',
				}}
				onResolveSuggestions={this.onFilterChanged}
				onEmptyResolveSuggestions={(tagList) => this.onFilterChanged('', tagList)}
				onItemSelected={this.onItemSelected}
				{...setProps}
				{...rest}
				onChange={this.handleChange}
			/>
	  );
	}
}

Select.defaultProps = {
  maxDisplayedItems: 50,
};
