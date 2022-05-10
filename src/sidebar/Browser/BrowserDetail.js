/* eslint-disable camelcase */
import React, { Component } from 'react';
import { AccountCircle } from '@material-ui/icons';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { Text } from 'office-ui-fabric-react/lib/Text';
import { Separator } from 'office-ui-fabric-react/lib/Separator';
import {
  PrimaryButton, DefaultButton, Link, Dropdown, ResponsiveMode,
} from 'office-ui-fabric-react';
import _ from 'lodash';
import { LayoutRow, LayoutRows } from '../../shared/components/Layout';
import {
  ACTIVITY_DT_SUGGESTION_LINK_FOLLOWED, BOOKMARK_TYPE_CLAUSE, SIDEBAR_TAB_BROWSER_RESULT, WORKSPACE_ID_DEFAULT,
} from '../../consts';
import { getClauseBankURLPrefix } from '../../utils';
import { isArrayEmpty } from '../../shared/clientUtils';
import { formatDateTime } from '../../shared/date';
import CommentEditor from '../Suggestion/CommentEditor';
import Loading from '../../components/Loading';

class BrowserDetail extends Component {
	state = {
	  showCommentForm: false,
	  commentHtml: '',
	  rawComment: '',
	  context: null,
	};

	async componentDidMount() {
	  const { selectedSuggestion } = this.props;
	  const copy = [...selectedSuggestion];
	  copy.reverse();

	}

  handleLinkClick = () => {
    const { selectedSuggestion, addActivity } = this.props;
    const copy = [...selectedSuggestion];
    copy.reverse();

    addActivity(ACTIVITY_DT_SUGGESTION_LINK_FOLLOWED, { clause_id: copy[0].clause_id }, copy[0].clause_id);
  }

  handleAddComment = () => {
    this.setState({
      showCommentForm: true,
    });
  }

  handleSubmit = () => {
    const { commentHtml, rawComment } = this.state;
    const { saveComment, selectedSuggestion } = this.props;
    const copy = [...selectedSuggestion];
    copy.reverse();

    if (commentHtml) {
      saveComment({ comment_text: commentHtml, raw: JSON.stringify(rawComment), owner_id: selectedSuggestion[0].clause_id });

      this.setState({
        showCommentForm: false,
      });
    }
  }

  handleCancel = () => {
    this.setState({
      showCommentForm: false,
    });
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleBookmarkToggle = () => {
    const {
      selectedSuggestion, bookmarks, deleteBookmark, saveBookmark,
    } = this.props;
    const copy = [...selectedSuggestion];
    copy.reverse();

    const bookmarkInfo = bookmarks.find(({ owner_id }) => owner_id === copy[0].clause_id);

    if (bookmarkInfo) {
      deleteBookmark({
        bookmark_id: bookmarkInfo.bookmark_id,
      });
    } else {
      saveBookmark({
        bookmark_type: BOOKMARK_TYPE_CLAUSE,
        owner_id: copy[0].clause_id,
      });
    }
  }

  getArrayAsTextSentence = (ar, prefix) => {
    if (isArrayEmpty(ar)) {
      return '';
    }

    if (ar.length === 1) {
      return prefix + ar[0];
    }

    // eslint-disable-next-line no-param-reassign
    ar = [...ar];
    const last = ar.pop();

    return `${prefix}${ar.join(', ')} and ${last}`;
  }

  isBookmarked = () => {
    const { selectedSuggestion, bookmarks } = this.props;
    const copy = [...selectedSuggestion];
    copy.reverse();

    if (copy[0]) {
      return bookmarks.find(({ owner_id }) => owner_id === copy[0].clause_id);
    }
    return false;
  }

  showNextClause = () => {
    const { selectedSuggestion, getNextClause } = this.props;
    const copy = [...selectedSuggestion];
    const { context } = this.state;
    
    copy.reverse();
    if (context) {
      getNextClause(context.clause_id);
      this.setState({
        context: null,
      });
    } else if (copy[0]) getNextClause(copy[0].clause_id);
  }

  renderDocumentInfo = () => {
    const { selectedSuggestion } = this.props;

    if (!selectedSuggestion[0] && isArrayEmpty(selectedSuggestion[0].documents)) {
      return null;
    }

    const { documents } = selectedSuggestion[0];

    const document_types = _.uniq(_.flatMap(documents.map((d) => d.document_type_id)).filter((x) => x));
    const clients = _.uniq(_.flatMap(documents.map((d) => d.client_id)).filter((x) => x));
    const clause_type = selectedSuggestion[0].clause_type_name;

    return (
      <div>
        Clause types: {!clause_type ? "None specified or predicted" : clause_type.join(", ")}
        <br />
        <br />
        Source Documents: Found in
        {' '}
        {documents.length}
        {' '}
        locations in this workspace
        {this.getArrayAsTextSentence(document_types, ', including ')}
        {this.getArrayAsTextSentence(clients, ' for ')}
        <br />
        <br />
      </div>
    );
  }

  renderComment = (comment) => {
    const { usersname, users_picture, date_added } = comment;

    return (
      <div className="Comment">
        {users_picture ? <img className="CommentUserPicture" src={users_picture} alt="Comment User" /> : <AccountCircle />}
        <div>
          <div className="CommentUsername">{usersname}</div>
          <CommentEditor
            readOnly
            defaultValue={comment}
          />
          <div className="CommentDate">{formatDateTime(date_added)}</div>
        </div>
      </div>
    );
  }

  handleContextChange = (e, selectedOption) => {
    this.setState({
      context: selectedOption,
    });
  }

  renderShowMore() {
    const { context } = this.state;
    const { selectedSuggestion } = this.props;
    const copy = [...selectedSuggestion];
    copy.reverse();

    let computedDocuments = [];
    if (selectedSuggestion && copy[0]) {
      const { clause_id, documents } = copy[0];
      computedDocuments = documents ? documents.filter(({ is_deleted }) => !is_deleted).map(({
        doc_id, doc_title, clause_id: clauseID, is_fake,
      }) => ({
        key: `${doc_id}-${clauseID}`,
        text: is_fake ? `position ${clauseID}` : `document ID ${doc_id}, ${doc_title}, at position ${clauseID}`,
        clause_id: clauseID,
        document_id: doc_id,
      })) : [{
        key: 1,
        text: `position ${clause_id}`,
        clause_id,
      }];
    }

    return (
      <>
        <LayoutRow
          className="SuggestionBox"
        >
          {selectedSuggestion.map((el, index) => (
            <div className="tabThree_infoText" key={`suggestion-${index}`}>
              <div className="PreWrapped">
                <div className={`ClauseText ${index !== 0 ? 'attached' : ''} ${!el ? 'bold' : ''}`}>{ el ? el.clause_text : '<end of document>' }</div>
              </div>
            </div>
          ))}
        </LayoutRow>
        {computedDocuments.length > 1 &&
        <LayoutRow>
          <Dropdown
            options={computedDocuments}
            responsiveMode={ResponsiveMode.large}
            label=""
            onChange={this.handleContextChange}
            defaultSelectedKey={context ? context.key : selectedSuggestion.length > 0 && copy[0] ? computedDocuments.find((el) => el.clause_id === copy[0].clause_id).key : null}
            disabled={!copy[0] || !copy[0].documents}
            style={{ marginTop: 20 }}
          />
        </LayoutRow>}
        <LayoutRow>
          <PrimaryButton
            onClick={this.showNextClause}
            style={{ marginRight: 20, marginTop: 20 }}
            className="primary-red-button"
            disabled={!copy[0]}
          >
            Show More
          </PrimaryButton>
        </LayoutRow>
      </>
    );
  }

  render() {
    const {
      setSidebarTab, selectedSuggestion, comments, users, isCommentLoading, workspaceId,
    } = this.props;

    const copy = [...selectedSuggestion];
    copy.reverse();

    const { showCommentForm, rawComment } = this.state;
    const bookmarked = this.isBookmarked();
    const isChanged = rawComment ? rawComment.blocks.some((block) => block.text.replace(/\s/g, '') !== '') : false;
    return (
      <div className="SuggestionResult SelectedSuggestion">
        <LayoutRows>
          <LayoutRow>
            <CommandBar
              styles={{
							  icon: { color: 'black' },
              }}
              className="SuggestionResultCommandBar"
              items={[{
							  key: 'back',
							  iconProps: {
							    iconName: 'ChevronLeft',
							  },
							  buttonStyles: {
							    icon: { color: 'black' },
							    iconHovered: { color: 'black' },
							  },
							  onClick: () => {
							    setSidebarTab(SIDEBAR_TAB_BROWSER_RESULT);
							  },
              }, {
							  key: 'sugs',
							  name: <Text className="SuggestionTitle" variant="large">Selected Clause</Text>,
							  disabled: true,
              }, {
							  key: 'bookmark',
							  iconProps: {
							    iconName: bookmarked ? 'SingleBookmarkSolid' : 'SingleBookmark',
							  },
							  buttonStyles: {
							    icon: { color: bookmarked ? '#b82e2e' : 'black' },
							    iconHovered: { color: bookmarked ? '#b82e2e' : 'black' },
							  },
							  onClick: this.handleBookmarkToggle,
              }]}
            />
          </LayoutRow>
          <LayoutRow>
            <Separator />
          </LayoutRow>
          <LayoutRow flexible scrolling className="SuggestionContainer">
            {this.renderShowMore()}
            <LayoutRow>
              <Separator />
            </LayoutRow>
            <LayoutRow>
              <div className="SectionTitle">More Information</div>
              { selectedSuggestion.length > 0 && this.renderDocumentInfo() }
              {
                selectedSuggestion[0]
						    ? (
                  <Link onClick={this.handleLinkClick} href={`${getClauseBankURLPrefix()}/w/${workspaceId || WORKSPACE_ID_DEFAULT}/clause/${selectedSuggestion[0].clause_id}`} target="_blank">
                    View
                    {' '}
                    {selectedSuggestion[0].clause_title || 'clause'}
                    {' '}
                    in Knowledge Bank
                  </Link>
                  )
						    : <div style={{ marginTop: '10px', fontSize: '12px' }}>Source clause not found in Knowledge Bank</div>
					    }
            </LayoutRow>
            <LayoutRow>
              <Separator />
            </LayoutRow>
            <LayoutRow>
              <div className="SectionTitle">Comments</div>
              {
                showCommentForm
                  ? (
                    <div>
                      <CommentEditor
                        users={users}
                        autoFocus
                        onChange={(commentHtml, rawComment) => this.setState({ commentHtml, rawComment })}
                        placeholder="Enter comment to this clause. Use @username to notify other users."
                      />
                      {/* <TextField multiline resizable={false} style={{marginBottom: 10}} name="comment" value={comment} onChange={this.handleChange} placeholder="Enter comment to this clause. Use @username to notify other users." /> */}
                      <PrimaryButton
                        className="primary-red-button"
                        style={{ marginRight: 10, marginTop: 10 }}
                        onClick={this.handleSubmit}
                        disabled={!isChanged}
                      >
                        Submit
                      </PrimaryButton>
                      <DefaultButton
                        onClick={this.handleCancel}
                      >
                        Cancel
                      </DefaultButton>
                    </div>
                  )
                  : (
                    <DefaultButton
                      onClick={this.handleAddComment}
                    >
                      Add Comment
                    </DefaultButton>
                  )
              }
              { isCommentLoading && <Loading /> }
              {
                comments.length > 0
                  ? comments.map((comment, key) => <LayoutRow key={key}>{this.renderComment(comment)}</LayoutRow>)
                  : (!isCommentLoading && <LayoutRow><div className="NoComment">There are no comments to this clause.</div></LayoutRow>)
              }
            </LayoutRow>
          </LayoutRow>
        </LayoutRows>
      </div>
    );
  }
}

export default BrowserDetail;
