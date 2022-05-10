import { NotificationManager } from 'react-notifications';

export const notification = {
  state: {
  },

  reducers: {
  },

  effects: () => ({
    async addNotification({ type }) {
      switch (type) {
        case 'info':
          NotificationManager.info('Info message');
          break;
        case 'document-uploaded':
          NotificationManager.success(
            'Document successfully uploaded',
            'Success',
            1500,
          );
          break;
        case 'document-updated':
          NotificationManager.success(
            'Document successfully updated',
            'Success',
            1500,
          );
          break;
        case 'checklist-saved':
          NotificationManager.success(
            'Checklist successfully saved',
            'Success',
            1500,
          );
          break;
        case 'document-uploaded-fail':
          NotificationManager.error(
            'Please ensure the text editor is not empty',
            'Error',
            1500,
          );
          break;
        case 'fetch-failed':
          NotificationManager.error('Something has gone wrong! Contact your administrator', 'error', 1500);
          break;
        default:
      }
    },
  }),

};
