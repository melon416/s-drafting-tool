import React, { Component } from 'react';
import { NotificationContainer } from 'react-notifications';
import Loading from '../components/Loading';
import { LayoutRow, LayoutRows } from '../shared/components/Layout';
import HeaderContainer from './Header/HeaderContainer';
import MainContainer from './Main/MainContainer';
import './App.scss';
import 'react-notifications/lib/notifications.css';
import LoginContainer from '../components/LoginContainer';
import '../globalstyle';
import AccessDeniedContainer from '../components/access-denied/access-denied-container';

export default class AuthenticatedApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedLoggedIn: false,
    };
  }

  async componentDidMount() {
    const { requestAppContext } = this.props;
	  try {
	    await requestAppContext();
	  } finally {
	    this.setState({ checkedLoggedIn: true });
	  }
  }

  render() {
	  const { isLoggedIn, can_access_dt: canAccessDt } = this.props;
	  const { checkedLoggedIn } = this.state;

	  if (!isLoggedIn) {
	    if (checkedLoggedIn) {
	      return <LoginContainer />;
	    }

	    return <Loading />;
	  }

	  if (!canAccessDt) {
	    return <AccessDeniedContainer />;
	  }

	  return (
			<>
				<LayoutRows>
					<LayoutRow>
						<HeaderContainer />
						<div className="MainToolbar" />
					</LayoutRow>
					<LayoutRow flexible>
						<MainContainer />
					</LayoutRow>
				</LayoutRows>
				<NotificationContainer />
			</>
	  );
  }
}
