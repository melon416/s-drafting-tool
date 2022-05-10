import { fetchFile, postData } from './transport';

export async function getDocumentFile(values) {
  return fetchFile('downloadDocument', values);
}

export async function searchDocuments(values) {
  return postData('searchDocuments', values);
}
