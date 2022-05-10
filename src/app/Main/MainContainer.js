import React, { Component } from 'react';
import { connect } from 'react-redux';
import Main from './Main';

class MainContainer extends Component {
  componentDidMount() {
	  const {
	    fetchBookmarks,
	  } = this.props;
    fetchBookmarks();
  }

  render() {
    return (
      <Main {...this.props} />
    );
  }
}

const mapStateToProps = (state) => ({
  rightPanelVisible: state.app.rightPanelVisible,
  currentBubbleCode: state.app.currentBubbleCode,
});

const mapDispatchToProps = (dispatch) => ({
  addNotification: (type) => dispatch.notification.addNotification({ type }),
  setSuggestionSearchText: (searchText) => dispatch.suggestion.setSuggestionSearchText({ searchText }),
  setSuggestionSearchExtraText: (searchExtraText) => dispatch.suggestion.setSuggestionSearchExtraText({ searchExtraText }),
  setAddClauseText: (text) => dispatch.clause.setAddClauseText({ text }),
  clearSuggestions: () => dispatch.suggestion.clear(),
  setSidebarTab: (sidebarTab) => dispatch.app.setSidebarTab({ sidebarTab }),
  startTutorial: () => dispatch.app.startTutorial(),
  setCurrentBubbleCode: (bubbleCode) => dispatch.app.setCurrentBubbleCode(bubbleCode),
  fetchBookmarks: () => dispatch.bookmarks.fetchUserBookmarks(),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);
