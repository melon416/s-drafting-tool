import React, { Component } from 'react';
import { Checkbox, Label } from 'office-ui-fabric-react';
import {
  PrimaryButton,DefaultButton
} from 'office-ui-fabric-react/lib/Button';
import Logo from '../app/Logo';
import './Login.css';

class Login extends Component {
	state = {
	  username: '',
	  password: '',
	  submitting: false,
	};

	mounted = false;

	componentDidMount() {
	  this.mounted = true;
    this.props.checkAzureLoginEnabled()
    const code = new URLSearchParams(window.location.search).get("code")
    if(code){
      this.props.loginWithAzure(code)
      }
	}

	componentWillUnmount() {
	  this.mounted = false;
	}

	handlePasswordKeyDown = (e) => {
	  if (e.keyCode === 13) {
	    this.login();
	  }
	};

	login = async () => {
	  const { username, password } = this.state;
	  const { login } = this.props;

	  this.setState({ submitting: true });
	  try {
	    await login({
	      username,
	      password,
	    });
	  } finally {
	    if (this.mounted) {
	      this.setState({ submitting: false });
	    }
	  }
	};

	render() {
	  const {
	    submitting, username, password,
	  } = this.state;
    const { getAzureLoginUrl } = this.props;
    const addIcon = { iconName: 'WindowsLogo' };
	  return (
      <div className="LoginWrapper">
        <div className="Login-card">
          <div className="Login">
            <h2 className="title">Sign In</h2>
            <div>
              <Logo lightMode />
              <div style={{ display: 'table-cell', paddingLeft: 20 }}>
                <h2>
                  Drafting Tool
                  {' '}
                  {(process.env.SYNTHEIA_ENV === 'production') && '(Public Version)'}
                </h2>
              </div>
            </div>
            <EditFieldList>

              <EditField title="Email">
                <input id="syntheiaUserEmail" value={username} onChange={(e) => this.setState({ username: e.target.value })} />
              </EditField>

              <EditField title="Password">
                <input id="syntheiaUserPassword" value={password} onChange={(e) => this.setState({ password: e.target.value })} type="password" onKeyDown={this.handlePasswordKeyDown} />
              </EditField>

            </EditFieldList>
            <div className="LoginButton">
            <div style={{flex:.5}}></div>
              <PrimaryButton
                id="syntheiaLoginBtn"
                onClick={this.login}
                disabled={!username || !password || submitting}
              >
                Login
              </PrimaryButton>
              {this.props.isAzureLoginEnabled ?  <DefaultButton
 									iconProps={addIcon}
 									onClick={getAzureLoginUrl}
 									text={"Login with azure"}
 								>
 									
	 								</DefaultButton> : null }
            </div>
          </div>
          {/* <div className="term-of-use">
            <Checkbox
              className="terms-checkbox"
              id="syntheiaTermsCheckBox"
              styles={{ text: { fontSize: 12, color: 'inherit' }, checkbox: { height: 15, width: 15 } }}
              onChange={(e, isChecked) => this.setState({ agreeToTerms: isChecked })}
            />
            <Label className="label-for-terms" htmlFor="terms">
              I agree to the
              {' '}
              <a href="https://www.syntheia.io/terms.html">Terms of Use</a>
            </Label>
          </div> */}
          <div className="need-help">
            Need help or forgot your password?
            {' '}
            <br />
            Please email your system administrator
          </div>
          <div className="notice">
            {(process.env.SYNTHEIA_ENV === 'production') && 'Please note that this version of our Drafting Tool is an <b>open community</b>. Please be mindful that information you disclose on the site is not confidential. '}
          </div>
        </div>
      </div>
	  );
	}
}

export class EditFieldList extends Component {
  render() {
    const { children } = this.props;
    return (
      <div className="EditFieldList">
        <ul>
          {children}
        </ul>
      </div>
    );
  }
}

export class EditField extends Component {
  render() {
    const { title, children } = this.props;

    return (
      <li className="EditField">
        <strong className="EditFieldLabel">{title}</strong>
        <span className="EditFieldInput">
          <div>{children}</div>
        </span>
      </li>
    );
  }
}

export default Login;
