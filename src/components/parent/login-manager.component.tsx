import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Link } from 'react-router';
import * as AltContainer from 'alt-container';


import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as styles from './login-manager.component.css';
var Settings = require('./../../constraints/settings.json');

import MessageLineComponent from './../message/message-line.component';

import { processLogin } from './../../utils/authentication';
import { authActions } from './../../actions/auth.actions';

import { checkValidEmailAddress } from './../../utils/errorhandler';
import { displaySuccessMessage, displayErrorMessage } from './../../utils/message';
import { localization } from './../../constraints/localization';

export interface ILoginManagerProps {

}
export interface ILoginManagerStatus {
  contact?: string;
  password?: string;
  error?: any;
}

export default class LoginManagerComponent extends React.Component<ILoginManagerProps, ILoginManagerStatus> {
  private contactInput: any;
  private passwordInput: any;
  static contextTypes: any;
  constructor(props : ILoginManagerProps) {
    super(props);
    let self: LoginManagerComponent = this;
    this.state = {
      contact: "",
      password: "",
      error: null,
    };
  }

  public componentDidMount() {
    let self: LoginManagerComponent = this;
    self.updateProps(self.props);
  }

  public componentWillUnmount() {
    let self: LoginManagerComponent = this;
  }

  public componentWillReceiveProps (nextProps: ILoginManagerProps) {
    let self: LoginManagerComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps = (props: ILoginManagerProps) => {
    let self: LoginManagerComponent = this;
  }

  private submitLogin = () => {
    let self: LoginManagerComponent = this;
    let error: any = null;
    try {
      checkValidEmailAddress(self.state.contact.trim());
      authActions.processLogin(self.state.contact.trim(), self.state.password.trim());
    } catch(e) {
      displayErrorMessage(localization(e.message));
      error = e.message;
    }
    self.setState({error: error});
  }

  render() {
    let self: LoginManagerComponent = this;
    return (
      <div className={styles.wrapper}>
        <div className={styles.contactlabel}>
          <FontAwesome className='' name='caret-right' /><label htmlFor={"managerin-contact"}> {localization(689)}</label>
        </div>
        <div className={styles.contactname}>
          <input autoFocus type="email" className={styles.contactinput} id={"managerin-contact"} key={"managerin-contact"} placeholder={localization(683)}
            ref={(element) => self.contactInput = element}
            value={self.state.contact}
            autoComplete
            onChange={(event: any)=> {
              self.setState({contact: event.target.value, password: self.state.password});
            }}
            onKeyPress={(event)=> {
              if (event.key == 'Enter') {
                self.passwordInput.focus();
              }
            }}
            onBlur={()=> {
              //self.submitLogin();
            }} />
        </div>
        <div className={styles.contactlabel}>
          <FontAwesome className='' name='caret-right' /><label htmlFor={"managerin-contact"}> {localization(690)}</label>
        </div>
        <div className={styles.contactname}>
          <input autoFocus type="password" className={styles.contactinput} id={"managerin-password"} key={"managerin-password"} placeholder={localization(691)}
            ref={(element) => self.passwordInput = element}
            value={self.state.password}
            onChange={(event: any)=> {
              self.setState({contact: self.state.contact, password: event.target.value});
            }}
            onKeyPress={(event)=> {
              if (event.key == 'Enter') {
                self.submitLogin();
              }
            }}
            onBlur={()=> {
              //self.submitLogin();
            }} />
        </div>
        <div className={styles.buttongroup} onClick={()=> {
          self.submitLogin();
        }}>
          <div className={styles.button}>
            {localization(688)}
          </div>
        </div>
      </div>
    );
  }
}

LoginManagerComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};
