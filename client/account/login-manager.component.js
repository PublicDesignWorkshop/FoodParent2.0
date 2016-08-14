import React from 'react';

require('./login-manager.component.scss');

let ServerSetting = require('./../../setting/server.json');

var FontAwesome = require('react-fontawesome');
import { localization } from './../utils/localization';
import { isValidEmailAddress } from './../utils/validation';
import { displaySuccessMessage, displayFailMessage } from './../message/popup.component';

import Instruction from './instruction.component';
let AuthActions = require('./../actions/auth.actions');


export default class LoginManager extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.submitLogin = this.submitLogin.bind(this);
  }
  componentWillMount() {
    this.setState({contact: "", password: ""});
  }
  componentDidMount () {

  }
  componentWillReceiveProps(nextProps) {

  }
  submitLogin() {
    let error: any = null;
    try {
      isValidEmailAddress(this.state.contact.trim());
      AuthActions.processLogin(this.state.contact.trim(), this.state.password);
    } catch(e) {
      displayFailMessage(localization(e.message));
      if (__DEV__) {
        console.error(localization(e.message));
      }
      error = e.message;
    }
    this.setState({error: error});
  }
  render () {
    return (
      <div className="login-manager-wrapper">
        <div className="login-manager-contact-label">
          <FontAwesome className='' name='user' /><label htmlFor={"managerin-contact"}> {localization(689)}</label>
        </div>
        <div className="login-manager-contact-data">
          <input type="email" name="email" className="login-manager-contact-input" id={"managerin-contact"} key={"managerin-contact"} placeholder={localization(683)}
            value={this.state.contact}
            autoComplete
            onChange={(event: any)=> {
              this.setState({contact: event.target.value.trim()});
            }}
            onKeyPress={(event)=> {
              if (event.key == 'Enter') {
                this.submitLogin();
              }
            }}
            onBlur={()=> {
              //self.submitLogin();
            }} />
        </div>

        <div className="login-manager-contact-label">
          <FontAwesome className='' name='user' /><label htmlFor={"managerin-password"}> {localization(690)}</label>
        </div>
        <div className="login-manager-contact-data">
          <input type="password" name="password" className="login-manager-password-input" id={"managerin-password"} key={"managerin-password"} placeholder={localization(683)}
            value={this.state.password}
            autoComplete
            onChange={(event: any)=> {
              this.setState({password: event.target.value});
            }}
            onKeyPress={(event)=> {
              if (event.key == 'Enter') {
                this.submitLogin();
              }
            }}
            onBlur={()=> {
              //self.submitLogin();
            }} />
        </div>

        <div className="solid-button-group no-left-right-padding">
          <div className="solid-button solid-button-green" onClick={() => {
            this.submitLogin();
            // TreeActions.setEditing(TreeStore.getState().selected, false);
            // this.setState({editing: false});
          }}>
            {localization(688) /* SAVE */}
          </div>
        </div>
      </div>
    );
  }
}
