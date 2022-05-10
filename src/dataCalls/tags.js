import { fetchData } from './transport';

export async function fetchTags(values) {
  return fetchData('fetchTags', values, 'clause');
}
