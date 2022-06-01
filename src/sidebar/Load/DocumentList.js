import React from 'react';
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
} from 'office-ui-fabric-react/lib/DetailsList';
import { IconButton } from 'office-ui-fabric-react';
import { formatDatePlain } from '../../shared/date';

export default class DocumentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortField: '',
      isSortedDescending: true
    }
  }

  fieldStyle = {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
  };

  handleLoadFile = (item) => {
    const { handleLoadFile } = this.props;
    handleLoadFile(item);
  }

  render() {
    const { items } = this.props;
    const columns = [
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
        minWidth: 120,
        maxWidth: 900,
        isRowHeader: true,
        isResizable: true,
        data: 'string',
        isSorted: this.state.sortField === "Name",
        isSortedDescending: this.state.isSortedDescending,
        isPadded: true,
        onColumnClick : () => { // when the Name is clicked
          if( this.state.sortField === "Name" ) {
            this.setState({ isSortedDescending: !this.state.isSortedDescending });
          }
          else {
            this.setState({ sortField: "Name", isSortedDescending: true });
          }
        },
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
        isSorted: this.state.sortField === "Date",
        isSortedDescending: this.state.isSortedDescending,
        onColumnClick : () => {  // When the Date is clicked
          if( this.state.sortField === "Date" ) {
            this.setState({ isSortedDescending: !this.state.isSortedDescending });
          } 
          else {
            this.setState({ sortField: "Date", isSortedDescending: true });
          }
        },
        onRender: (item) => <div style={this.fieldStyle}>{item.doc_date ? formatDatePlain(item.doc_date) : '[Unspecified]'}</div>,
        isPadded: true,
      },
    ];

    if (this.state.sortField !== "") { // sort items by Name and Date
      items.sort((a, b) => {
        const sortOrder = this.state.isSortedDescending ? 1 : -1;
        if ( this.state.sortField === "Name" ) {
          const aName = (a.doc_file_name).toLowerCase();
          const bName = (b.doc_file_name).toLowerCase();
          if ( aName > bName ) return 1 * sortOrder;
          if ( aName < bName ) return -1 * sortOrder;
        }
        if (this.state.sortField === "Date") {
          return (Date.parse(a.doc_date) - Date.parse(b.doc_date)) * sortOrder;
        }
        return 0;
      })
    }

    return items.length > 0 ? (
      <DetailsList
        items={items}
        compact={false}
        columns={columns}
        selectionMode={SelectionMode.none}
        layoutMode={DetailsListLayoutMode.justified}
        isHeaderVisible
        styles={{ root: {height: '100%', overflow: 'hidden auto'}}}
      />
    ) : <div style={{ marginTop: '20px' }}>No Documents Found</div>;
  }
}
