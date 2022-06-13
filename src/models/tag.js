/**
 *  tag is a rematch model for tags
 */

/**
 * Change-Log:
 * - 6/5/2022, Attia, update requestTags to fetch tags by type
 */

/* eslint-disable camelcase */
import moize from 'moize';
import _ from 'lodash';
import {fetchTags} from '../dataCalls/tags';
import {addTransportAppContext} from '../dataCalls/transport';
import {
    TAG_TYPE_AUTHOR,
    TAG_TYPE_CLAUSE_TYPE, TAG_TYPE_CLIENT, TAG_TYPE_DOCUMENT_TYPE,
    TAG_TYPE_JURISDICTION, TAG_TYPE_MATTER_NUMBER, TAG_TYPE_OTHER,
    TAG_TYPE_PARTY,
    TAG_TYPE_PRACTICE_GROUP,
    TAG_TYPE_SECTOR
} from "../consts";

export const tag = {
    state: {
        tags: [],
        tagsLoaded: true,
        practiceGroupsOptions: [],
        jurisdictionOptions: [],
        sectorOptions: [],
        partiesOptions: [],
        clauseTypesOptions: [],
        documentTypesOptions: [],
        clientsOptions: [],
        matterNumbersOptions: [],
        authorsOptions: [],
        otherOptions: [],
        suiteOptions: [],
    },

    reducers: {
        setTags(state, {tags}) {
            return {
                ...state,
                tags,
            };
        },
        resetTags(state) {
            return {
                ...state,
                tags: [],
                practiceGroupsOptions: [],
                jurisdictionOptions: [],
                sectorOptions: [],
                partiesOptions: [],
                clauseTypesOptions: [],
                documentTypesOptions: [],
                clientsOptions: [],
                matterNumbersOptions: [],
                authorsOptions: [],
                otherOptions: [],
                suiteOptions: [],
            }
        },
        setTagTypeOptions(state, {tagTypeOptions, tagType}) {
            let keyMap = {
                [TAG_TYPE_PRACTICE_GROUP]: 'practiceGroupsOptions',
                [TAG_TYPE_JURISDICTION]: 'jurisdictionOptions',
                [TAG_TYPE_SECTOR]: 'sectorOptions',
                [TAG_TYPE_PARTY]: 'partiesOptions',
                [TAG_TYPE_CLAUSE_TYPE]: 'clauseTypesOptions',
                [TAG_TYPE_DOCUMENT_TYPE]: 'documentTypesOptions',
                [TAG_TYPE_CLIENT]: 'clientsOptions',
                [TAG_TYPE_MATTER_NUMBER]: 'matterNumbersOptions',
                [TAG_TYPE_AUTHOR]: 'authorsOptions',
                [TAG_TYPE_OTHER]: 'otherOptions',
            }

            let key = keyMap[tagType];

            return {
                ...state,
                [key]: tagTypeOptions,
            }
        },

    },

    effects: (dispatch) => ({
        async getTagsWithType({tagType, withNegations, input}, rootState) {

            let {tags} = await fetchTags(addTransportAppContext(rootState, {
                tag_type: tagType,
                similar_tag_name: input,
            }));
            let tagTypeOptions = withNegations ? getOptionsWithNegations(getTagOptionsForType(tags, tagType)) : getTagOptionsForType(tags, tagType);
            this.setTags({tags});
            this.setTagTypeOptions({tagTypeOptions: tagTypeOptions, tagType: tagType});
        }
    }),

};

const getTagTree = moize.simple((tags) => {
  function recurse(items) {
    return items.map((item) => ({
      ...item,
      children: recurse(tags.filter((s) => s.parent_id === item.tag_id)),
    }));
  }

  return recurse(tags.filter((s) => !s.parent_id));
});

const getTagOptions = moize.simple((tags) => {
  const tree = getTagTree(tags);

  const result = [];

  function recurse(items, name_prefix, filter_prefix) {
    items.forEach((item) => {
      result.push({
        key: item.tag_id,
        name: name_prefix + item.tag_name,
        filter: `${filter_prefix} ${item.tag_name}\n${item.tag_name_unaccented}\n${item.tag_id}`,
        owner_id: item.owner_id,
        tag_type: item.tag_type,
      });

      if (item.children.length) {
        recurse(item.children, `${name_prefix + item.tag_name} / `, `${filter_prefix + item.tag_name_unaccented}\n`);
      }
    });
  }

  recurse(tree, '', '');

  return result;
});

export const getTagsIndexed = moize.simple((tags) => _.keyBy(getTagOptions(tags), 'value'));

export const getTagOptionsForType = moize.maxSize(10)((tags, tag_type) => getTagOptions(tags).filter((option) => option.tag_type === tag_type));

export const getOptionsWithNegations = moize.maxSize(10)((options) => _.flatMap(options, (o) => [o, { key: -o.key, name: `-- NOT ${o.name}` }]));

export const getTagsForType = (tags, tag_type) => tags.filter((tag) => tag.tag_type === tag_type);

const getChildTagIds = (tags, parentId) => {
  const children = _.filter(tags, ({ parent_id }) => parentId === parent_id).map(({ tag_id }) => tag_id);
  let result = children;

  if (children.length > 0) {
    for (let index = 0; index < children.length; index += 1) {
      result = _.union(result, getChildTagIds(tags, children[index]));
    }
  }

  return result;
};

export const getExpandedTagIds = (tags, ids) => {
  let expandedIds = ids;

  if (ids) {
    ids.forEach((id) => {
      if (id > 0) {
        expandedIds = expandedIds.concat(getChildTagIds(tags, id));
      } else {
        expandedIds = expandedIds.concat(getChildTagIds(tags, -id).map((id) => -id));
      }
    });
  }

  return expandedIds;
};
