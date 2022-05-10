/* eslint-disable camelcase */
import { fetchUserBookmarks, saveBookmark, deleteBookmarks } from '../dataCalls/bookmarks';
import { addTransportAppContext } from '../dataCalls/transport';

export const bookmarks = {
  state: {
    bookmarks: [],
  },

  reducers: {
    setBookmarks(state, { bookmarks = [] }) {
      return {
        ...state,
        bookmarks,
      };
    },
    addBookmark(state, { bookmark }) {
      return {
        ...state,
        bookmarks: [...state.bookmarks, bookmark],
      };
    },
    removeBookmark(state, bookmark_id) {
      return {
        ...state,
        bookmarks: state.bookmarks.filter((b) => b.bookmark_id !== bookmark_id),
      };
    },
  },

  effects: (dispatch) => ({
    async saveBookmark(values, rootState) {
      const { bookmark } = await saveBookmark(addTransportAppContext(rootState, values));
      this.addBookmark({ bookmark });
    },

    async deleteBookmark({ bookmark_id }) {
      await dispatch.bookmarks.deleteBookmarks({ bookmark_id: [bookmark_id] });
    },

    async deleteBookmarks(values, rootState) {
      await deleteBookmarks(addTransportAppContext(rootState, values));
      values.bookmark_id.forEach((id) => {
        this.removeBookmark(id);
      });
    },

    async fetchUserBookmarks(values, rootState) {
      const bookmarks = await fetchUserBookmarks(addTransportAppContext(rootState, values));
      this.setBookmarks({ bookmarks });
    },
  }),
};
