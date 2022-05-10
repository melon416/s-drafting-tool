import { postData } from './transport';

export async function searchUsers(values) {
  return postData('searchUsers', values, 'admin');
}
