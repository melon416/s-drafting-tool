import * as Sentry from '@sentry/browser';
import { isSubmissionError, isUserError } from 'amlib/dist/errors';

const logErrorsExternally = window.location.hostname !== 'localhost';
const sentryDsn = process.env.REACT_APP_SENTRY_DSN;
const sentryEnabled = process.env.REACT_APP_SENTRY_ENABLED === 'true';

if (logErrorsExternally && sentryEnabled) {
  Sentry.init({
    dsn: sentryDsn,
    integrations: [new Sentry.Integrations.GlobalHandlers({
      onunhandledrejection: false,
    })],
    environment: window.location.hostname,
  });
}

export function logError(error) {
  if (logErrorsExternally && !isUserError(error) && !isSubmissionError(error)) {
    Sentry.captureException(error);
  }
}

window.addEventListener('unhandledrejection', (e) => {
  e.preventDefault();

  const error = (e.detail && e.detail.reason) || e.reason;

  logError(error);
});
