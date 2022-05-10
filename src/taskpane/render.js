// eslint-disable-next-line import/no-extraneous-dependencies
import { AppContainer } from 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
import '@babel/polyfill';
import { Provider } from 'react-redux';
import store from '../store';
import ErrorDialogContainer from '../components/ErrorDialogContainer';

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <ErrorDialogContainer />
        <Component />
      </Provider>
    </AppContainer>,
    document.getElementById('root'),
  );
};

render(require('./TaskpaneAppContainer').default);
