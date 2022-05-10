/* eslint-disable camelcase */
import _ from 'lodash';
import {
  getSuggestions, getTrigramCounts, saveComment, getCommentsFor, getNextClauseSibling,
} from '../dataCalls/suggestions';
import { ACTIVITY_DT_SUGGESTION_DISLIKED, ACTIVITY_DT_SUGGESTION_LIKED, SIDEBAR_TAB_SUGGESTION_RESULT } from '../consts';
import { addTransportAppContext } from '../dataCalls/transport';

export const suggestion = {
  state: {
    suggestions: [],
    goodSuggestions: [],
    badSuggestions: [],
    searchText: '',
    searchExtraText: '',
    moreAvailable: true,
    isLoading: false,
    filter: {},
    prefer_document_type_id: null,
    selectedSuggestion: {},
    comments: [],
    isCommentLoading: false,

    unusualPhrases: {
      highlight: false,
      clauseTypeID: null,
      percentage: 5,
      maxCount: null,
      showAdvanced: false,
      loading: false,
    },
  },

  reducers: {

    setSuggestions(state, { suggestions, moreAvailable }) {
      return {
        ...state,
        suggestions,
        moreAvailable: (moreAvailable === undefined) ? state.moreAvailable : moreAvailable,
      };
    },

    setTrigrams(state, { texts }) {
      const indexed = _.keyBy(texts, 'id');
      return {
        ...state,
        suggestions: state.suggestions.map((sug) => (indexed[sug.id] ? { ...sug, trigrams: indexed[sug.id].trigrams } : sug)),
      };
    },

    setSuggestionStatus(state, { id, good }) {
      return {
        ...state,
        goodSuggestions: good ? state.goodSuggestions.concat(id) : state.goodSuggestions.filter((x) => x !== id),
        badSuggestions: !good ? state.badSuggestions.concat(id) : state.badSuggestions.filter((x) => x !== id),
        moreAvailable: true,
      };
    },

    setSuggestionSearchText(state, { searchText }) {
      return {
        ...state,
        searchText,
        prefer_document_type_id: null,
      };
    },

    setPreferDocumentTypeID(state, { prefer_document_type_id }) {
      return {
        ...state,
        prefer_document_type_id,
      };
    },

    setSuggestionSearchExtraText(state, { searchExtraText }) {
      return {
        ...state,
        searchExtraText,
      };
    },

    setSuggestionFilter(state, { filter }) {
      return {
        ...state,
        filter,
      };
    },

    setIsLoading(state, { isLoading }) {
      return {
        ...state,
        isLoading,
      };
    },

    clearSuggestionStatus(state) {
      return {
        ...state,
        goodSuggestions: [],
        badSuggestions: [],
      };
    },

    setUnusualPhrases(state, args) {
      return {
        ...state,
        unusualPhrases: {
          ...state.unusualPhrases,
          loading: false,
          ...args,
        },
      };
    },

    setSelectedSuggestion(state, { suggestion }) {
      return {
        ...state,
        selectedSuggestion: suggestion,
      };
    },

    addSelectedSuggestion(state, { suggestion }) {
      return {
        ...state,
        selectedSuggestion: [...state.selectedSuggestion, suggestion],
      };
    },

    setComments(state, { comments }) {
      return {
        ...state,
        comments,
      };
    },

    setCommentIsLoading(state, { isCommentLoading }) {
      return {
        ...state,
        isCommentLoading,
      };
    },

    clear(state) {
      return {
        ...state,
        suggestions: [],
        goodSuggestions: [],
        badSuggestions: [],
        searchText: '',
        searchExtraText: '',
        moreAvailable: true,
        prefer_document_type_id: null,
        filter: {},
        unusualPhrases: {
          highlight: false,
          clauseTypeID: null,
          percentage: 5,
          maxCount: null,
          showAdvanced: false,
        },
        selectedSuggestion: {},
      };
    },

  },

  effects: (dispatch) => ({
    async getCommentsFor({ owner_id }, rootState) {
      this.setCommentIsLoading({ isCommentLoading: true });
      this.setComments({ comments: [] });
      const { comments } = await getCommentsFor(addTransportAppContext(rootState, { owner_id }));
      this.setComments({ comments });
      this.setCommentIsLoading({ isCommentLoading: false });
    },

    async getNextClause({ clause_id }, rootState) {
      try {
        this.setIsLoading({ isLoading: true });
        try {
          const result = (await getNextClauseSibling(addTransportAppContext(rootState, {
            clause_id,
          })));
          const { suggestion } = result;
          this.addSelectedSuggestion({ suggestion });
        } finally {
          this.setIsLoading({ isLoading: false });
        }
      } catch (error) {
        dispatch.app.setError({ error });
      }
    },

    async saveComment(values, rootState) {
      this.setCommentIsLoading({ isCommentLoading: true });
      this.setComments({ comments: [] });
      const { comments } = await saveComment(addTransportAppContext(rootState, values));
      this.setComments({ comments });
      this.setCommentIsLoading({ isCommentLoading: false });
    },

    async search({ document_text }, rootState) {
      try {
        this.setIsLoading({ isLoading: true });
        let suggestions;
        try {
          const result = (await getSuggestions(addTransportAppContext(rootState, {
            clause_text: rootState.suggestion.searchText,
            clause_text_extra: rootState.suggestion.searchExtraText,
            document_text,
            workspace_id: rootState.app.appContext.workspace_id,
          })));
          suggestions = result.suggestions;

          this.clearSuggestionStatus();
          this.setSuggestionFilter({ filter: {} });
          this.setPreferDocumentTypeID({ prefer_document_type_id: result.prefer_document_type_id });

          this.setSuggestions({ suggestions, moreAvailable: suggestions.length > 0 });
        } finally {
          this.setIsLoading({ isLoading: false });
        }

        this.loadTrigramCounts({ suggestions });

        dispatch.app.setSidebarTab({ sidebarTab: SIDEBAR_TAB_SUGGESTION_RESULT });
      } catch (error) {
        dispatch.app.setError({ error });
      }
    },

    async searchRefine(__, rootState) {
      try {
        const {
          suggestions, searchText, searchExtraText, goodSuggestions, filter, prefer_document_type_id,
        } = rootState.suggestion;

        const exclude_clause_id = suggestions.map((sug) => sug.id);

        this.setIsLoading({ isLoading: true });
        try {
          const newSuggestions = (await getSuggestions(addTransportAppContext(rootState, {
            ...filter,
            clause_text: searchText,
            clause_text_extra: searchExtraText,
            exclude_clause_id,
            prefer_document_type_id,
            good_suggestions: suggestions.filter((sug) => goodSuggestions.includes(sug.id)).map((sug) => sug.clause_text),
          }))).suggestions;

          const allSuggs = suggestions.concat(newSuggestions);

          this.setSuggestions({ suggestions: allSuggs, moreAvailable: newSuggestions.length > 0 });

          this.loadTrigramCounts({ suggestions: newSuggestions }); // async
        } finally {
          this.setIsLoading({ isLoading: false });
        }
      } catch (error) {
        dispatch.app.setError({ error });
      }
    },

    async searchFilter(__, rootState) {
      try {
        const {
          suggestions, searchText, searchExtraText, goodSuggestions, filter, badSuggestions, prefer_document_type_id,
        } = rootState.suggestion;

        const exclude_clause_id = badSuggestions; // only exclude bad suggestions when filter is updated

        this.setIsLoading({ isLoading: true });
        this.setSuggestions({ suggestions: [] });
        try {
          const { suggestions: newSuggestions } = await getSuggestions(addTransportAppContext(rootState, {
            ...filter,
            clause_text: searchText,
            clause_text_extra: searchExtraText,
            exclude_clause_id,
            prefer_document_type_id,
            good_suggestions: suggestions.filter((sug) => goodSuggestions.includes(sug.id)).map((sug) => sug.clause_text),
          }));

          this.setSuggestions({ suggestions: newSuggestions, moreAvailable: newSuggestions.length > 0 }); // replace all suggestions, but keep good/bad ids

          this.loadTrigramCounts({ suggestions: newSuggestions }); // async
        } finally {
          this.setIsLoading({ isLoading: false });
        }
      } catch (error) {
        dispatch.app.setError({ error });
      }
    },

    markGoodSuggestion({ id }) {
      this.setSuggestionStatus({ id, good: true });

      dispatch.activity.addActivity({ activity_type: ACTIVITY_DT_SUGGESTION_LIKED, activity_data: { clause_id: id }, owner_id: id });
    },

    markBadSuggestion({ id }) {
      this.setSuggestionStatus({ id, good: false });

      dispatch.activity.addActivity({ activity_type: ACTIVITY_DT_SUGGESTION_DISLIKED, activity_data: { clause_id: id }, owner_id: id });
    },

    async updateUnusualPhrases({ highlight, clauseTypeID }, rootState) {
      const clauseTypeChanged = (rootState.suggestion.unusualPhrases.clauseTypeID !== clauseTypeID);
      const load = highlight && (!rootState.suggestion.unusualPhrases.highlight || clauseTypeChanged);

      this.setUnusualPhrases({ highlight, clauseTypeID });

      if (clauseTypeChanged) {
        this.setSuggestions({ suggestions: rootState.suggestion.suggestions.map((sug) => ({ ...sug, trigrams: null })) });
      }

      if (load) {
        await this.loadTrigramCounts({ suggestions: rootState.suggestion.suggestions });
      }
    },

    async loadTrigramCounts({ suggestions }, rootState) {
      const {
        unusualPhrases, searchText, searchExtraText, goodSuggestions,
      } = rootState.suggestion;
      try {
        if (!unusualPhrases.highlight || !suggestions.length) {
          return;
        }

        this.setUnusualPhrases({ loading: true });

        const { texts, maxCount } = await getTrigramCounts(addTransportAppContext(rootState, {
          clause_type_id: unusualPhrases.clauseTypeID,
          texts: suggestions.map((sug) => ({ id: sug.id, text: sug.clause_text })),

          clause_text: searchText,
          clause_text_extra: searchExtraText,
          good_suggestions: suggestions.filter((sug) => goodSuggestions.includes(sug.id)).map((sug) => sug.clause_text),
        }));

        this.setUnusualPhrases({ maxCount });
        this.setTrigrams({ texts });
      } catch (error) {
        dispatch.app.setError({ error });
      }
    },

  }),

};
