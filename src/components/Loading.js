import React, { Component } from 'react';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { Label } from 'office-ui-fabric-react/lib/Label';
import './loading.css';

export default class Loading extends Component {
  render() {
    return (
      <div className="cstmLoading_spinner ">
        <Label />
        <Spinner size={SpinnerSize.large} />
      </div>
    );
  }
}
