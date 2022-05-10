import React, { Component } from 'react';
import { connect } from 'react-redux';
import Editor from './Editor';

class EditorContainer extends Component {
  render() {
    const { editorRef, ...rest } = this.props;
    return (
      <Editor
        ref={editorRef}
        {...rest}
      />
    );
  }
}

const mapStateToProps = () => ({
});

const mapDispatchToProps = (dispatch) => ({
  addActivity: (activityType, activityData, ownerId) => dispatch.activity.addActivity({ activity_type: activityType, activity_data: activityData, owner_id: ownerId }),
  getDocumentFile: (docId) => dispatch.document.getDocumentFile({ doc_id: docId }),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorContainer);
