import { postData } from './transport';

export async function addActivity(values) {
  return postData('addActivity', values);
}
