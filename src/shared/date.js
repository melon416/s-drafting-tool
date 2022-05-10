import dateFormat from 'date-fns/format';
import { enUS, enGB } from 'date-fns/locale';
import parseISO from 'date-fns/parseISO';

function getDefaultLocaleFromBrowser() {
  const language = (window.navigator.languages ? window.navigator.languages[0] : null) || window.navigator.userLanguage || window.navigator.language;

  switch (language) {
    case 'en-AU':
    case 'en-GB':
      return enGB;
    default:
      return enUS;
  }
}

const locale = getDefaultLocaleFromBrowser();

export function getSelectedDateLocale() {
  return locale;
}

const dateFormatShort = locale.formatLong.date({ width: 'short' });
const dateTimeFormatShort = locale.formatLong.dateTime({ width: 'long' })
  .replace('{{date}}', locale.formatLong.date({ width: 'short' }))
  .replace('{{time}}', locale.formatLong.time({ width: 'medium' }));

export function formatDate(date, format = dateFormatShort) {
  if (!date) {
    return null;
  }

  return dateFormat(typeof date === 'object' ? date : parseISO(date), format, { locale });
}

export function formatDatePlain(date) {
  if (!date) {
    return null;
  }

  return dateFormat(typeof date === 'object' ? date : parseISO(date), 'yyyy-MM-dd', { locale });
}

export function formatDateTime(date, format = dateTimeFormatShort) {
  if (!date) {
    return null;
  }

  return dateFormat(typeof date === 'object' ? date : parseISO(date), format, { locale });
}

export function toDate(value) {
  if (!value) {
    return null;
  }

  return parseISO(value);
}
