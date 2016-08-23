import React from 'react';

require('./login-parent.component.scss');

let ServerSetting = require('./../../setting/server.json');

var FontAwesome = require('react-fontawesome');
import { localization } from './../utils/localization';
import { isValidEmailAddress } from './../utils/validation';
import { displaySuccessMessage, displayFailMessage } from './../message/popup.component';

import Instruction from './instruction.component';
let AuthActions = require('./../actions/auth.actions');
let TreeStore = require('./../stores/tree.store');

export default class LoginParent extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.submitLogin = this.submitLogin.bind(this);
  }
  componentWillMount() {
    this.setState({contact: ""});
  }
  componentDidMount () {

  }
  componentWillReceiveProps(nextProps) {

  }
  submitLogin() {
    let error: any = null;
    try {
      isValidEmailAddress(this.state.contact.trim());
      AuthActions.processLogin(this.state.contact.trim(), this.state.contact.trim(), TreeStore.getState().selected);
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
      <div className="login-parent-wrapper">
        <div className="login-parent-contact-label">
          <FontAwesome className='' name='user' /><label htmlFor={"parentin-contact"}> {localization(687)}</label>
        </div>
        <div className="login-parent-contact-data">
          <input type="email" name="email" className="login-parent-contact-input" id={"parentin-contact"} key={"parentin-contact"} placeholder={localization(683)}
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
