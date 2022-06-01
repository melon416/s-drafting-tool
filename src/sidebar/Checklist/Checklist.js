 /**
  *  Checklist.js
  *  Author:
  *  Created:
  */
 
 /**
  * Change-Log:
  * - 2022-05-09, Wang,  Add onShouldVirtualize and compact to GroupedList to show more than 10 items
  */

/* eslint-disable react/destructuring-assignment */
import React, {Component} from 'react';
import {
    FocusZone,
    GroupedList, GroupHeader,
    TextField,
    Toggle,
    Checkbox,
    IconButton,
    Icon, SwatchColorPicker,
} from 'office-ui-fabric-react';
import _ from 'lodash';
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import {lockChecklist} from '../../dataCalls/checklists';

const colors = [
    {id: 'pink', label: 'pink', color: '#ff789e'},
    {id: 'yellow', label: 'yellow', color: '#FFEE22'},
    {id: 'green', label: 'green', color: '#7dff3c'},
    {id: 'blue', label: 'blue', color: '#86b0ff'},
    {id: 'grey', label: 'grey', color: '#ababab'},
    {id: 'white', label: 'white', color: '#ffffff'},
];

export default class Checklist extends Component {
    state = {
        columns: [
            {
                key: 'label',
                name: 'Label',
                fieldName: 'label',
            },
        ],
    };

    componentDidMount() {
        const {items, readonly} = this.props;
        this.timerId = setInterval(async () => {
            const checklistId = items[0]?.checklist_id;
            if (checklistId && !readonly) {
                await lockChecklist(checklistId);
            }
        }, 3000);
    }

    componentWillUnmount() {
        clearInterval(this.timerId);
    }

    render() {
        const {
            items, readonly, locked, lockedBy,
        } = this.props;

        let groupNames = [];

        const groupedItems = items.reduce((acc, item) => {
            // eslint-disable-next-line no-param-reassign
            if (!item.label) item.state = 'edit';
            const groupKey = item.group_name + item.group_seq;
            if (!acc.has(groupKey)) acc.set(groupKey, []);
            if (!groupNames.find((g) => g.group_name === item.group_name && g.group_seq === item.group_seq)) {
                groupNames.push({
                    group_name: item.group_name,
                    group_seq: item.group_seq,
                    group_state: item.group_state,
                });
            }
            acc.get(groupKey).push(item);
            return acc;
        }, new Map());

        groupNames = _.sortBy(groupNames, 'group_seq');

        let checkListItems = [];
        groupNames.forEach((group) => {
            const groupKey = group.group_name + group.group_seq;
            const sortedGroupItems = _.sortBy(groupedItems.get(groupKey), 'seq_in_group');
            checkListItems = [...checkListItems, ...sortedGroupItems];
            if (!readonly) {
                checkListItems.push({
                    type: 'placeholder',
                    group_name: group.group_name,
                    group_seq: group.group_seq,
                });
            }
        });

        let startIndex = 0;
        const groups = [];

        groupNames.forEach((group) => {
            const groupKey = group.group_name + group.group_seq;
            let count = groupedItems.get(groupKey).filter((item) => item.type !== 'placeholder').length;

            if (!readonly) {
                count += 1;
            }
            const itemGroup = {
                name: group.group_name,
                seq: group.group_seq,
                groupKey,
                startIndex,
                isCollapsed: this.state[groupKey]?.isCollapsed,
                state: this.state[groupKey]?.state || group.group_state,
                count,
            };

            startIndex += count;
            groups.push(itemGroup);
        });

        const getItemStyle = (isDragging, draggableStyle) => ({
            // some basic styles to make the items look a bit nicer
            userSelect: 'none',
            // change background colour if dragging
            background: isDragging ? '#f0f0f0' : this.props.readonly ? '#f5f5f5' : 'white',

            // styles we need to apply on draggables
            ...draggableStyle,
        });

        const onRenderCell = (nestingDepth, item, itemIndex) => {
            if (item.type === 'placeholder') {
                const save = (e) => {
                    const {value} = e.target;
                    const groupKey = item.group_name + item.group_seq;
                    if (value) {
                        const seq = groupedItems.get(groupKey).length + 1;
                        this.props.onAddNewItem(item.group_name, item.group_seq, value, seq);
                    }
                };

                const onKeydown = (e) => {
                    if (e.keyCode === 13) {
                        save(e);
                    }
                };

                return (
                    <TextField
                        key={Date.now()}
                        defaultValue=""
                        className="add-checklist-item-input"
                        borderless
                        placeholder="New Item"
                        onBlur={save}
                        onKeyDown={onKeydown}
                    />
                );
            }

            const onColorChanged = (colorId) => {
                this.props.onUpdateItem(item.item_uid, {
                    color_id: colorId,
                });
            };

            const menuProps = {
                items: [
                    {
                        key: 'edit-item',
                        text: 'Edit',
                        onClick: () => {
                            this.props.onUpdateItem(item.item_uid, {state: 'edit'});
                        },
                        iconProps: {iconName: 'Edit'},
                    },
                    {
                        key: 'delete-item',
                        text: 'Delete',
                        onClick: () => {
                            this.props.onRemoveItem(item.item_uid);
                        },
                        iconProps: {iconName: 'Delete'},
                    },
                    {
                        key: 'color',
                        onRenderContent: () => (
                            <SwatchColorPicker
                                columnCount={6}
                                cellShape="circle"
                                colorCells={colors}
                                onColorChanged={onColorChanged}
                                className="color-picker"
                            />
                        ),
                    },
                ],
                calloutProps: {
                    calloutMaxWidth: 200,
                },
                directionalHintFixed: true,
            };

            const save = (e) => {
                const {value} = e.target;
                this.props.onUpdateItem(item.item_uid, {label: value, state: value ? 'normal' : 'edit'});
                e.target.value = '';
            };

            const onKeydown = (e) => {
                if (e.keyCode === 13) {
                    save(e);
                }
            };

            const onItemChange = (e, value) => {
                this.props.onUpdateItem(item.item_uid, {label: value});
            };

            const className = `checklist-item ${item.color_id || ''}`;
            return (
                <Draggable key={item.item_uid} draggableId={item.item_uid} index={itemIndex}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style,
                            )}
                        >
                            <div className={className}>
                                <div className="checklist-item-checkbox">
                                    <Checkbox
                                        label={item.state === 'edit' ? '' : item.label}
                                        disabled={this.props.readonly}
                                        checked={item.is_checked}
                                        onChange={(ev, checked) => this.props.onItemChecked([item.item_uid], checked)}
                                    />
                                    {item.state === 'edit'
                                    && (
                                        <TextField
                                            value={item.label}
                                            autoFocus={this.props.items.length > 1}
                                            className="edit-item-input"
                                            borderless
                                            placeholder="Item name"
                                            onChange={onItemChange}
                                            onBlur={save}
                                            onKeyDown={onKeydown}
                                            disabled={readonly}
                                        />
                                    )}
                                </div>
                                {!readonly && (
                                    <div className="checklist-item-menu">
                                        <IconButton
                                            iconProps={{
                                                iconName: item.state === 'edit' ? 'Edit' : 'More',
                                            }}
                                            disabled={item.state === 'edit'}
                                            menuProps={menuProps}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </Draggable>
            );
        };

        const onRenderGroupHeaderCheckbox = (items) => (
            <Toggle
                checked={items.every((item) => item.is_checked)}
                onChange={(ev, checked) => this.props.onItemChecked(items.map((i) => i.item_uid), checked)}
            />
        );

        const onRenderGroupTitle = ({group}) => {
            const menuProps = {
                items: [
                    {
                        key: 'edit-item',
                        text: 'Edit',
                        onClick: () => {
                            this.setState({
                                [group.groupKey]: {
                                    ...this.state[group.groupKey],
                                    state: 'edit',
                                    name: group.name,
                                },
                            });
                        },
                        iconProps: {iconName: 'Edit'},
                    },
                    {
                        key: 'delete-item',
                        text: 'Delete',
                        onClick: () => this.props.onGroupDelete(group),
                        iconProps: {iconName: 'Delete'},
                    },
                ],
                calloutProps: {
                    calloutMaxWidth: 100,
                },
            };

            const save = (e) => {
                const {value} = e.target;
                if (value) {
                    this.props.onGroupNameChange(group.seq, this.state[group.groupKey].name);
                }
            };

            const onKeyDown = (e) => {
                if (e.keyCode === 13) {
                    save(e);
                }
            };

            const onGroupNameChange = (e, name) => {
                this.setState({
                    [group.groupKey]: {
                        ...this.state[group.groupKey],
                        name,
                    },
                });
            };


            return (
                <div className="group-title-wrap">
                    {group.state !== 'edit' && (
                        <div className="group-title">
                            {group.name}
                            {' '}
                            <span className="group-item-count">
        (
                                {this.props.readonly ? group.count : group.count - 1}
                                )
      </span>
                        </div>
                    )}
                    {group.state === 'edit' && (
                        <div className="group-edit">
                            <TextField
                                borderless
                                value={this.state[group.groupKey]?.name || ''}
                                onChange={onGroupNameChange}
                                placeholder="Group Name"
                                autoFocus
                                onKeyDown={onKeyDown}
                                onBlur={save}
                            />
                        </div>
                    )}
                    {!this.props.readonly && (
                        <div className="group-menu">
                            <IconButton
                                iconProps={{
                                    iconName: group.state === 'edit' ? 'Edit' : 'More',
                                }}
                                disabled={group.state === 'edit'}
                                menuProps={menuProps}
                            />
                        </div>
                    )}
                </div>
            );
        };

        const onRenderGroupHeader = (props) => {
            const {group} = props;
            const groupItems = checkListItems
                .slice(group.startIndex, group.startIndex + group.count)
                .filter((item) => item.type !== 'placeholder');

            return (
                <GroupHeader
                    onRenderGroupHeaderCheckbox={() => onRenderGroupHeaderCheckbox(groupItems)}
                    {...props}
                    onToggleCollapse={() => {
                        this.setState({
                            [props.group.groupKey]: {
                                ...this.state[props.group.groupKey],
                                isCollapsed: !props.group.isCollapsed,
                            },
                        });
                        props.onToggleCollapse(props.group);
                    }}
                    onRenderTitle={onRenderGroupTitle}
                />
            );
        };

        const onGroupInputKeydown = (e) => {
            if (e.keyCode === 13) {
                if (this.state.newGroupName) {
                    this.props.onAddNewGroup(this.state.newGroupName);
                    this.setState({
                        newGroupName: '',
                    });
                }
            }
        };

        const onDragEnd = (result) => {
            if (result.draggableId && result.destination?.droppableId) {
                const destinationGroup = groups.find((g) => g.groupKey === result.destination.droppableId);
                this.props.onUpdateItem(result.draggableId, {
                    group_name: destinationGroup.name,
                    group_seq: destinationGroup.seq,
                    seq_in_group: result.destination.index + 1,
                });
            } else {
                console.log('no draggableId', result);
            }
        };

        const onRenderPage = ({page}) => (
            <div>
                <Droppable droppableId={page.items[0].group_name + page.items[0].group_seq}>
                    {(provided, snapshot) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{marginBottom: snapshot.isDraggingOver ? 32 : 0}}
                        >
                            {page.items.filter((i) => i.type !== 'placeholder')
                                .map((item, index) => onRenderCell(null, item, index))}
                        </div>
                    )}
                </Droppable>
                <div>
                    {page.items.filter((i) => i.type === 'placeholder')
                        .map((item, index) => <div>{onRenderCell(null, item, index)}</div>)}
                </div>
            </div>
        );

        return (
            <div className={`checklist ${readonly ? 'readonly' : ''} ${this.props.className}`}>
                <FocusZone>
                    <DragDropContext onDragEnd={onDragEnd} enableDefaultSensors={!readonly}>
                        <GroupedList
                            items={checkListItems}
                            onRenderCell={onRenderCell}
                            groups={groups}
                            listProps={{
                                onRenderPage,
                            }}
                            groupProps={{
                                onRenderHeader: onRenderGroupHeader,
                            }}
                            onShouldVirtualize={() => false}  // to show more than 10 items
                            compact  // to show more than 10 items
                        />
                    </DragDropContext>
                    {!this.props.readonly && (
                        <TextField
                            value={this.state.newGroupName}
                            onChange={(e, v) => this.setState({newGroupName: v})}
                            placeholder="New Group"
                            borderless
                            onKeyUp={onGroupInputKeydown}
                            className="new-group-input"
                        />
                    )}
                    {locked && (
                        <div className="checklist-locked">
                            <Icon iconName="Lock"/>
                            <span>
          This checklist is in use by
          <i>
            {lockedBy.firstname}
              {' '}
              {lockedBy.lastname}
          </i>
        </span>
                        </div>
                    )}
                </FocusZone>
            </div>
        );
    }
}
