import React from 'react';
import Editor from 'draft-js-plugins-editor';
import 'draft-js/dist/Draft.css';
import 'draft-js-mention-plugin/lib/plugin.css';
import {
  EditorState, convertToRaw, ContentState, convertFromRaw,
} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';

export default class MentionEditor extends React.Component {
  mentionPlugin = createMentionPlugin({
    mentionComponent: (mentionProps) => (
      <span className="Pill Mention">
        {mentionProps.children}
      </span>
    ),
    positionSuggestions: (settings) => {
        return {
            left: `${settings.decoratorRect.left}px`,
            top: `${settings.decoratorRect.top - 10}px`,
            display: 'block',
            transform: 'scale(1) translateY(-100%)',
            zindex: 10000,
            position: 'fixed'
        }
    },
  });

  constructor(props) {
    super(props);
    this.state = {
      editorState: this.getInitialEditorState(),
      suggestions: props.users,
    };
  }

  getInitialEditorState() {
    const { defaultValue } = this.props;
    if (defaultValue && defaultValue.raw) {
      const blocks = convertFromRaw(defaultValue.raw);
      return EditorState.createWithContent(blocks);
    }

    if (defaultValue && defaultValue.comment_text) {
      const contentBlock = htmlToDraft(defaultValue.comment_text || '');
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      return EditorState.createWithContent(contentState);
    }

    return EditorState.createEmpty();
  }

  onEditorStateChange = (editorState) => {
      const { readOnly, onChange } = this.props;
      console.log("onEditorStateChange", readOnly, editorState, onChange);
    if (!readOnly) {
      const raw = convertToRaw(editorState.getCurrentContent());
      onChange(draftToHtml(raw), raw);
    }
    this.setState({ editorState });
  };

  onSearchChange = ({ value }) => {
    const { users } = this.props;
    const suggestions = defaultSuggestionsFilter(value, users);

    this.setState({
      suggestions: suggestions.length ? suggestions : [{ name: value }],
    });
  };

  render() {
    const { placeholder, readOnly } = this.props;
    const { editorState, suggestions } = this.state;
    const { MentionSuggestions } = this.mentionPlugin;
    const plugins = [this.mentionPlugin];

    return (
      <div style={{flexGrow: 1}}>
        <Editor
          editorState={editorState}
          onChange={this.onEditorStateChange}
          placeholder={placeholder}
          readOnly={readOnly}
          plugins={plugins}
          ref={(element) => { this.editor = element; }}
        />
        <MentionSuggestions
            open={true}
          onSearchChange={this.onSearchChange}
          suggestions={suggestions}
        />
      </div>
    );
  }
}

MentionEditor.defaultProps = {
  users: [],
};
