  /**
   *  BrowserResultList.js
   *  Author:
   *  Created:
   */
  
  /**
   * Change-Log:
   * - 2022-05-25, Wang, Move arrow button a little left
   */


import React from 'react';
import {
    DetailsList,
    DetailsListLayoutMode,
    SelectionMode
} from 'office-ui-fabric-react/lib/DetailsList';
import { IconButton } from 'office-ui-fabric-react';

export default class BrowserResultList extends React.Component {
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
    // justifyContent: "center",
  };

  handleLoadFile = (item) => {
    const { handleLoadClause } = this.props;
    const selectedClauseText = [];

    this.props.items.forEach(each => {
      if(each.title === item.title) {
        selectedClauseText.push(each)
      }
    });

    handleLoadClause(selectedClauseText) 
  }

  render() {
    const { items } = this.props;
    const data = {};
    const types = [];
    const columns = [
      {
        key: 'column2',
        name: 'Clause Name',                                                                                                                              
        fieldName: 'name',
        minWidth: 120,
        maxWidth: 900,
        isRowHeader: true,
        isResizable: true,
        data: 'string',
        isSorted: this.state.sortField === "Clause Name",
        isSortedDescending: this.state.isSortedDescending,
        isPadded: true,
        onColumnClick : () => {
          if( this.state.sortField === "Clause Name" ) {
            this.setState({ isSortedDescending: !this.state.isSortedDescending });
          } 
          else {
            this.setState({ sortField: "Clause Name", isSortedDescending: true });
          }
        },
        onRender: (item) => <div style={this.fieldStyle}>{item.title ?? "(Unnamed clauses)" }</div>,
      },
      {
        key: 'column3',
        name: 'Count',
        fieldName: 'count',
        minWidth: 40,
        maxWidth: 60,
        isResizable: true,
        data: 'string',
        isSorted: this.state.sortField === "Count",
        isSortedDescending: this.state.isSortedDescending,
        onColumnClick : () => {
          if( this.state.sortField === "Count" ) {
            this.setState({ isSortedDescending: !this.state.isSortedDescending });
          } 
          else {
            this.setState({ sortField: "Count", isSortedDescending: true });
          }
        },
        onRender: (item) => <div style={this.fieldStyle}>{item.count}</div>,
        isPadded: true,
      },
      {
        key: 'column1',
        name: '',
        fieldName: 'name',
        minWidth: 20,
        maxWidth: 20,
        onRender: (item) => (
          <IconButton
            title="Open Clauses"
            iconProps={{ iconName: 'ChromeBackMirrored' }}
            onClick={() => this.handleLoadFile(item)}
            style={{marginLeft: "-7px"}}
          />
        ),
      },
    ];

    items.forEach(item => {
      if( !data[item.title] ) {
        types.push({...item, count: 1});
        data[item.title] = true;
      } else {
        types.filter(i => i.title === item.title)[0].count ++;
      }
    });

    if( this.state.sortField !== "" ) {
      types.sort((a, b) => {
        const sortOrder = this.state.isSortedDescending ? 1 : -1;
        if( this.state.sortField === "Clause Name" ) {
          const aClauseName = (a.title == null ? "(Unnamed clauses)" : a.title).toLowerCase();
          const bClauseName = (b.title == null ? "(Unnamed clauses)" : b.title).toLowerCase();
          if( aClauseName > bClauseName ) return 1 * sortOrder;
          if( aClauseName < bClauseName ) return -1 * sortOrder;
        }
        if( this.state.sortField === "Count" ) {
          return (a.count - b.count) * sortOrder;
        }
        return 0;
      })
    }
    
    return types.length > 0 ? (
      <DetailsList
        items={types}
        compact={false}
        columns={columns}
        selectionMode={SelectionMode.none}
        layoutMode={DetailsListLayoutMode.justified}
        isHeaderVisible
        styles={{ root: {height: '100%', overflow: 'hidden auto'}}}
      />
    ) : <div style={{ marginTop: '20px' }}>There are no results in your collection. Please add clauses to your collection.</div>;
  }
}