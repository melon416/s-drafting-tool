  /**
   *  BrowserResultList.js
   *  Author:
   *  Created:
   */
  
  /**
   * Change-Log:
   * - 2022-05-25, Wang, Move arrow button a little left
   * - 2022-05-30, Wang, Add clause text and remove name and count
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
       const columns = [
         {
           key: 'column2',
           name: 'Clause Text',                                                                                                                              
           fieldName: 'name',
           minWidth: 120,
           maxWidth: 800,
           isRowHeader: true,
           isResizable: true,
           data: 'string',
           isPadded: true,
           onColumnClick : () => {
           },
           onRender: (item) => <div style={this.fieldStyle}>{item.clause_text}</div>,
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
       ) : <div style={{ marginTop: '20px' }}>There are no results in your collection. Please add clauses to your collection.</div>;
     }
   }