import React, { Component } from 'react';
import './access-denied.scss';
import { PrimaryButton } from 'office-ui-fabric-react';

class AccessDenied extends Component {
  render() {
    const { logout } = this.props;
    return (
      <div className="AccessDeniedWrapper">
        <div className="AccessDenied-card">
          <div className="AccessDenied">
            <h2 className="title">Access Denied</h2>
            <p>You do not have permission to access this application.</p>
            <p>
              If you would like access or need other help, please email your system administrator
            </p>
            <div className="AccessDenied-actions">
              <PrimaryButton class text="Return to Login Page" onClick={logout} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AccessDenied;
