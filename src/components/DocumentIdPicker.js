import React, { Component } from 'react';
import { TagPicker } from 'office-ui-fabric-react';
import { searchDocumentIds } from '../dataCalls/suggestions';

export default class DocumentIdPicker extends Component {
	picker = React.createRef();

	onResolveSuggestions = async (filterText, tagList) => {
	  const items = await searchDocumentIds({ filter: filterText });
	  return items
	    .map((item) => ({ key: item.doc_id, name: `${item.doc_id} ${item.doc_title}` }))
	    .filter((tag) => !this.listContainsDocument(tag, tagList));
	};

	listContainsDocument = (tag, tagList) => {
	  if (!tagList || !tagList.length || tagList.length === 0) {
	    return false;
	  }

	  return tagList.filter((compareTag) => compareTag.key === tag.key).length > 0;
	}

	render() {
	  const { onChange, ids, ...rest } = this.props;
	  return (
			<TagPicker
				onResolveSuggestions={this.onResolveSuggestions}
				componentRef={this.picker}
				onChange={onChange}
				inputProps={{
				  placeholder: ids && ids.length ? '' : 'Select a source document as filter',
				}}
				{...rest}
			/>
	  );
	}
}
