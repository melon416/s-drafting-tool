import React, { Component } from 'react';
import { connect } from 'react-redux';
import ErrorDialog from './ErrorDialog';

class ErrorDialogContainer extends Component {
  render() {
    return (
      <ErrorDialog {...this.props} />
    );
  }
}

const mapStateToProps = (state) => ({
  error: state.app.error,
});

const mapDispatchToProps = (dispatch) => ({
  setError: (error) => dispatch.app.setError({ error }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ErrorDialogContainer);
