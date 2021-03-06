  /**
   *  clause.js
   *  Author:
   *  Created:
   */
  
  /**
   * Change-Log:
   * - 2022-06-01, Wang, Add setClauseFavorite
   */


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

export async function setClauseFavorite(values) {
  return postData('setClauseFavorite', values, 'clause');
}

