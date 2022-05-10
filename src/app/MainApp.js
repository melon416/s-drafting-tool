import React, { useState } from 'react';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib';
import AuthenticatedAppContainer from './AuthenticatedAppContainer';
import ErrorDialogContainer from '../components/ErrorDialogContainer';

const MainApp = () => {
  const [message, setMessage] = useState(null);

  window.addEventListener('unhandledrejection', (e) => {
    e.preventDefault();

    const error = (e.detail && e.detail.reason) || e.reason;

    setMessage(error.message);
  });

  const resetError = () => {
    setMessage(null);
  };

  return (
    <>
      <ErrorDialogContainer />
      <AuthenticatedAppContainer />
      {message
				&& (
          <div className="message-bar">
            <MessageBar
              messageBarType={MessageBarType.error}
              isMultiline={false}
              onDismiss={resetError}
              dismissButtonAriaLabel="Close"
            >
              {message}
            </MessageBar>
          </div>
				)}
    </>
  );
};

export default MainApp;
