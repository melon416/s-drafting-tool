import {
  searchUsers,
} from '../dataCalls/users';
import { addTransportAppContext } from '../dataCalls/transport';

export const user = {
  state: {
    users: [],
    isLoading: false,
    wasLoaded: false,
  },

  reducers: {
    setUsers(state, { users }) {
      return {
        ...state,
        users,
      };
    },
    setIsLoading(state, { isLoading, wasLoaded }) {
      return {
        ...state,
        isLoading,
        wasLoaded,
      };
    },
  },

  effects: () => ({
    async searchUsers({ filter }, rootState) {
      this.setIsLoading({ isLoading: true });
      this.setUsers({ users: [] });
      try {
        this.setUsers({ users: await this.getUsers(addTransportAppContext(rootState, { filter })) });
      } finally {
        this.setIsLoading({ isLoading: false, wasLoaded: true });
      }
    },

    async getUsers({ filter }, rootState) {
      const { users } = await searchUsers(addTransportAppContext(rootState, filter));

      return users;
    },

    async loadInitialData(__, rootState) {
      if (rootState.user.wasLoaded) {
        return;
      }

      this.searchUsers({});
    },
  }),

};
