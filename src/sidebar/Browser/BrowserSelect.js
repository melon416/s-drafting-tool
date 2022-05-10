import React, { Component } from 'react';
import { TagPicker } from 'office-ui-fabric-react';

export default class BrowserSelect extends Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }

    picker = React.createRef();

    onResolveSuggestions = (filterText, tagList) => [{
        key: `Title: ${filterText}`, name: `Title: ${filterText}`,
    }].filter((tag) => !this.listContainsDocument(tag, tagList));

    listContainsDocument = (tag, tagList) => {
        if (!tagList || !tagList.length || tagList.length === 0) {
            return false;
        }

        return tagList.filter((compareTag) => compareTag.key === tag.key).length > 0;
    }

    render() {
        const { onChange, ...rest } = this.props;

        return <TagPicker
            onResolveSuggestions={this.onResolveSuggestions}
            componentRef={this.picker}
            onChange={onChange}
            inputProps={{
                placeholder: this.props.count > 0 ? '' : '(optional) Filter clauses by name',
            }}
            {...rest}
        />;
    }
}