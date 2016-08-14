import React from 'react';

require('./login.component.scss');

let ServerSetting = require('./../../setting/server.json');

var FontAwesome = require('react-fontawesome');
import { localization } from './../utils/localization';
import { LOGINMODE } from './../utils/enum';

import Instruction from './instruction.component';
import LoginParent from './login-parent.component';
import LoginManager from './login-manager.component';



export default class Login extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  componentWillMount() {
    this.setState({mode: LOGINMODE.PARENT});
    // this.setState({loginText: ""});
    // localization(993, window.navigator.userLanguage || window.navigator.language, function(response) {
    //   this.setState({loginText: response});
    // }.bind(this));
  }
  componentDidMount () {

  }
  componentWillReceiveProps() {

  }
  render () {
    let login;
    let action;
    if (this.state.mode == LOGINMODE.PARENT) {
       login = <LoginParent />;
       action = <div className="solid-button solid-button-green" onClick={() => {
         this.setState({mode: LOGINMODE.MANAGER});
         // TreeActions.setEditing(TreeStore.getState().selected, false);
         // this.setState({editing: false});
       }}>
         {localization(686) /* Manager Sign-In */}
       </div>;
    } else if (this.state.mode == LOGINMODE.MANAGER) {
       login = <LoginManager />;
       action = <div className="solid-button solid-button-green" onClick={() => {
         this.setState({mode: LOGINMODE.PARENT});
         // TreeActions.setEditing(TreeStore.getState().selected, false);
         // this.setState({editing: false});
       }}>
         {localization(685) /* Parent Sign-In */}
       </div>;
    }


    return (
      <div className="login-wrapper">
        <div className="right">
          {login}
          <div className="or">
            OR
          </div>
          <div className="solid-button-group">
            <div className="solid-button solid-button-green" onClick={() => {
              this.context.router.push({pathname: ServerSetting.uBase + "/register"});
            }}>
              {localization(684) /* SIGN UP */}
            </div>
          </div>
          <div className="solid-button-group">
            {action}
          </div>
        </div>
        <div className="left">
          <Instruction />
        </div>
      </div>
    );
  }
}
Login.contextTypes = {
    router: React.PropTypes.object.isRequired
}
