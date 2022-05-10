/* eslint-disable no-param-reassign */
export function downloadFile(name, data) {
  const a = document.createElement('a');
  a.style.display = 'none';
  document.body.appendChild(a);

  if (!(data instanceof Blob)) {
    if (String(name).match(/\.pdf$/i)) {
      data = new Blob([data], { type: 'application/pdf' });
    } else {
      data = new Blob([data]);
    }
  }

  const objectURL = window.URL.createObjectURL(data);
  a.href = objectURL;
  a.download = name;

  a.click();

  window.URL.revokeObjectURL(objectURL);
  a.href = null;
  document.body.removeChild(a);
}

export function pluralise(text, count) {
  if (count !== 1) {
    return `${text}s`;
  }

  return text;
}

export async function getFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
}

export async function getFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsArrayBuffer(file);
  });
}

export function isArrayEmpty(arr) {
  return !arr?.length;
}

export function copyToClipboard(text) {
  const el = document.createElement('textarea');
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}
