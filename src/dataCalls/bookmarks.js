import { fetchData, postData } from './transport';

export async function saveBookmark(values) {
  return postData('bookmarks', values);
}

export async function deleteBookmarks(values) {
  return postData('deleteBookmarks', values);
}

export async function fetchUserBookmarks(values) {
  return fetchData('fetchUserBookmarks', values);
}
