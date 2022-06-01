/* eslint-disable camelcase */
import moize from 'moize';
import _ from 'lodash';
import {
  getDocumentFile,
  searchDocuments,
} from '../dataCalls/documents';
import { formatDatePlain } from '../shared/date';
import { addTransportAppContext } from '../dataCalls/transport';
import { addMultiIDFilterOption } from '../utils';

export const document = {
  state: {
    documents: [],
    isLoading: false,
    wasLoaded: false,
    filter: {},
    moreDocumentsAvailable: false,
    recentSearches: [],
  },

  reducers: {
    setDocuments(state, { documents, moreDocumentsAvailable, wasLoaded }) {
      return {
        ...state,
        documents,
        moreDocumentsAvailable,
        wasLoaded,
      };
    },
    setIsLoading(state, { isLoading, wasLoaded }) {
      return {
        ...state,
        isLoading,
        wasLoaded,
      };
    },
    setFilter(state, { filter }) {
      return {
        ...state,
        filter,
      };
    },
    addRecentSearch(state, { filter }) {
      const copyFilter = { ...filter };
      delete copyFilter.time;

      if (copyFilter.most_recent) {
        return state;
      }

      return {
        ...state,
        recentSearches: [{ copyFilter }].concat(state.recentSearches
          .filter((s) => !_.isEqual(s.filter, copyFilter)))
          .slice(0, 5),
      };
    },
  },

  effects: (dispatch) => ({
    async searchDocuments({ filter }, rootState) {
      this.setFilter({ filter });

      this.setIsLoading({ isLoading: true });
      this.resetDocuments();
      try {
        const { documents, moreDocumentsAvailable } = await searchDocuments(addTransportAppContext(rootState, {
          ...filter,
          workspace_id: rootState.app.appContext.workspace_id,
          logSearch: true,
        }));

        this.addRecentSearch({ filter });

        this.setDocuments({
          // Should use /\.(doc|docx|odt|rtf|txt)$/i.test to support 5 text file types later on
          documents: documents.filter(({ doc_file_name }) => !!doc_file_name && /\.(doc|docx)$/i.test(doc_file_name.toLowerCase())),
          moreDocumentsAvailable,
        });
      } finally {
        this.setIsLoading({ isLoading: false, wasLoaded: true });
      }
    },

    async loadMoreDocuments(__, rootState) {
      this.setIsLoading({ isLoading: true });
      try {
        const filter = {
          ...rootState.document.filter,
          exclude_doc_id: rootState.document.documents.map((c) => c.doc_id),
          is_load_more: true,
          logSearch: true,
        };
        const { documents, moreDocumentsAvailable } = await searchDocuments(addTransportAppContext(rootState, filter));

        this.setDocuments({
          documents: rootState.document.documents.concat(documents),
          moreDocumentsAvailable,
        });
        dispatch.document.syncWithBookmarks();
      } finally {
        this.setIsLoading({ isLoading: false });
      }
    },

    async refreshDocuments(__, rootState) {
      // it would probably be better to only reload the 1 document and update it
      this.searchDocuments(addTransportAppContext(rootState, { filter: rootState.document.filter, logSearch: false }));
      dispatch.document.syncWithBookmarks();
    },

    async resetDocuments() {
      this.setDocuments({
        documents: [],
        moreDocumentsAvailable: false,
        wasLoaded: false,
      });
    },

    async getDocumentFile({ doc_id }, rootState) {
      const { document } = await getDocumentFile(addTransportAppContext(rootState, { doc_id, download_type: 'original' }));

      if (!document) {
        return null;
      }

      return new Uint8Array(document.data);
    },
  }),

};

export const getDocument = moize.simple((documents, documentID) => documents.find((doc) => doc.id === documentID));

export function convertDocumentFilterToCriteriaOptions(tagsIndexed, filterData) {
  const result = [];

  const filter = filterData || {};
  if (filter.quick) {
    result.push({
      value: 'quick',
      label: `Quick: ${filter.quick.join(' or ')}`,
    });
  }

  if (filter.doc_id) {
    result.push({
      value: 'doc_id',
      label: `Document: ${filter.doc_id.join(' or ')}`,
    });
  }

  if (filter.clause_id) {
    result.push({
      value: 'clause_id',
      label: `Clause: ${filter.clause_id.join(' or ')}`,
    });
  }

  if (filter.concept_id) {
    result.push({
      value: 'concept_id',
      label: `Concept: ${filter.concept_id.join(' or ')}`,
    });
  }

  if (filter.similar_doc_id) {
    result.push({
      value: 'similar_doc_id',
      label: `Similar to Document: ${filter.similar_doc_id.join(' or ')}`,
    });
  }

  if (filter.doc_title) {
    result.push({
      value: 'doc_title',
      label: `Name: ${filter.doc_title.join(' or ')}`,
    });
  }

  if (filter.document_text) {
    result.push({
      value: 'document_text',
      label: `Text Search: ${filter.document_text.length > 50 ? `${filter.document_text.substr(0, 50)}...` : filter.document_text}`,
    });
  }

  addMultiIDFilterOption(result, filter, tagsIndexed, 'document_type_id', 'Type');
  addMultiIDFilterOption(result, filter, tagsIndexed, 'client_id', 'Client');
  addMultiIDFilterOption(result, filter, tagsIndexed, 'party_id', 'Party');
  addMultiIDFilterOption(result, filter, tagsIndexed, 'author_id', 'Author');
  addMultiIDFilterOption(result, filter, tagsIndexed, 'practice_group_id', 'Practice Group');
  addMultiIDFilterOption(result, filter, tagsIndexed, 'jurisdiction_id', 'Jurisdiction');
  addMultiIDFilterOption(result, filter, tagsIndexed, 'sector_id', 'Sector');
  addMultiIDFilterOption(result, filter, tagsIndexed, 'other_tag_id', 'Other Tag');

  if (filter.doc_date_from && filter.doc_date_to) {
    result.push({
      value: 'doc_date_from,doc_date_to',
      label: `Created between: ${formatDatePlain(filter.doc_date_from)} and ${formatDatePlain(filter.doc_date_to)}`,
    });
  } else {
    if (filter.doc_date_from) {
      result.push({
        value: 'doc_date_from',
        label: `Created from: ${formatDatePlain(filter.doc_date_from)}`,
      });
    }
    if (filter.doc_date_to) {
      result.push({
        value: 'doc_date_to',
        label: `Created until: ${formatDatePlain(filter.doc_date_to)}`,
      });
    }
  }

  if (filter.date_last_modified_from && filter.date_last_modified_to) {
    result.push({
      value: 'date_last_modified_from,date_last_modified_to',
      label: `Modified between: ${formatDatePlain(filter.date_last_modified_from)} and ${formatDatePlain(filter.date_last_modified_to)}`,
    });
  } else {
    if (filter.date_last_modified_from) {
      result.push({
        value: 'date_last_modified_from',
        label: `Modified from: ${formatDatePlain(filter.date_last_modified_from)}`,
      });
    }
    if (filter.date_last_modified_to) {
      result.push({
        value: 'date_last_modified_to',
        label: `Modified until: ${formatDatePlain(filter.date_last_modified_to)}`,
      });
    }
  }

  if (filter.most_recent) {
    result.push({
      value: 'most_recent',
      label: 'Most recently added documents',
    });
  }

  if (filter.endorsed) {
    result.push({
      value: 'endorsed',
      label: 'Endorsed documents',
    });
  }

  if (filter.recently_viewed) {
    result.push({
      value: 'recently_viewed',
      label: 'Recently viewed by you',
    });
  }

  if (filter.my_picks) {
    result.push({
      value: 'my_picks',
      label: 'My Content',
    });
  }

  return result;
}

export function convertDocumentBrowserFilterToCriteriaOptions(tagsIndexed, filterData) {
  const result = [];

  const filter = filterData || {};
  if (filter.quick) {
    result.push({
      value: 'quick',
      label: `Quick: ${filter.quick.join(' or ')}`,
    });
  }

  if (filter.doc_id) {
    result.push({
      value: 'doc_id',
      label: `Document: ${filter.doc_id.join(' or ')}`,
    });
  }

  if (filter.clause_id) {
    result.push({
      value: 'clause_id',
      label: `Clause: ${filter.clause_id.join(' or ')}`,
    });
  }

  if (filter.concept_id) {
    result.push({
      value: 'concept_id',
      label: `Concept: ${filter.concept_id.join(' or ')}`,
    });
  }

  if (filter.similar_doc_id) {
    result.push({
      value: 'similar_doc_id',
      label: `Similar to Document: ${filter.similar_doc_id.join(' or ')}`,
    });
  }

  if (filter.doc_title) {
    result.push({
      value: 'doc_title',
      label: `Name: ${filter.doc_title.join(' or ')}`,
    });
  }

  if (filter.document_text) {
    result.push({
      value: 'document_text',
      label: `Text Search: ${filter.document_text.length > 50 ? `${filter.document_text.substr(0, 50)}...` : filter.document_text}`,
    });
  }

  addMultiIDFilterOption(result, filter, tagsIndexed, 'document_type_id', 'Type');
  addMultiIDFilterOption(result, filter, tagsIndexed, 'client_id', 'Client');
  addMultiIDFilterOption(result, filter, tagsIndexed, 'party_id', 'Party');
  addMultiIDFilterOption(result, filter, tagsIndexed, 'author_id', 'Author');
  addMultiIDFilterOption(result, filter, tagsIndexed, 'practice_group_id', 'Practice Group');
  addMultiIDFilterOption(result, filter, tagsIndexed, 'jurisdiction_id', 'Jurisdiction');
  addMultiIDFilterOption(result, filter, tagsIndexed, 'sector_id', 'Sector');
  addMultiIDFilterOption(result, filter, tagsIndexed, 'other_tag_id', 'Other Tag');

  if (filter.doc_date_from && filter.doc_date_to) {
    result.push({
      value: 'doc_date_from,doc_date_to',
      label: `Created between: ${formatDatePlain(filter.doc_date_from)} and ${formatDatePlain(filter.doc_date_to)}`,
    });
  } else {
    if (filter.doc_date_from) {
      result.push({
        value: 'doc_date_from',
        label: `Created from: ${formatDatePlain(filter.doc_date_from)}`,
      });
    }
    if (filter.doc_date_to) {
      result.push({
        value: 'doc_date_to',
        label: `Created until: ${formatDatePlain(filter.doc_date_to)}`,
      });
    }
  }

  if (filter.date_last_modified_from && filter.date_last_modified_to) {
    result.push({
      value: 'date_last_modified_from,date_last_modified_to',
      label: `Modified between: ${formatDatePlain(filter.date_last_modified_from)} and ${formatDatePlain(filter.date_last_modified_to)}`,
    });
  } else {
    if (filter.date_last_modified_from) {
      result.push({
        value: 'date_last_modified_from',
        label: `Modified from: ${formatDatePlain(filter.date_last_modified_from)}`,
      });
    }
    if (filter.date_last_modified_to) {
      result.push({
        value: 'date_last_modified_to',
        label: `Modified until: ${formatDatePlain(filter.date_last_modified_to)}`,
      });
    }
  }

  if (filter.bookmarked) {
    result.push({
      value: 'bookmarked',
      label: 'Bookmarked content',
    });
  }

  if (filter.endorsed) {
    result.push({
      value: 'endorsed',
      label: 'Endorsed documents',
    });
  }

  if (filter.favourite) {
    result.push({
      value: 'favourite',
      label: 'Favourite content',
    });
  }

  if (filter.my_picks) {
    result.push({
      value: 'my_picks',
      label: 'My Content',
    });
  }

  return result;
}
