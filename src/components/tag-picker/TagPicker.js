/**
 *  TagPicker is wrapper for fluentUI tag Picker
 */

/**
 * Change-Log:
 * - 6/5/2022, Attia, update component when tags change
 */
import React, { Component } from 'react';
import { Label, TagPicker } from 'office-ui-fabric-react';
import './TagPicker.css';
import moize from 'moize';
import _ from 'lodash';

const getValue = moize.simple((options, value) => options.find((option) => option.key === value));

export class TagPickerCreatable extends Component {
	picker = React.createRef();

    shouldComponentUpdate(nextProps) {
        const {value, showErrorDetails, error, options} = this.props;

        return !_.isEqual(value, nextProps.value)
            || !_.isEqual(error, nextProps.error)
            || !_.isEqual(showErrorDetails, nextProps.showErrorDetails)
            || !_.isEqual(options, nextProps.options);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        const existingMatches = this.props.options.map((o) => ({name: o.name, key: o.key}))
        const filterText = this.picker.current.input.current._value


        this.picker.current.updateSuggestions(existingMatches.some((a) => a.name.toLowerCase() === filterText.toLowerCase())
            ? existingMatches
            : [{key: filterText, name: `Create ${filterText}`, isNewItem: true}].concat(existingMatches))

    }

	onChange = (values) => {
	  const { onChange } = this.props;
	  onChange(values.map((v) => v.key));
	}

	onRenderSuggestionsItem = (props) => (
  <div className={props.isNewItem ? 'newItem' : 'existingItem'} key={props.key}>
    {props.name}
  </div>
	);

	onResolveSuggestions = async (filterText, tagList) => {
	  const { options, creatable } = this.props;
	  const existingMatches = filterText
	    ? options
	      .filter((o) => (o.label || o.name).toLowerCase().includes(filterText.toLowerCase()))
	      .map((o) => ({ name: (o.label || o.name), key: o.key }))
	      .filter((tag) => !this.listContainsDocument(tag, tagList))
	    : [];

	  if (!creatable) return existingMatches;

	  return existingMatches.some((a) => a.name.toLowerCase() === filterText.toLowerCase())
	    ? existingMatches
	    : [{ key: filterText, name: `Create ${filterText}`, isNewItem: true }].concat(existingMatches);
	};

	onItemSelected = (item) => {
	  const copy = { ...item };
	  if (item && item.isNewItem) {
	    copy.name = item.name.replace('Create ', '');
	  }
	  return copy;
	};

	listContainsDocument = (tag, tagList) => {
	  if (!tagList || !tagList.length || tagList.length === 0) {
	    return false;
	  }

	  return (
	    tagList.filter((compareTag) => compareTag.key === tag.key).length > 0
	  );
	}

	render() {
	  const {
	    options, value, showErrorDetails, error, label,
	  } = this.props;

	  let errorDetail;

	  if (showErrorDetails && error) {
	    errorDetail = <div className="EditFieldErrorDetail">{error}</div>;
	  }

	  const pickerValue = (value || []).map((v) => {
	    const o = getValue(options, v);
	    if (!o) return { name: v, key: v };
	    return {
	      name: (o.label || o.name), key: o.key,
	    };
	  });

	  return (
			<>
				{label && <Label>{label}</Label>}
				<TagPicker
					onResolveSuggestions={this.onResolveSuggestions}
					selectedItems={pickerValue}
					componentRef={this.picker}
					onRenderSuggestionsItem={this.onRenderSuggestionsItem}
					onItemSelected={this.onItemSelected}
					{...this.props}
					onChange={this.onChange}
				/>
				{errorDetail}
			</>
	  );
	}
}
