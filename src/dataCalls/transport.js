/**
 * Change-Log:
 * - 2022-05-29, Attia, added a replace function to replace standalone url properly
 */

import axios from 'axios';
import {
  fetchJSON, getQueryString, postJSON, setSendCredentials,
} from 'amlib/dist/client/transport';
import store from '../store';

setSendCredentials(true);

const backendDomain = (window.location.hostname === 'localhost')
  ? (process.env.REACT_APP_SYNTHEIA_BACKEND) ? process.env.REACT_APP_SYNTHEIA_BACKEND : 'http://localhost:3000'
  : `${window.location.protocol}//${window.location.hostname.replace(/^draft/i, 'api').replace(/^standalone/i, 'api-syntheia')}`;

export function fetchData(name, values = {}, area = 'drafting') {
  const response = fetchJSON(`${backendDomain}/${area}/${name}${getQueryString(values)}`);
  response.catch((err) => {
    if (err.message === 'Api method is not available for this user.') {
      store.dispatch.app.logout();
    }
  });
  return response;
}

export function postData(name, values, area = 'drafting') {
  const response = postJSON(`${backendDomain}/${area}/${name}`, values);
  response.catch((err) => {
    if (err.message === 'Api method is not available for this user.') {
      store.dispatch.app.logout();
    }
  });
  return response;
}

export function fetchFile(name, values = {}, area = 'clause') {
  return axios
    .get(`${backendDomain}/${area}/${name}${getQueryString(values)}`, {
      responseType: 'arraybuffer',
      withCredentials: true,
    })
    .then((resp) => {
      if (resp.data.byteLength < 100) {
        return { document: null };
      }
      return { document: { type: 'Buffer', data: resp.data } };
    })
    .catch(() => ({ document: null }));
}

export function addTransportAppContext(rootState, values = {}) {
  return {
    ...values,
    appContext: {
      app_user_id: rootState.app.appContext.app_user_id,
      workspace: rootState.app.appContext.workspace_id
    },
  };
}

export function fetchClause(name, values = {}, area = 'clause') {
  const response = postJSON(`${backendDomain}/${area}/${name}`, values);
  response.catch((err) => {
    if (err.message === 'Api method is not available for this user.') {
      store.dispatch.app.logout();
    }
  });
  return response;
}
