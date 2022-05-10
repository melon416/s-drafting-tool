import React, { Component } from 'react';
import { Dialog, DialogFooter, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';

export default class ErrorDialog extends Component {
	handleClose = () => {
	  const { setError } = this.props;
	  setError(null);
	};

	render() {
	  const { error } = this.props;

	  if (!error) {
	    return null;
	  }

	  return (
      <Dialog
        hidden={false}
        onDismiss={this.handleClose}
        dialogContentProps={{
				  type: DialogType.close,
				  title: 'Error',
				  subText: error.message,
        }}
        modalProps={{
				  isBlocking: true,
				  styles: { main: { maxWidth: 450 } },
        }}
      >
        <DialogFooter>
          <PrimaryButton onClick={this.handleClose} text="OK" />
        </DialogFooter>
      </Dialog>
	  );
	}
}
