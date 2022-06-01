import { fetchData,postData } from './transport';

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
export async function loginWithAzure(code,hostname){
  return fetchData('azure/login',{code,hostname})
}
export async function getAzureLoginUrl(hostname){
  return fetchData('azure/url',{hostname})
}
export async function isAzureLoginEnabled(){
  return fetchData('azure/status')
  }