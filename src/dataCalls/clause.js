import { postData, fetchClause } from './transport';

export async function saveClause(values) {
  return postData('saveClause', values);
}

export async function searchClauses(values) {
  return fetchClause('searchClauses', values);
}

export async function getNextClauseSibling(values) {
  return postData('getNextClause', values);
}

