import React from 'react';
import ReactDOM from 'react-dom';
import 'react-app-polyfill/stable';
import { Provider } from 'react-redux';
import store from '../store';
import MainApp from './MainApp';
// import /*registerServiceWorker,*/ {unregister} from '../registerServiceWorker';

ReactDOM.render(
  <Provider store={store}>
    <MainApp />
  </Provider>,
  document.getElementById('root'),
);

// registerServiceWorker();
// unregister();
