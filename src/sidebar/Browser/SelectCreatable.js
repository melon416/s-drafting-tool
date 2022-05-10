import React, { Component } from 'react';
import { defaultTheme, createFilter, components } from 'react-select';
import ReactCreatableSelect from 'react-select/creatable';
import moize from 'moize';

defaultTheme.borderRadius = 0;
defaultTheme.spacing.baseUnit = 2;
defaultTheme.spacing.menuGutter = 2;
defaultTheme.spacing.controlHeight = 26;
defaultTheme.colors.primary = '#CC3333';
defaultTheme.colors.primary25 = '#FF8C8C';
defaultTheme.colors.primary50 = '#FF8C8C';

const customStyles = {
  control: (provided) => ({
    ...provided,
    borderColor: 'rgb(96, 94, 92)',
    borderRadius: '2px',
    minHeight: 40,
    boxShadow: null,
    '&:hover': {
      borderColor: 'rgb(50, 49, 48)',
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: 'rgb(90, 88, 86)',
    top: '56%',
  }),
  input: (provided) => ({
    ...provided,
    height: 26,
  }),
  option: (provided, { isDisabled }) => ({
    ...provided,
    color: isDisabled ? '#a0aabe' : '#333333',
  }),
  singleValue: (provided) => ({
    ...provided,
    top: '56%',
  }),
  singleValueLabel: (provided) => ({
    ...provided,
    whiteSpace: 'normal',
    fontSize: 14,
  }),
  multiValue: (provided) => ({
    ...provided,
    top: '56%',
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    whiteSpace: 'normal',
    fontSize: 14,
    height: 25,
    color: '#929292',
  }),
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 1999999999999999,
  }),
};

export class MultiValueRemoveCustom extends Component {
  render() {
    const { children, innerProps } = this.props;
    return <div {...innerProps}>{children || <components.CrossIcon size={18} />}</div>;
  }
}

const customComponents = {
  MultiValueRemove: MultiValueRemoveCustom,
};

function triggerChange(originValue, {
  onChange, isMulti, valueIsOptions, onOptionChange,
}, meta) {
  if (onOptionChange) {
    onOptionChange(originValue, meta);
  }

  if (!onChange) {
    return;
  }

  let value;

  if (originValue && !valueIsOptions) {
    if (isMulti) {
      value = originValue.map((o) => o.value);
    } else {
      value = originValue.value;
    }
  }

  onChange(value, meta);
}

export default class SelectCreatable extends Component {
	filterOption = createFilter({
	  ignoreAccents: false,
	});

	handleCreateOption = (string) => {
	  if ((string === null) || (string === undefined) || (string.trim() === '')) {
	    return;
	  }

	  const { value, isMulti, options } = this.props;

	  const newOption = {
	    label: string.trim(),
	    value: string.trim(),
	  };

	  const meta = { action: 'create-option', option: newOption };
	  if (isMulti) {
	    if (Array.isArray(value)) {
	      if (!value.includes(newOption.value)) {
	        let { options: newOptions } = this.getValueAndOptions(options, value, isMulti);
	        newOptions = newOptions.filter((opt) => value.includes(opt.value));
	        newOptions.push(newOption);
	        this.handleChange(newOptions, meta);
	      }
	    } else {
	      this.handleChange([newOption], meta);
	    }
	  } else {
	    this.handleChange(newOption, meta);
	  }
	};

	handleBlur = (event) => {
	  const { onCreateOption } = this.props;
	  (onCreateOption || this.handleCreateOption)(event.target.value);
	};

	getValueAndOptions = moize.simple((originOptions, value, isMulti) => {
	  const options = [...(originOptions || [])];

	  function findOrAddOption(value) {
	    if ((value === null) || (value === undefined)) {
	      return null;
	    }
	    return options.find((option) => option.value === value)
				|| options[options.push({ value, label: value }) - 1];
	  }

	  if (isMulti) {
	    return {
	      value: (value || []).map((v) => findOrAddOption(v)),
	      options,
	    };
	  }

	  return {
	    value: findOrAddOption(value),
	    options,
	  };
	});

	handleChange = (value, meta) => {
	  triggerChange(value, this.props, meta);
	};

	render() {
	  const {
	    value, options, selectRef, ...rest
	  } = this.props;

	  return (
      <ReactCreatableSelect
        filterOption={this.filterOption}
        components={customComponents}
        styles={customStyles}
        menuPortalTarget={document.body}
        {...this.getValueAndOptions(options, value, rest.isMulti)}
        menuPosition="fixed"
        onCreateOption={this.handleCreateOption}
        ref={selectRef}
        {...rest}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
      />
	  );
	}
}
