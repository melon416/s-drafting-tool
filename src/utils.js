import _ from 'lodash';

export function removeHTMLImages(HTML) {
  return HTML && (HTML.value || HTML).replace(/<img[^>]*>/g, '');
}

export function getClauseBankURLPrefix() {
  return (window.location.hostname === 'localhost')
    ? (process.env.REACT_APP_SYNTHEIA_BACKEND) ? `${process.env.REACT_APP_SYNTHEIA_BACKEND.replace(/^api/i, 'clause')}` :'http://localhost:3001'
    : `${window.location.protocol}//${window.location.hostname.replace(/^draft/i, 'clause')}`;
}

export function omit(object, keys) {
  const result = _.clone(object);
  keys.forEach((key) => delete result[key]);
  return result;
}

export function addMultiIDFilterOption(options, filter, tagsIndexed, field, caption) {
  if (filter[field] && Object.keys(tagsIndexed).length > 0) {
    options.push({
      value: field,
      label: `${caption}: ${filter[field].map(
        (id) => ((id < 0 ? '-- NOT ' : '') + (tagsIndexed && tagsIndexed.length) ? tagsIndexed[Math.abs(id)].label : ''),
      ).join(' or ')}`,
    });
  }
}
