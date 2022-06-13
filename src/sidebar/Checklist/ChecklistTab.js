 /**
  *  ChecklistTab.js
  *  Author:
  *  Created:
  */
 
 /**
  * Change-Log:
  * - 2022-05-09, Wang, Add users and send as props
  */

/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
import React, {Component} from 'react';
import './ChecklistTab.scss';

import {DefaultButton, Label, TextField} from 'office-ui-fabric-react';
import {v4 as uuidv4} from 'uuid';
import _ from 'lodash';
import Checklist from './Checklist';
import LoadChecklist from './LoadChecklist';
import {
    deleteChecklist,
    getChecklistById,
    getDocumentChecklist,
    saveChecklist,
    unlinkFromDocument,
} from '../../dataCalls/checklists';
import guide from './Guide-checklist';

import Loading from '../../components/Loading';

const initialItems = [
    {
        item_uid: uuidv4(),
        label: '',
        state: 'edit',
        is_checked: false,
        group_name: '',
        group_seq: 1,
        group_state: 'edit',
        seq_in_group: 1,
    },
];

export default class ChecklistTab extends Component {
    state = {
        items: [], // testItems,
        name: '',
        showLoadChecklist: false,
        loading: false,
        checklistFormValid: false,
    }

    componentDidMount() {
        const {app_user_id: appUserId} = this.props;

        let documentId = appUserId;
        this.setState({loading: true});

        if (window.Office) {
            documentId = window.Office.context.document.settings.get('syntheiaId');
            if (!documentId) {
                documentId = uuidv4();
                window.Office.context.document.settings.set('syntheiaId', documentId);
                window.Office.context.document.settings.saveAsync(() => {
                    console.log('document settings saved');
                });
            }
        }

        getDocumentChecklist(documentId).then((checklistItems) => {
            this.setState({
                documentId,
                items: checklistItems || [],
                name: checklistItems[0]?.checklist_name,
                loading: false,
            });
        });
    }

    removeCommaAndNewLine = (text) => text.split(',').join(' ').split('\n').join(' ')

    handleExport = () => {
        const {items, name} = this.state;
        const headers = [['Name', 'Checked', 'Group Name', 'Checklist Name']];
        const exportItems = headers.concat(_.sortBy(items, ['group_seq', 'seq_in_group']).map((item) => [
            this.removeCommaAndNewLine(item.label),
            item.is_checked,
            this.removeCommaAndNewLine(item.group_name),
            this.removeCommaAndNewLine(name),
        ]));
        const csvContent = `data:text/csv;charset=utf-8,${
            exportItems.map((e) => e.join(',')).join('\n')}`;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `${name}.csv`);
        document.body.appendChild(link);
        link.click();
    };

    handleLoadChecklist = async (checklistId, newCopy) => {
        this.setState({
            loading: true,
            showLoadChecklist: false,
        });

        const items = checklistId === 'guide' ? guide : await getChecklistById(checklistId);

        this.setState({
            items: newCopy ? items.map((item) => {
                delete item.item_id;
                delete item.checklist_id;
                item.item_uid = uuidv4();
                return item;
            }) : items,
            name: items[0]?.checklist_name,
            loading: false,
        });
    }

    onItemChecked = (itemIds, is_checked) => {
        const {items} = this.state;
        this.setState({
            items: items.map((i) => (itemIds.includes(i.item_uid) ? {
                ...i,
                is_checked,
            } : i)),
        });
    }

    onNewItemAdd = (group_name, group_seq, label, seq_in_group) => {
        const {items} = this.state;
        this.setState({
            items: items.concat({
                checklistId: 1,
                item_uid: uuidv4(),
                is_checked: false,
                label,
                group_name,
                group_seq,
                seq_in_group,
            }),
        });
    };

    onChecklistNameChanged = (e, v) => {
        this.setState({
            name: v,
        }, this.validate);
    }

    handleUnlink = async () => {
        const {documentId} = this.state;
        await unlinkFromDocument(documentId);
        this.setState({
            name: null,
            items: [],
        });
    }

    handleDelete = async () => {
        const {items} = this.state;
        const checklist_id = items[0]?.checklist_id;
        if (checklist_id && checklist_id !== 'guide') {
            await deleteChecklist(checklist_id);
        }
        this.setState({
            name: null,
            items: [],
        });
    }

    onSaveChecklist = async () => {
        const {name, items, documentId} = this.state;
        const {setChecklistSavedDate, addNotification} = this.props;

        this.setState({
            saving: true,
        });

        try {
            const saved_items = await saveChecklist({
                name,
                items,
                checklist_id: items[0]?.checklist_id,
                document_id: documentId,
            });

            setChecklistSavedDate((new Date()).toString());

            this.setState({
                items: saved_items,
                name: saved_items[0]?.checklist_name,
            });

            addNotification('checklist-saved');
        } finally {
            setTimeout(() => {
                this.setState({
                    saving: false,
                });
            }, 500);
        }
    }

    onAddNewGroup = (group_name) => {
        const {items} = this.state;
        const maxByGroupSeq = _.maxBy(items, (item) => item.group_seq || 0);
        const group_seq = maxByGroupSeq.group_seq ? maxByGroupSeq.group_seq + 1 : 1;
        this.setState({
            items: items.concat({
                checklistId: 1,
                item_uid: uuidv4(),
                is_checked: false,
                label: '',
                state: 'edit',
                group_name,
                group_seq,
                seq_in_group: 1,
            }),
        }, this.validate);
    }

    onUpdateItem = (itemId, props) => {
        let {items} = this.state;
        const item = items.find((i) => i.item_uid === itemId);

        if (props.seq_in_group) {
            items = items.map((i) => (i.group_name === item.group_name
            && i.group_seq === item.group_seq
            && i.item_uid !== itemId
            && i.seq_in_group > item.seq_in_group
                ? {...i, seq_in_group: i.seq_in_group - 1}
                : i));

            items = items.map((i) => (i.group_name === props.group_name
            && i.group_seq === props.group_seq
            && i.item_uid !== itemId
            && i.seq_in_group >= props.seq_in_group
                ? {...i, seq_in_group: i.seq_in_group + 1}
                : i));
        }

        this.setState({
            items: items.map((item) => (item.item_uid === itemId
                ? {...item, ...props}
                : item)),
        }, () => {
            const sameGroupItems = items
                .filter((i) => i.group_name === item.group_name && i.group_seq === item.group_seq);

            if (!sameGroupItems.length) {
                this.setState({
                    items: [
                        ...items,
                        {
                            label: '',
                            state: 'edit',
                            item_uid: uuidv4(),
                            seq_in_group: 1,
                            group_name: item.group_name,
                            group_seq: item.group_seq,
                        },
                    ],
                });
            }
        });
    }

    onGroupNameChange = (groupSeq, groupName) => {
        const {items} = this.state;
        this.setState(prevState => ({
            ...prevState,
            items: items.map((item) => (item.group_seq === groupSeq
                ? {...item, group_name: groupName, group_state: null}
                : item))
        }), this.validate);

    }

    onGroupDelete = (group) => {
        const {items} = this.state;
        this.setState({
            items: items.filter((item) => item.group_seq !== group.seq || item.group_name !== group.name),
        }, this.validate);
    }

    onRemoveItem = (itemId) => {
        const {items} = this.state;
        this.setState({
            items: items.filter((item) => item.item_uid !== itemId),
        });
    }



    validate = () => {
        const {name, items} = this.state;
        if (name !== '' && items.every((item) => item.group_name)) {
            this.setState(prevState => ({
                ...prevState,
                checklistFormValid: true,
            }))
        } else {
            this.setState(prevState => ({
                ...prevState,
                checklistFormValid: false,
            }))
        }
    }

    render() {
        const {
            showLoadChecklist, items, name, loading, saving, checklistFormValid
        } = this.state;
        const {last_checklist_saved, app_user_id, users} = this.props;

        if (loading) {
            return (
                <div className="checklist-loading">
                    <Loading/>
                </div>
            );
        }
        const exportMenu = window.Office ? null : {
            items: [
                {
                    key: 'export',
                    text: 'Export Checklist as CSV',
                    onClick: this.handleExport,
                    isBeakVisible: false,
                },
            ],
        };

        return (
            <div className="checklist-tab">
                {!showLoadChecklist && items.length > 0 && (
                    <div className="checklist-wrap">
                        <TextField
                            className="checklist-name-input"
                            value={name}
                            placeholder="Checklist Name"
                            onChange={this.onChecklistNameChanged}
                            borderless
                        />
                        <Checklist
                            items={items}
                            users={users}
                            onGroupDelete={this.onGroupDelete}
                            onAddNewItem={this.onNewItemAdd}
                            onItemChecked={this.onItemChecked}
                            onAddNewGroup={this.onAddNewGroup}
                            onUpdateItem={this.onUpdateItem}
                            onRemoveItem={this.onRemoveItem}
                            onGroupNameChange={this.onGroupNameChange}
                        />
                        <div className="checklist-actions">
                            <DefaultButton
                                split={!window.Office}
                                className="save-button"
                                onClick={this.onSaveChecklist}
                                menuProps={exportMenu}
                                disabled={!checklistFormValid}
                            >
                                {saving ? 'Saving...' : 'Save Checklist'}
                            </DefaultButton>
                            <DefaultButton
                                split
                                className="unlink-button"
                                onClick={this.handleUnlink}
                                menuProps={{
                                    items: [
                                        {
                                            key: 'delete',
                                            text: 'Delete Checklist',
                                            onClick: this.handleDelete,
                                            isBeakVisible: false,
                                        },
                                    ],
                                }}
                            >
                                Unlink and Close
                            </DefaultButton>
                        </div>
                    </div>
                )}

                {showLoadChecklist && (
                    <LoadChecklist
                        onLoadChecklist={(id) => this.handleLoadChecklist(id)}
                        onCopyChecklist={(id) => this.handleLoadChecklist(id, true)}
                        app_user_id={app_user_id}
                    />
                )}

                {!showLoadChecklist && items.length === 0
                && (
                    <div className="no-checklist checklist-wrap">
                        {!last_checklist_saved && (
                            <>
                                <Label>{guide[0].checklist_name}</Label>
                                <Checklist
                                    items={guide}
                                    users={users}
                                    readonly
                                    className="guide-checklist"
                                />
                            </>
                        )}
                        {last_checklist_saved && (
                            <div  className="no-checklist-message">
                                <div>
                                    <p>
                                        <b>This document is not linked to a checklist.</b>
                                        <br/>
                                    </p>
                                    <p>
                                        Create a new checklist for this document or link this document to an existing
                                        checklist.
                                    </p>
                                    <br/>
                                </div>
                            </div>
                        )}
                        <div className="checklist-actions">
                            <DefaultButton onClick={() => this.setState({items: initialItems})}>
                                Create New
                                Checklist
                            </DefaultButton>
                            <DefaultButton onClick={() => this.setState({showLoadChecklist: true})}>
                                Use Existing
                                Checklist
                            </DefaultButton>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
