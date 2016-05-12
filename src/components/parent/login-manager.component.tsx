import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as AltContainer from 'alt-container';

var Settings = require('./../../constraints/settings.json');
import * as styles from './login-manager.component.css';
import { checkValidEmailAddress, processLogin } from './../../utils/authentication';
import { treeStore } from './../../stores/tree.store';

export interface ILoginManagerProps {
}
export interface ILoginManagerStatus {
  contact: string;
  password: string;
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
    if (checkValidEmailAddress(self.state.contact.trim())) {
      processLogin(self.state.contact.trim(), self.state.password.trim(), function(response) { // Login success
        console.warn("login success");
        self.context.router.push({pathname: window.location.pathname});
        treeStore.fetchTrees();
      }, function(response) { // Login fail
        console.warn("login failed");
      }, function(response) { // Error

      });
    } else {

    }
  }

  render() {
    let self: LoginManagerComponent = this;
    return (
      <div className={styles.wrapper}>
        <div className={styles.contactlabel}>
          <FontAwesome className='' name='caret-right' /><label htmlFor={"managerin-contact"}> Manager Contact</label>
        </div>
        <div className={styles.contactname}>
          <input autoFocus type="email" className={styles.contactinput} id={"managerin-contact"} key={"managerin-contact"} placeholder="enter e-mail address..."
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
          <FontAwesome className='' name='caret-right' /><label htmlFor={"managerin-contact"}> Manager Password</label>
        </div>
        <div className={styles.contactname}>
          <input autoFocus type="password" className={styles.contactinput} id={"managerin-password"} key={"managerin-password"} placeholder="enter password..."
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
            SIGN IN
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
