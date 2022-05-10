/* eslint-disable camelcase */
import { Callout, DirectionalHint, Link } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import _ from 'lodash';
import { ACTIVITY_DT_SUGGESTION_LINK_FOLLOWED, WORKSPACE_ID_DEFAULT } from '../../consts';
import { getClauseBankURLPrefix } from '../../utils';
import { isArrayEmpty } from '../../shared/clientUtils';
import { formatDate } from '../../shared/date';

function getArrayAsTextSentence(ar, prefix) {
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

export default class InfoBox extends Component {
	handleLinkClick = () => {
	  const { clause_id, addActivity } = this.props;
	  addActivity(ACTIVITY_DT_SUGGESTION_LINK_FOLLOWED, { clause_id }, clause_id);
	};

	renderDocumentInfo() {
	  const { suggestion: { documents } } = this.props;
	  if (isArrayEmpty(documents)) {
	    return null;
	  }

	  if (documents.length === 1) {
	    return (
        <div>
          Found in
          {' '}
          {documents[0].doc_title}
          , dated
          {' '}
          {formatDate(documents[0].doc_date)}
          {getArrayAsTextSentence(documents[0].client_id, ' for ')}
          .
          <br />
          <br />
        </div>
	    );
	  }

	  const document_types = _.uniq(_.flatMap(documents.map((d) => d.document_type_id)).filter((x) => x));
	  const clients = _.uniq(_.flatMap(documents.map((d) => d.client_id)).filter((x) => x));

	  return (
      <div>
        Found in
        {' '}
        {documents.length}
        {' '}
        locations in this workspace
        {getArrayAsTextSentence(document_types, ', including ')}
        {getArrayAsTextSentence(clients, ' for ')}
        .
        <br />
        <br />
      </div>
	  );
	}

	render() {
	  const { suggestion: { clause_id, clause_title }, positionElement, infoBoxClose } = this.props;

	  return (
      <Callout
        className="ms-CalloutExample-callout tabThree_infoPopup"
        gapSpace={undefined}
        target={positionElement}
        isBeakVisible
        beakWidth={undefined}
        onDismiss={infoBoxClose}
        directionalHint={DirectionalHint.leftCenter}
      >
        <div>
          <p className="ms-CalloutExample-title ms-font-xl">
            More information
          </p>
        </div>
        <div>
          {this.renderDocumentInfo()}
          <div>
            {clause_id
					  ? (
                <Link onClick={this.handleLinkClick} href={`${getClauseBankURLPrefix()}/w/${WORKSPACE_ID_DEFAULT}/clause/${clause_id}`} target="_blank">
                  View
                  {' '}
                  {clause_title || 'clause'}
                  {' '}
                  in Clause Bank
                </Link>
              )
					  : <div style={{ marginTop: '10px', fontSize: '12px' }}>Source clause not found in Clause Bank</div>}
          </div>
        </div>
      </Callout>
	  );
	}
}
