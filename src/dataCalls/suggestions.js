import { postData, fetchData } from './transport';

export async function getNextClauseSibling(values) {
  return postData('getNextClause', values);
}

export async function getSuggestions(values) {
  let results = await postData('getSuggestions', values);
  if (results.suggestions && results.suggestions.length) {
    return results;
  }

  return {
    ...await postData('getSuggestions', {...values, disable_NLP: true}),
    showWraningForDisableNLP: true
  };
}

export async function getTrigramCounts(values) {
  return postData('getTrigramCounts', values);
}

export async function searchDocumentIds(values) {
  return postData('searchDocumentIds', values);
}

export async function saveComment(values) {
  return postData('saveComment', values, );
}

export async function getCommentsFor(values) {
  return fetchData('retrieveAllCommentsForItem', values);
}
