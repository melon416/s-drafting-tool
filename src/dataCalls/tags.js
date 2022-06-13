/**
 *  tags is an interface for http service that holds tags api endpoints
 */

/**
 * Change-Log:
 * - 6/5/2022, Attia, fetch tags by type instead of all tags
 */

import { fetchData } from './transport';

export async function fetchTags(values) {
  return fetchData('tags', values, 'clause');
}
