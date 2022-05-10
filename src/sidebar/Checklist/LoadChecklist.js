import React, { Component } from 'react';
import { DefaultButton, Label } from 'office-ui-fabric-react';
import dateFormat from 'date-fns/format';
import { getChecklistById, loadChecklist } from '../../dataCalls/checklists';
import Checklist from './Checklist';
import Select from '../../components/Select';
import guide from './Guide-checklist';

export default class LoadChecklist extends Component {
	state = {
	  selectedChecklistItems: [],
	  checklists: [],
	};

	componentDidMount() {
	  loadChecklist().then((checklists) => {
	    this.setState({
	      checklists: checklists.map((checklist) => {
	        const copy = { ...checklist };
	        copy.isDuplicate = !!checklists.find((c) => c.name === checklist.name && c.checklist_id !== checklist.checklist_id);
	        if (checklist.isDuplicate) {
	          copy.uniqName = `${checklist.name} (${dateFormat(new Date(checklist.created_at), 'yyyy-MM-dd p')})`;
	        }

	        if (checklist.is_deleted) {
	          copy.name = `DELETED ${checklist.name}`;
	        }
	        return copy;
	      }),
	    });
	  });
	}

	handleSelectedChecklistChange = (selectedItems) => {
	  const { app_user_id: appUserId } = this.props;
	  const selectedChecklistId = selectedItems[0];

	  this.setState({
	    selectedChecklistId,
	  });

	  if (selectedChecklistId) {
	    if (selectedChecklistId === 'guide') {
	      this.setState({
	        selectedChecklistItems: guide,
	      });
	    } else {
	      getChecklistById(selectedChecklistId).then((items) => {
	        const item = items[0];
	        this.setState({
	          selectedChecklistItems: items,
	          locked: item?.locked && item?.checklist_locked_app_user_id !== appUserId,
	          lockedBy: {
	            firstname: item?.locked_by_firstname,
	            lastname: item?.locked_by_lastname,
	          },
	        });
	      });
	    }
	  }
	}

	render() {
	  const {
	    selectedChecklistItems, checklists, selectedChecklistId, locked, lockedBy,
	  } = this.state;
	  const { onLoadChecklist, onCopyChecklist } = this.props;

	  const options = checklists.map((c) => (
		{
	    key: c.checklist_id,
	    name: (c.checklist_id && c.uniqName) ? (c.checklist_id +" - "+ c.uniqName) : (c.checklist_id +" - "+ c.name),
	  }));

	  return (
			<div className="load-checklist">
				<Label>Saved Checklists</Label>
				<Select
					id="select-checlist"
					value={selectedChecklistId && [selectedChecklistId]}
					options={options}
					onChange={this.handleSelectedChecklistChange}
					placeholder="Select a checklist"
					label="Checklist"
					single
				/>
				{selectedChecklistItems.length > 0 && (
				<>
					<div className="checklist-wrap">
						<Checklist
							items={selectedChecklistItems}
							locked={locked}
							lockedBy={lockedBy}
							readonly
						/>
					</div>
					<div className="checklist-actions">
						<DefaultButton
							disabled={!selectedChecklistId || locked}
							onClick={() => onLoadChecklist(selectedChecklistId)}
						>
							Load and Use Checklist
						</DefaultButton>
						<DefaultButton
							disabled={!selectedChecklistId}
							onClick={() => onCopyChecklist(selectedChecklistId)}
						>
							Copy as a New Checklist
						</DefaultButton>
					</div>
				</>
				)}
			</div>
	  );
	}
}
