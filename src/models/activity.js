/* eslint-disable camelcase */
import { addActivity } from '../dataCalls/activities';
import { addTransportAppContext } from '../dataCalls/transport';

export const activity = {
  state: {
  },

  reducers: {
  },

  effects: (dispatch) => ({

    async addActivity({ activity_type, activity_data, owner_id }, rootState) {
      try {
        await addActivity(addTransportAppContext(rootState, { activity_type, activity_data, owner_id }));
      } catch (error) {
        dispatch.app.setError({ error });
      }
    },

  }),

};
