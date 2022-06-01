  /**
   *  MainApp.js
   *  Author:
   *  Created:
   */
  
  /**
   * Change-Log:
   * - 2022-05-12, Wang, Add routing for web, sidepanel and taskpane
   */

  /**
   * Change-Log:
   * - 2022-05-17, Wang, Updated the routing for sidepanel
   */

import React, { useState } from 'react';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib';
import AuthenticatedAppContainer from './AuthenticatedAppContainer';
import ErrorDialogContainer from '../components/ErrorDialogContainer';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import store from '../store';
import { Provider } from 'react-redux';
import TaskpaneAppContainer from '../taskpane/TaskpaneAppContainer';
import SidebarContainer from '../sidebar/SidebarContainer';

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

  const App = (props) => {
    return <> 
      <ErrorDialogContainer />
        <AuthenticatedAppContainer standAlone = {props.standAlone} />
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
  }

  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
        <Routes>
          <Route path="" element={<App standAlone = {false} />} />
          <Route path="standalone" element={<App standAlone = {true} />} />
        </Routes>
        </BrowserRouter>
       </Provider>
    </>
  );
};

export default MainApp;