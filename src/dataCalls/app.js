import { postData } from './transport';

export async function login(values) {
  return postData('login', values);
}

export async function logout() {
  return postData('logout');
}

export async function getAppContext(values) {
  return postData('getAppContext', values);
}

export async function setCurrentStep(values) {
  return postData('setCurrentTutorialStep', { ...values, app: 'dt' });
}
