import React from 'react';
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
} from 'office-ui-fabric-react/lib/DetailsList';
import { IconButton } from 'office-ui-fabric-react';
import { formatDate } from '../../shared/date';

export default class DocumentList extends React.Component {
  fieldStyle = {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
  };

  columns = [
    {
      key: 'column1',
      name: '',
      fieldName: 'name',
      minWidth: 16,
      maxWidth: 16,
      onRender: (item) => (
        <IconButton
          title="Open document"
          iconProps={{ iconName: 'OpenInNewWindow' }}
          onClick={() => this.handleLoadFile(item)}
        />
      ),
    },
    {
      key: 'column2',
      name: 'Name',
      fieldName: 'name',
      minWidth: 200,
      maxWidth: 350,
      isRowHeader: true,
      isResizable: true,
      data: 'string',
      isPadded: true,
      onRender: (item) => <div id="documentResult" style={this.fieldStyle}>{item.doc_title ?? item.doc_file_name ?? `Document ${item.doc_id}`}</div>,
    },
    {
      key: 'column3',
      name: 'Date',
      fieldName: 'date',
      minWidth: 70,
      maxWidth: 90,
      isResizable: true,
      data: 'string',
      onRender: (item) => <div style={this.fieldStyle}>{item.doc_date ? formatDate(item.doc_date) : '[Unspecified]'}</div>,
      isPadded: true,
    },
  ];

  handleLoadFile = (item) => {
    const { handleLoadFile } = this.props;
    handleLoadFile(item);
  }

  render() {
    const { items } = this.props;

    return items.length > 0 ? (
      <DetailsList
        items={items}
        compact={false}
        columns={this.columns}
        selectionMode={SelectionMode.none}
        layoutMode={DetailsListLayoutMode.justified}
        isHeaderVisible
        styles={{ root: {height: '100%', overflow: 'hidden auto'}}}
      />
    ) : <div style={{ marginTop: '20px' }}>No Documents Found</div>;
  }
}
