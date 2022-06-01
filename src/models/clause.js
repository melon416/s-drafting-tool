import { saveClause, searchClauses, setClauseFavorite } from '../dataCalls/clause';
import { getNextClauseSibling, getTrigramCounts, saveComment } from '../dataCalls/suggestions';
import { addTransportAppContext } from '../dataCalls/transport';
import { SIDEBAR_TAB_BROWSER_RESULT} from '../consts';

export const clause = {

  state: {
    addClauseText: '',
    clauses: [],

    suggestions: [],
    goodSuggestions: [],
    badSuggestions: [],
    searchText: '',
    searchExtraText: '',
    moreAvailable: true,
    isLoading: false,
    wasLoaded: false,
    filter: {},
    titleFilter: [],
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
    setAddClauseText(state, { text, wasLoaded }) {
      return {
        ...state,
        addClauseText: text,
        wasLoaded
      };
    },
    setIsLoading(state, { isLoading, wasLoaded }) {
      return {
        ...state,
        isLoading,
        wasLoaded,
      };
    },
    saveClauses(state, clauses) {
      return {
        ...state,
        clauses: [...clauses],
        isLoading: false,
        wasLoaded: true
      }
    },
    setSuggestions(state, { suggestions, moreAvailable }) {
      return {
        ...state,
        suggestions,
        moreAvailable: (moreAvailable === undefined) ? state.moreAvailable : moreAvailable,
      };
    },

    // setTrigrams(state, { texts }) {
    //   const indexed = _.keyBy(texts, 'id');
    //   return {
    //     ...state,
    //     suggestions: state.suggestions.map((sug) => (indexed[sug.id] ? { ...sug, trigrams: indexed[sug.id].trigrams } : sug)),
    //   };
    // },

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

    setClauseFilter(state, { filter }) {
      return {
        ...state,
        filter,
      };
    },

    setTitleFilter(state, { titleFilter }) {
      return {
        ...state,
        titleFilter
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

    async saveClause({ values }, rootState) {
      try {
        const { clause } = await saveClause(addTransportAppContext(rootState, {
          ...values,
          workspace_id: rootState.app.appContext.workspace_id,
        }));

        return clause.id;
      } catch (error) {
        await dispatch.app.addError({ error });
        return null;
      }
    },

    async setFavorite({clause_id, is_favorite}, rootState) {
      dispatch.clause.update({clause_id, clause: {is_favorite}});

      const {clause, activities} = await setClauseFavorite(addTransportAppContext(rootState, {
          clause_id,
          is_favorite
      }));

      dispatch.clause.update({clause_id, clause});
    },

    async searchClauses({ filter }, rootState) {
      this.setIsLoading({ isLoading: true });
      try {
        const { clauses } = await searchClauses(addTransportAppContext(rootState, {
          ...filter,
          workspace_id: rootState.app.appContext.workspace_id,
        }));
        return clauses;
      } catch (error) {
        await dispatch.app.addError({ error });
        return null;
      } finally {
        this.setIsLoading({ isLoading: false, wasLoaded: true });
      }
    },

    async handleLoadClause(clauses) {
      try {
        this.setIsLoading({ isLoading: true });

        try {
          this.clearSuggestionStatus();
          this.setSuggestions({ suggestions: clauses, moreAvailable: clauses.length > 0 });
        } finally {
          this.setIsLoading({ isLoading: false });
        }

        this.loadTrigramCounts({ clauses });

        dispatch.app.setSidebarTab({ sidebarTab: SIDEBAR_TAB_BROWSER_RESULT });
      } catch (error) {
        dispatch.app.setError({ error });
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
    
  }),

};
