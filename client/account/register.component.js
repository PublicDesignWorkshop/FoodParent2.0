import React from 'react';
import AltContainer from 'alt-container';

require('./register.component.scss');

let ServerSetting = require('./../../setting/server.json');
var FontAwesome = require('react-fontawesome');
import { localization } from './../utils/localization';
import { isValidEmailAddress } from './../utils/validation';
import { displaySuccessMessage, displayFailMessage } from './../message/popup.component';

import Instruction from './instruction.component';
let PersonActions = require('./../actions/person.actions');
let PersonStore = require('./../stores/person.store');
let AuthActions = require('./../actions/auth.actions');
import ParentContact from './../parent/parent-contact.component';
import ParentName from './../parent/parent-name.component';
import ParentAddress from './../parent/parent-address.component';
import ParentAuth from './../parent/parent-auth.component';


export default class Register extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  componentWillMount() {
    this.setState({contact: ""});
    PersonActions.createTempPerson();
  }
  componentDidMount () {

  }
  componentWillReceiveProps() {

  }
  submitRegister() {
    let error: any = null;
    try {
      isValidEmailAddress(PersonStore.getState().temp.contact);
      PersonActions.createPerson(PersonStore.getState().temp);
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
      <div className="register-wrapper">
        <div className="right">
          <AltContainer stores={
            {
              parent: function(props) {
                return {
                  store: PersonStore,
                  value: PersonStore.getState().temp
                }
              }
            }
          }>
            <ParentContact editing={true} />
            <ParentName editing={true} />
            <ParentAddress editing={true} />
            <ParentAuth editing={true} />
          </AltContainer>

          <div className="solid-button-group">
            <div className="solid-button solid-button-green" onClick={() => {
              this.submitRegister();
              // TreeActions.setEditing(TreeStore.getState().selected, false);
              // this.setState({editing: false});
            }}>
              {localization(684) /* SIGN UP */}
            </div>
          </div>
          <div className="or">
            OR
          </div>
          <div className="solid-button-group">
            <div className="solid-button solid-button-green" onClick={() => {
              this.context.router.push({pathname: ServerSetting.uBase + "/login"});
            }}>
              {localization(688) /* Parent Sign-In */}
            </div>
          </div>
        </div>
        <div className="left">
          <Instruction />
        </div>
      </div>
    );
  }
}
Register.contextTypes = {
    router: React.PropTypes.object.isRequired
}
