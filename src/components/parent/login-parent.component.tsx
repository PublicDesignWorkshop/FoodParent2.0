import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Link } from 'react-router';
import * as AltContainer from 'alt-container';


import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as styles from './login-parent.component.css';
var Settings = require('./../../constraints/settings.json');

import MessageLineComponent from './../message/message-line.component';

import { authActions } from './../../actions/auth.actions';

import { processLogin } from './../../utils/authentication';
import { checkValidEmailAddress } from './../../utils/errorhandler';
import { displaySuccessMessage, displayErrorMessage } from './../../utils/message';
import { localization } from './../../constraints/localization';

export interface ILoginParentProps {

}
export interface ILoginParentStatus {
  contact?: string;
  password?: string;
  error?: any;
}

export default class LoginParentComponent extends React.Component<ILoginParentProps, ILoginParentStatus> {
  static contextTypes: any;
  constructor(props : ILoginParentProps) {
    super(props);
    let self: LoginParentComponent = this;
    this.state = {
      contact: "",
      password: "",
      error: null,
    };
  }

  public componentDidMount() {
    let self: LoginParentComponent = this;
    self.updateProps(self.props);
  }

  public componentWillUnmount() {
    let self: LoginParentComponent = this;
  }

  public componentWillReceiveProps (nextProps: ILoginParentProps) {
    let self: LoginParentComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps = (props: ILoginParentProps) => {
    let self: LoginParentComponent = this;
  }

  private submitLogin = () => {
    let self: LoginParentComponent = this;
    let error: any = null;
    try {
      checkValidEmailAddress(self.state.contact.trim());
      authActions.processLogin(self.state.contact.trim(), self.state.contact.trim());
    } catch(e) {
      displayErrorMessage(localization(e.message));
      error = e.message;
    }
    self.setState({error: error});
  }

  render() {
    let self: LoginParentComponent = this;
    return (
      <div className={styles.wrapper}>
        <div className={styles.contactlabel}>
          <FontAwesome className='' name='caret-right' /><label htmlFor={"parentin-contact"}> {localization(687)}</label>
        </div>
        <div className={styles.contactname}>
          <input type="email" className={styles.contactinput} id={"parentin-contact"} key={"parentin-contact"} placeholder={localization(683)}
            value={self.state.contact}
            autoComplete
            onChange={(event: any)=> {
              self.setState({contact: event.target.value, password: event.target.value});
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

LoginParentComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};
