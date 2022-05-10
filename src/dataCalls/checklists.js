import { postData, fetchData } from './transport';

export async function saveChecklist(values) {
  return postData('checklists', values );
}

export async function unlinkFromDocument(documentId) {
  return postData(`checklists/${documentId}/unlink`, null);
}

export async function deleteChecklist(checklistId) {
  return postData(`checklists/${checklistId}/delete`, null);
}

export async function lockChecklist(checklistId) {
  return postData(`checklists/${checklistId}/lock`, null);
}

export async function loadChecklist(values) {
  return fetchData('checklists', values);
}

export async function getDocumentChecklist(documentId) {
  return fetchData(`documentChecklist/${documentId}`, null);
}

export async function getChecklistById(id) {
  return fetchData(`checklists/${id}`, null);
}
